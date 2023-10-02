import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDoseCompletion(vaccineId: number, userId: number) {
    const vaccine = await this.prisma.vaccine.findUnique({
      where: { id: vaccineId },
      include: { ageGroups: true },
    });

    const ageGroups = vaccine.ageGroups;

    if (!ageGroups || !ageGroups.length) {
      throw new NotFoundException("could not find doses for given vaccine");
    }

    let completed = 0;
    let total = 0;

    for (let i = 0; i < ageGroups.length; i++) {
      const { minAge, maxAge, numberOfDose } = ageGroups[i];
      const today = new Date();
      const lastYear = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()
      );

      // TODO: check this value
      const _totalRecords = await this.prisma.patientVaccine.groupBy({
        by: ["patientId", "vaccineId"],
        where: {
          date: {
            gte: lastYear,
          },
          vaccineId: vaccine.id,
          age: {
            gte: minAge,
            lte: maxAge,
          },
          userId,
        },
      });

      const _completedPatients = await this.prisma.patientVaccine.count({
        where: {
          date: {
            gte: lastYear,
          },
          doseNumber: numberOfDose,
          vaccineId: vaccine.id,
          age: {
            gte: minAge,
            lte: maxAge,
          },
          userId,
        },
      });

      completed += _completedPatients;
      total += _totalRecords.length;
    }

    return { completed, total };
  }

  async getDoseCounts(
    vaccineId: number,
    type: "WEEK" | "MONTH",
    userId: number,
  ) {
    const vaccine = await this.prisma.vaccine.findUnique({
      where: { id: vaccineId },
      include: { ageGroups: true },
    });

    const ageGroups = vaccine.ageGroups;

    if (!ageGroups || !ageGroups.length) {
      throw new NotFoundException("could not find doses for given vaccine");
    }

    let maxDose = 0;

    ageGroups.forEach(({ numberOfDose }) => {
      if (numberOfDose > maxDose) {
        maxDose = numberOfDose;
      }
    });

    const count: number[] = [];

    const today = new Date();
    const _gte =
      type === "MONTH"
        ? new Date(today.getFullYear(), today.getMonth() - 1, 1)
        : new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - today.getDay()
          );

    for (let i = 1; i <= maxDose; i++) {
      count.push(
        await this.prisma.patientVaccine.count({
          where: {
            date: {
              gte: _gte,
            },
            vaccineId,
            doseNumber: i,
            userId,
          },
        })
      );
    }

    return count;
  }

  async getDoseAnalytics(
    vaccineId: number,
    doseNumber: number,
    type: "WEEK" | "MONTH",
    userId: number
  ) {
    const ANALYTICS_COUNT = 6;

    const vaccine = await this.prisma.vaccine.findUnique({
      where: { id: vaccineId },
    });

    if (!vaccine) {
      throw new NotFoundException("vaccine not found");
    }

    const counts: number[] = [];

    for (let i = ANALYTICS_COUNT - 1; i >= 0; i--) {
      const today = new Date();

      const _gte =
        type === "MONTH"
          ? new Date(today.getFullYear(), today.getMonth() - i, 1)
          : new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - today.getDay() - i * 7
            );

      const _lte =
        type === "MONTH"
          ? new Date(today.getFullYear(), today.getMonth() - i + 1, 0) // 0 will make the last day of previous month
          : new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - today.getDay() - (i - 1) * 7
            );

      counts.push(
        await this.prisma.patientVaccine.count({
          where: {
            vaccineId: vaccine.id,
            date: {
              gte: _gte,
              lte: _lte,
            },
            doseNumber,
            userId,
          },
        })
      );
    }

    return counts;
  }
}
