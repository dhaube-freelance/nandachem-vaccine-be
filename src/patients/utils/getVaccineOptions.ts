import {
  AgeGroup,
  Patient,
  PatientVaccine,
} from '@prisma/client';
import { calculateDaysDifference } from '.';
import { BadRequestException } from '@nestjs/common';

export const getVaccineOptions = (
  record: PatientVaccine & { patient: Patient } & {ageGroup: AgeGroup},
) => {

  const date = record?.date;
  const doseNumber = record?.doseNumber;
  const ageGroup = record.ageGroup;

  if( !date || !doseNumber || !ageGroup) {
    throw new BadRequestException('Invalid patient-vaccine record');
  }

  const daysSinceLastDose = calculateDaysDifference(
    date.toString()
  );

  const gapsInDays = ageGroup.gapsInDays?.split(',');
  const currentDose = Number(doseNumber);
  const currentGap = Number(gapsInDays[currentDose - 1]); // - 1 since array start from 0

  const nextDose = currentDose + 1;
  let expected = false;
  let overdue = false;

  if(daysSinceLastDose > currentGap - 15) {
    expected = true;
  }

  if(daysSinceLastDose  > currentGap + 15 )  {
    overdue = true;
  }


  const vaccineOptions: {
    number: number;
    completed: boolean;
    expected: boolean;
    overdue: boolean;
  }[] = [];

  for (let i = 1; i <= ageGroup.numberOfDose; i++) {
    vaccineOptions.push({
      number: i,
      completed: i < nextDose,
      expected: i === nextDose && expected,
      overdue: i === nextDose && overdue,
    });
  }

  return { nextDose, vaccineOptions };
};
