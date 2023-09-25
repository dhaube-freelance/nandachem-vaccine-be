import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  getVaccineOptions,
} from './utils';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePatientDto, userId: number) {
    const { email, name, dob, number, gender, street, batchId } = data;

    if (isNaN(Date.parse(dob))) {
      throw new BadRequestException('invalid date');
    }

    if(!userId) {
      throw new BadRequestException('invalid userId');
    }

    return this.prisma.patient.create({
      data: {
        email,
        name,
        dob: new Date(dob),
        number,
        gender,
        street,
        userId,
        batchId,
      },
    });
  }

  async findFromPhoneNumber(number: string) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        number,
      },
      include: {
        batch: {
          include: {
            vaccine: {
              include: { doses: true },
            },
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException();
    }

    const { nextDose, vaccineOptions } = getVaccineOptions(patient);

    return {
      patient,
      vaccine: patient.batch.vaccine,
      batch: patient.batch,
      nextDose,
      vaccineOptions,
    };
  }

  completeDose(id: number, dosesTaken: string | number) {
    return this.prisma.patient.update({
      where: {
        id,
      },
      data: {
        dosesTaken: Number(dosesTaken),
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
