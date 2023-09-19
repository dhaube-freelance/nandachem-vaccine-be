import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) { }

  create(data: CreatePatientDto) {
    const {
      email,
      name,
      dob,
      number,
      gender,
      street,
      vaccineId
    } = data;

    if (isNaN(Date.parse(dob))) {
      throw new BadRequestException('invalid date');
    }

    return this.prisma.patient.create({
      data: {
        email,
        name,
        dob: new Date(dob),
        number,
        gender,
        street,
        vaccineId,
      },
    });
  }

  findAll() {
    return this.prisma.patient.findMany();
  }

  findOne(where: Prisma.PatientWhereUniqueInput) {
    return this.prisma.patient.findFirst({ where });
  }

  update(where: Prisma.PatientWhereUniqueInput, data: UpdatePatientDto) {
    return this.prisma.patient.update({ where, data });
  }

  remove(where: Prisma.PatientWhereUniqueInput) {
    return this.prisma.patient.delete({ where });
  }
}
