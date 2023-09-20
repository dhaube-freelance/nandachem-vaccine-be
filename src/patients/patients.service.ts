import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { max, calculateAge, calculateDaysDifference } from './utils';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePatientDto) {
    const { email, name, dob, number, gender, street, batchId } = data;

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

    const dob = patient.dob;
    const age = calculateAge(dob.toString());

    const doses = patient.batch.vaccine.doses;
    const appropriateDoseCategory = doses.find(({ minAge, maxAge }) => {
      return age >= minAge && age <= maxAge;
    });

    if (!appropriateDoseCategory) {
      throw new BadRequestException(
        'No appropriate dose found for given vaccine and user',
      );
    }

    const daysSinceFirstDose = calculateDaysDifference(
      patient.firstVaccinationDate.toString(),
    );

    const gapsInDays = appropriateDoseCategory?.gapsInDays?.split(',');
    const currentDose = Number(patient.dosesTaken);

    const nextDose = currentDose + 1;
    let daysCounter = 0;
    let expectedDose = nextDose;

    for (let i = 0; i < gapsInDays.length; i++) {
      if (Number(gapsInDays[i]) + daysCounter > daysSinceFirstDose) {
        expectedDose = i + 1; // +1 because array index start from 0
        break;
      }
      daysCounter = Number(gapsInDays[i]);
    }

    const vaccineOptions: {
      number: number;
      completed: boolean;
      expected: boolean;
    }[] = [];

    const maxDoses = max([
      expectedDose,
      nextDose,
      appropriateDoseCategory?.numberOfDose,
    ]);

    for (let j = 0; j < maxDoses; j++) {
      const current = j + 1;
      vaccineOptions.push({
        number: current,
        completed: current < nextDose,
        expected: current === expectedDose,
      });
    }

    return {
      patient,
      vaccine: patient.batch.vaccine,
      batch: patient.batch,
      vaccineOptions,
    };
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
