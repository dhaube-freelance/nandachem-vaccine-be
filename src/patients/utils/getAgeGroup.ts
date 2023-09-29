import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { calculateAge } from '.';

export const getAgeGroup = async (
  prisma: PrismaService,
  vaccineId: number,
  dob: string,
) => {
  const vaccine = await prisma.vaccine.findFirst({
    include: { ageGroups: true },
    where: { id: vaccineId },
  });

  if (!vaccine) {
    throw new NotFoundException('vaccine not found');
  }

  const ageGroups = vaccine.ageGroups;

  if (!ageGroups || !ageGroups.length) {
    throw new NotFoundException('vaccine age-groups not found');
  }

  const age = calculateAge(dob);
  const ageGroup = ageGroups.find(({ minAge, maxAge }) => {
    return age >= minAge && age <= maxAge;
  });

  return { age, ageGroupId: ageGroup.id };
};
