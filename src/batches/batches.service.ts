import { Injectable } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { PrismaService } from 'src/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class BatchesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateBatchDto) {
    const { number, expiryDate } = data;
    return this.prisma.batch.create({
      data: {
        number,
        expiryDate: new Date(expiryDate),
      },
    });
  }

  findAll() {
    return this.prisma.batch.findMany();
  }

  findOne(where: Prisma.BatchWhereInput) {
    return this.prisma.batch.findFirst({ where });
  }

  update(where: Prisma.BatchWhereUniqueInput, data: UpdateBatchDto) {
    return this.prisma.batch.update({ where, data });
  }

  remove(where: Prisma.BatchWhereUniqueInput) {
    return this.prisma.batch.delete({ where });
  }
}
