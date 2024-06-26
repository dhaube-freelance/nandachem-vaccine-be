import { Injectable } from '@nestjs/common';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VaccinesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVaccineDto) {
    const { name, type, manufacturer, ageGroups } = data;

    const newVaccine = await this.prisma.vaccine.create({
      data: {
        name,
        type,
        manufacturer,
        ageGroups: {
          createMany: {
            data: ageGroups,
          },
        },
      },
    });

    return newVaccine;
  }

  findAll() {
    return this.prisma.vaccine.findMany();
  }

  findAllWithBatches() {
    return this.prisma.vaccine.findMany({
      include: {
        batches: true,
      },
    });
  }

  async findAllWithDoseCount() {
    const _vaccines = await this.prisma.vaccine.findMany({
      include: {
        ageGroups: true,
      },
    });

    const vaccinesWithDoseCount = [];

    _vaccines.forEach(({ id, name, ageGroups }) => {
      let max = 1;
      ageGroups.forEach(({ numberOfDose }) => {
        if (numberOfDose > max) max = numberOfDose;
      });
      vaccinesWithDoseCount.push({ id, name, maxNumberOfDose: max });
    });

    return vaccinesWithDoseCount;
  }

  findOne(where: Prisma.VaccineWhereUniqueInput) {
    return this.prisma.vaccine.findUnique({ where });
  }

  async update(where: Prisma.VaccineWhereUniqueInput, data: UpdateVaccineDto) {
    const { name, type, manufacturer, ageGroups } = data;

    const updatedVaccine = await this.prisma.vaccine.update({
      where,
      data: {
        name,
        type,
        manufacturer,
      },
    });

    for (let i = 0; i < ageGroups.length; i++) {
      await this.prisma.ageGroup.update({
        where: {
          id: ageGroups[i].id,
        },
        data: { ...ageGroups[i] },
      });
    }

    return updatedVaccine;
  }

  remove(where: Prisma.VaccineWhereUniqueInput) {
    return this.prisma.vaccine.delete({ where });
  }
}
