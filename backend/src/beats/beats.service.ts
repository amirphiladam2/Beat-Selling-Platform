import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBeatDto } from './dto/create-beat.dto';
import { GetBeatsDto } from './dto/get-beats.dto';
import { UpdateBeatDto } from './dto/update-beat-dto';

@Injectable()
export class BeatsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateBeatDto) {
        return this.prisma.beat.create({
            data: {
                title: data.title,
                description: data.description,
                genre: data.genre,
                mood: data.mood,
                bpm: data.bpm,
                featured: data.featured,
                audioKey: data.audioKey,
                coverUrl: data.coverUrl
            }
        })
    }

    async findAll(query: GetBeatsDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 12;

        const skip = (page - 1) * limit;

        const where = {
            ...(query.genre && { genre: query.genre }),
            ...(query.mood && { mood: query.mood }),

            ...((query.minBpm !== undefined || query.maxBpm !== undefined) && {
                bpm: {
                    ...(query.minBpm !== undefined && { gte: query.minBpm }),
                    ...(query.maxBpm !== undefined && { lte: query.maxBpm }),
                },
            }),

            ...(query.featured !== undefined && {
                featured: query.featured,
            }),

            ...(query.search && {
                title: {
                    contains: query.search,
                    mode: 'insensitive' as const,
                },
            }),

            ...((query.licenseType ||
                query.minPrice !== undefined ||
                query.maxPrice !== undefined) && {
                licenses: {
                    some: {
                        ...(query.licenseType && {
                            type: query.licenseType,
                        }),

                        ...((query.minPrice !== undefined ||
                            query.maxPrice !== undefined) && {
                            price: {
                                ...(query.minPrice !== undefined && {
                                    gte: query.minPrice,
                                }),
                                ...(query.maxPrice !== undefined && {
                                    lte: query.maxPrice,
                                }),
                            },
                        }),
                    },
                },
            }),
        };

        const [total, beats] = await Promise.all([
            this.prisma.beat.count({
                where,
            }),

            this.prisma.beat.findMany({
                where,
                include: {
                    licenses: true,
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: beats,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
            },
        };
    }

    async findOne(id: number) {
        const beat = await this.prisma.beat.findUnique({
            where: { id },
            include: {
                licenses: true,
            },
        });

        if (!beat) {
            throw new NotFoundException('Beat Not found');
        }
        return beat;
    }

    async update(id:number,data:UpdateBeatDto){
        const beat = await this.prisma.beat.findUnique({
            where:{id},
        });

        if(!beat){
            throw new NotFoundException('Beat not found');
        }


        return this.prisma.beat.update({
            where:{id},
            data,
            include:{
                licenses:true,
            },
        });
    }

    async remove(id:number){
      const beat = await this.prisma.beat.findUnique({
        where:{id},
      });

      if(!beat){
        throw new NotFoundException('Beat not found');
      }

    await this.prisma.license.deleteMany({
        where:{
            beatId:id,
        },
    });

    return this.prisma.beat.delete({
        where:{id},
    });
  }
}
