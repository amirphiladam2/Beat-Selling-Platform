import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { randomUUID } from 'crypto';
import type { StorageService } from 'src/storage/interfaces/storage.interface';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('STORAGE_SERVICE')
    private readonly storage: StorageService,

  ) { }

  async create(userId: number, data: CreateOrderDto) {
    const uniqueLicenseIds = [...new Set(data.licenseIds)];

    const licenses = await this.prisma.license.findMany({
      where: {
        id: { in: uniqueLicenseIds },
        isActive: true,
      },
    });

    if (licenses.length !== uniqueLicenseIds.length) {
      throw new NotFoundException(
        'One or more licenses not found or inactive',
      );
    }

    const exclusiveLicense = licenses.find(
      (license) => license.type === 'EXCLUSIVE',
    );

    const total = licenses.reduce(
      (sum, license) => sum + Number(license.price),
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      if (exclusiveLicense) {
        const existingPurchase = await tx.orderItem.findFirst({
          where: {
            licenseId: exclusiveLicense.id,
            order: {
              status: 'PAID',
            },
          },
        });

        if (existingPurchase) {
          throw new BadRequestException(
            'This exclusive license has already been purchased',
          );
        }
      }

      return tx.order.create({
        data: {
          userId,
          total,
          items: {
            create: licenses.map((license) => ({
              licenseId: license.id,
              price: license.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });
    });
  }

  async findByUser(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            license: {
              include: {
                beat: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findPurchases(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
        status: 'PAID',
      },
      include: {
        items: {
          include: {
            license: {
              include: {
                beat: true,
              },
            },
          },
        },
      },
      orderBy: {
        paidAt: 'desc',
      },
    });

    return orders.flatMap((order) =>
      order.items.map((item) => ({
        orderId: order.id,
        purchasedAt: order.paidAt,
        license: {
          id: item.license.id,
          type: item.license.type,
          price: item.price,
        },
        beat: {
          id: item.license.beat.id,
          title: item.license.beat.title,
          description: item.license.beat.description,
          genre: item.license.beat.genre,
          mood: item.license.beat.mood,
          bpm: item.license.beat.bpm,
          coverUrl: item.license.beat.coverUrl,
        },
      })),
    );
  }

  async findOne(id: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        items: {
          include: {
            license: {
              include: {
                beat: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async markAsPaid(id: number, paymentReference: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: {
          include: {
            license: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!order.paymentReference) {
      throw new BadRequestException('Order has not been checked out');
    }

    if (order.paymentReference !== paymentReference) {
      throw new BadRequestException('Invalid payment reference');
    }

    return this.prisma.$transaction(async (tx) => {
      /*
       * Lock the order row.
       *
       * This prevents two payment confirmations for the
       * same order from processing simultaneously.
       */
      const lockedOrder = await tx.$queryRaw<
        { id: number; status: string }[]
      >`
        SELECT "id", "status"
        FROM "Order"
        WHERE "id" = ${id}
        FOR UPDATE
      `;

      if (lockedOrder.length === 0) {
        throw new NotFoundException('Order not found');
      }

      /*
       * Check the CURRENT status while the order is locked.
       *
       * If another request already paid the order,
       * this request simply returns the existing order.
       */
      if (lockedOrder[0].status === 'PAID') {
        return tx.order.findUnique({
          where: {
            id,
          },
        });
      }

      if (lockedOrder[0].status !== 'PENDING') {
        throw new BadRequestException(
          'Only pending orders can be marked as paid',
        );
      }

      /*
       * Fetch the order and its licenses INSIDE the transaction.
       *
       * This gives us transaction-consistent data instead of
       * relying on the order object fetched before the transaction.
       */
      const currentOrder = await tx.order.findUnique({
        where: {
          id,
        },
        include: {
          items: {
            include: {
              license: true,
            },
          },
        },
      });

      if (!currentOrder) {
        throw new NotFoundException('Order not found');
      }

      const exclusiveLicenseIds = currentOrder.items
        .filter((item) => item.license.type === 'EXCLUSIVE')
        .map((item) => item.licenseId);

      /*
       * For now we lock the first exclusive license.
       *
       * This protects the current one-exclusive-per-order
       * payment scenario from concurrent purchases.
       */
      if (exclusiveLicenseIds.length > 0) {
        const lockedLicense = await tx.$queryRaw<
          { id: number; isActive: boolean }[]
        >`
          SELECT "id", "isActive"
          FROM "License"
          WHERE "id" = ${exclusiveLicenseIds[0]}
          FOR UPDATE
        `;

        if (
          lockedLicense.length === 0 ||
          !lockedLicense[0].isActive
        ) {
          throw new BadRequestException(
            'One or more exclusive licenses are no longer available',
          );
        }
      }

      /*
       * Payment succeeds.
       */
      const updatedOrder = await tx.order.update({
        where: {
          id,
        },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      });

      /*
       * Once an exclusive license has been purchased,
       * deactivate it so nobody else can purchase it.
       */
      if (exclusiveLicenseIds.length > 0) {
        await tx.license.updateMany({
          where: {
            id: {
              in: exclusiveLicenseIds,
            },
          },
          data: {
            isActive: false,
          },
        });
      }

      return updatedOrder;
    });
  }

  async cancel(id: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        'Only pending orders can be cancelled',
      );
    }

    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  async checkout(id: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        items: {
          include: {
            license: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        'Only pending orders can be checked out',
      );
    }

    const unavailableLicense = order.items.find(
      (item) => !item.license.isActive,
    );

    if (unavailableLicense) {
      throw new BadRequestException(
        'One or more licenses are no longer available',
      );
    }

    /*
     * If checkout was already performed, return
     * the existing payment reference instead of creating
     * another one.
     */
    if (order.paymentReference) {
      return {
        orderId: order.id,
        paymentReference: order.paymentReference,
        amount: order.total,
      };
    }

    const paymentReference = `PAY-${randomUUID()}`;

    const updatedOrder = await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        paymentReference,
      },
    });

    return {
      orderId: updatedOrder.id,
      paymentReference: updatedOrder.paymentReference,
      amount: updatedOrder.total,
    };
  }

  async getDownload(itemId: number, userId: number) {
    const item = await this.prisma.orderItem.findFirst({
      where: {
        id: itemId,
        order: {
          userId,
          status: 'PAID',
        },
      },
      include: {
        license: {
          include: {
            beat: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Purchase not found');
    }

    const downloadUrl = await this.storage.getDownloadUrl(
      item.license.beat.audioKey,
    );

    return {
      itemId: item.id,
      license: {
        id: item.license.id,
        type: item.license.type,
      },
      beat: {
        id: item.license.beat.id,
        title: item.license.beat.title,
        downloadUrl,
      },
    };
  }
} 

