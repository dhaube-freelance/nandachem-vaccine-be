import { Injectable } from '@nestjs/common';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VaccinesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateVaccineDto) {

    const { name, type, manufacturer, doses } = data;

    const newVaccine = await this.prisma.vaccine.create({
      data: {
        name, type, manufacturer, doses: {
          createMany: {
            data: doses
          }
        }
      }
    });


    return newVaccine;
  }

  findAll() {
    return this.prisma.vaccine.findMany();
  }

  findOne(where: Prisma.VaccineWhereUniqueInput) {
    return this.prisma.vaccine.findUnique({ where });
  }

  async update(where: Prisma.VaccineWhereUniqueInput, data: UpdateVaccineDto) {
    const { name, type, manufacturer, doses } = data;

    const updatedVaccine = await this.prisma.vaccine.update({
      where, data: {
        name, type, manufacturer
      }
    });

    for (let i = 0; i < doses.length; i++) {
      await this.prisma.dose.update({
        where: {
          id: doses[i].id
        }
        , data: { ...doses[i] }
      })
    }

    return updatedVaccine;
  }

  remove(where: Prisma.VaccineWhereUniqueInput) {
    return this.prisma.vaccine.delete({ where });
  }
}
