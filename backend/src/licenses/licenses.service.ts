import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLicenseDto } from './dto/create-license.dto';
import {
  UpdateLicenseDto

} from './dto/update-license.dto';
@Injectable()
export class LicensesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateLicenseDto) {
    return this.prisma.license.create({
      data: {
        type: data.type,
        price: data.price,
        beatId: data.beatId,
      },
    });
  }
  async update(id: number, data: UpdateLicenseDto) {
    return this.prisma.license.update({
      where: { id },
      data,
    });
  }
  async findAll() {
    return this.prisma.license.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const license = await this.prisma.license.findUnique({
      where: { id },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    return license;
  }

  async remove(id: number) {
    const license = await this.prisma.license.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    if (license.orderItems.length > 0) {
      return this.prisma.license.update({
        where: { id },
        data: {
          isActive: false,
        },
      });
    }

    return this.prisma.license.delete({
      where: { id },
    });
  }
}
