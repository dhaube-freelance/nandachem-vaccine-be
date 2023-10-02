import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { getAgeGroup, getVaccineOptions } from "./utils";
import { CompleteDoseDto } from "./dto/complete-dose.dto";

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePatientDto, userId: number) {
    const { email, name, dob, number, gender, street, vaccineId, batchId } =
      data;

    if (isNaN(Date.parse(dob))) {
      throw new BadRequestException("invalid date");
    }

    if (!userId) {
      throw new BadRequestException("invalid userId");
    }

    const { age, ageGroupId } = await getAgeGroup(this.prisma, vaccineId, dob);

    return this.prisma.patient.create({
      data: {
        email,
        name,
        dob: new Date(dob),
        number,
        gender,
        street,
        userId,
        vaccines: {
          create: {
            date: new Date(),
            doseNumber: 1,
            vaccineId,
            batchId,
            userId,
            age,
            ageGroupId,
          },
        },
      },
    });
  }

  async findFromPhoneNumber(number: string) {
    const records = await this.prisma.patientVaccine.findMany({
      where: {
        patient: {
          number,
        },
      },
      include: {
        ageGroup: true,
        patient: true,
        batch: true,
        vaccine: {
          include: {
            ageGroups: true,
          },
        },
      },
    });

    if (!records || !records.length) {
      throw new NotFoundException("record not found");
    }

    let latestRecord = records[0];

    records.forEach((record) => {
      if (record.doseNumber > latestRecord.doseNumber) {
        latestRecord = record;
      }
    });

    const { nextDose, vaccineOptions } = await getVaccineOptions(latestRecord);

    return {
      latestRecord,
      nextDose,
      vaccineOptions,
    };
  }

  async completeDose(
    { dob, doseNumber, batchId, patientId, vaccineId }: CompleteDoseDto,
    userId: number
  ) {
    const { age, ageGroupId } = await getAgeGroup(this.prisma, vaccineId, dob);

    return this.prisma.patientVaccine.create({
      data: {
        age,
        date: new Date(),
        doseNumber,
        ageGroupId,
        batchId,
        patientId,
        vaccineId,
        userId,
      },
    });
  }

  findAll() {
    return this.prisma.$queryRaw`SELECT
        p.id,
        p.name,
        p.email,
        p.number,
        p.gender ,
        p.dob,
        p.street, 
        MAX(pv.doseNumber) AS "doseNumber",
        ag.numberOfDose AS "availableDoses",
        ag.gapsInDays,
        MAX(pv.date) AS "date"
      FROM
        PatientVaccine pv
      LEFT JOIN Patient p ON
        p.id = pv.patientId
      LEFT JOIN AgeGroup ag ON
        ag.id = pv.ageGroupId
      GROUP BY
        p.id,
        p.name,
        p.email,
        p.number,
        p.gender ,
        p.dob,
        p.street,
        ag.numberOfDose,
        ag.gapsInDays;`;
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
