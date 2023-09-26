import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDoseCompletion(vaccineId: number, userId: number) {
    const vaccine = await this.prisma.vaccine.findUnique({
      where: { id: vaccineId },
      include: { doses: true },
    });

    const doses = vaccine.doses;

    if (!doses || !doses.length) {
      throw new BadRequestException('could not find doses for given vaccine');
    }

    let completed = 0;
    let total = 0;

    for (let i = 0; i < doses.length; i++) {
      const { minAge, maxAge, numberOfDose } = doses[i];
      const today = new Date();
      const _totalPatients = await this.prisma.patient.count({
        where: {
          batch: { vaccineId: vaccine.id },
          dob: {
            gt: new Date(
              today.getFullYear() - maxAge,
              today.getMonth(),
              today.getDate(),
            ).toISOString(),
            lt: new Date(
              today.getFullYear() - minAge,
              today.getMonth(),
              today.getDate(),
            ).toISOString(),
          },
          userId,
        },
      });
      const _completedPatients = await this.prisma.patient.count({
        where: {
          dosesTaken: numberOfDose,
          batch: { vaccineId: vaccine.id },
          dob: {
            gte: new Date(
              today.getFullYear() - maxAge,
              today.getMonth(),
              today.getDate(),
            ).toISOString(),
            lte: new Date(
              today.getFullYear() - minAge,
              today.getMonth(),
              today.getDate(),
            ).toISOString(),
          },
          userId,
        },
      });

      completed += _completedPatients;
      total += _totalPatients;
    }

    return { completed, total };
  }

  // TODO: Add dates for the doses update and fix the counts
  async getDoseCounts(vaccineId: number, userId: number) {
    const vaccine = await this.prisma.vaccine.findUnique({
      where: { id: vaccineId },
      include: { doses: true },
    });

    const doses = vaccine.doses;

    if (!doses || !doses.length) {
      throw new BadRequestException('could not find doses for given vaccine');
    }

    let maxDose = 0;

    doses.forEach(({ numberOfDose }) => {
      if (numberOfDose > maxDose) {
        maxDose = numberOfDose;
      }
    });

    const count: number[] = [];

    for (let i = 1; i <= maxDose; i++) {
      count.push(
        await this.prisma.patient.count({
          where: {
            batch: { vaccineId: vaccine.id },
            dosesTaken: i,
            userId,
          },
        }),
      );
    }

    for (let i = count.length - 1; i >= 0; i--) {
      if (i === count.length - 1) continue;
      count[i] = count[i] + count[i + 1];
    }

    return count;
  }

  async getDoseAnalytics(
    vaccineId: number,
    doseNumber: number,
    type: 'WEEK' | 'MONTH',
    userId: number,
  ) {
    const analyticsCount = 6;

    const vaccine = await this.prisma.vaccine.findUnique({
      where: { id: vaccineId },
      include: { doses: true },
    });

    const counts: number[] = [];

    for (let i = 0; i < analyticsCount; i++) {
      const today = new Date();

      const _gt =
        type === 'MONTH'
          ? new Date(today.getFullYear(), today.getMonth() - i - 1, 0)
          : new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - today.getDay() - (i + 1) * 7, // - today.getDay() for start of the week i.e. Sunday
            );

      const _lte =
        type === 'MONTH'
          ? new Date(today.getFullYear(), today.getMonth() - i, 0)
          : new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - today.getDay() - i * 7, 
            );

      counts.push(
        await this.prisma.patient.count({
          where: {
            batch: { vaccineId: vaccine.id },
            firstVaccinationDate: {
              // today's record doesn't count. but the record from a month ago counts
              gt: _gt.toISOString(),
              lte: _lte.toISOString(),
            },
            dosesTaken: doseNumber,
            userId,
          },
        }),
      );
    }

    return counts;
  }
}
