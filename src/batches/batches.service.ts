import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { PrismaService } from '../prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class BatchesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateBatchDto) {
    const { number, expiryDate , vaccineId} = data;
    
    if (isNaN(Date.parse(expiryDate))) {
      throw new BadRequestException('invalid date');
    }
    
    return this.prisma.batch.create({
      data: {
        number,
        expiryDate: new Date(expiryDate),
        vaccineId,
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
    const { number, expiryDate } = data;

    const newDate = new Date(expiryDate);

    if (isNaN(Date.parse(expiryDate))) {
      throw new BadRequestException('invalid date');
    }
    return this.prisma.batch.update({
      where,
      data: {
        number,
        expiryDate: newDate,
      },
    });
  }

  remove(where: Prisma.BatchWhereUniqueInput) {
    return this.prisma.batch.delete({ where });
  }
}
