import { Injectable } from '@nestjs/common';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VaccinesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateVaccineDto) {
    return this.prisma.vaccine.create({ data });
  }

  findAll() {
    return this.prisma.vaccine.findMany();
  }

  findOne(where: Prisma.VaccineWhereUniqueInput) {
    return this.prisma.vaccine.findUnique({ where });
  }

  update(where: Prisma.VaccineWhereUniqueInput, data: UpdateVaccineDto) {
    return this.prisma.vaccine.update({ where, data });
  }

  remove(where: Prisma.VaccineWhereUniqueInput) {
    return this.prisma.vaccine.delete({ where });
  }
}
