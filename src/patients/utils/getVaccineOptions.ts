import {
  AgeGroup,
  Patient,
  PatientVaccine,
} from '@prisma/client';
import { calculateDaysDifference } from '.';

export const getVaccineOptions = async (
  record: PatientVaccine & { patient: Patient } & {ageGroup: AgeGroup},
) => {
  const daysSinceLastDose = calculateDaysDifference(
    record.date.toString()
  );

  const gapsInDays = record.ageGroup.gapsInDays?.split(',');
  const currentDose = Number(record.doseNumber);
  const currentGap = Number(gapsInDays[currentDose - 1]); // - 1 since array start from 0

  const nextDose = currentDose + 1;
  let expected = false;
  let overdue = false;

  if(currentGap - 15 < daysSinceLastDose) {
    expected = true;
  }

  if(currentGap + 15 < daysSinceLastDose)  {
    overdue = true;
  }


  const vaccineOptions: {
    number: number;
    completed: boolean;
    expected: boolean;
    overdue: boolean;
  }[] = [];

  for (let i = 1; i <= record.ageGroup.numberOfDose; i++) {
    vaccineOptions.push({
      number: i,
      completed: i < nextDose,
      expected: i === nextDose && expected,
      overdue: i === nextDose && overdue,
    });
  }

  return { nextDose, vaccineOptions };
};
