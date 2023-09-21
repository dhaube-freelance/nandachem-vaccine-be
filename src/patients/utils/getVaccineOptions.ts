import { Batch, Dose, Patient, Vaccine } from '@prisma/client';
import { calculateAge, calculateDaysDifference, max } from '.';
import { BadRequestException } from '@nestjs/common';

export const getVaccineOptions = (
  patient: Patient & {
    batch: Batch & { vaccine: Vaccine & { doses: Dose[] } };
  },
) => {
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
  let overdue = false;

  for (let i = 0; i < gapsInDays.length; i++) {
    if (Number(gapsInDays[i]) + daysCounter > daysSinceFirstDose) {
      expectedDose = i + 1; // +1 because array index start from 0
      if(expectedDose > nextDose) overdue = true;
      break;
    }
    daysCounter = Number(gapsInDays[i]);

    if (i === gapsInDays.length - 1) {
      // last entry, it means overdue
      expectedDose = i + 1 + 1;
      overdue = true;
    }
  }

  const vaccineOptions: {
    number: number;
    completed: boolean;
    expected: boolean;
    overdue: boolean;
  }[] = [];

  const maxDoses =
    appropriateDoseCategory?.numberOfDose < max([expectedDose, nextDose])
      ? appropriateDoseCategory?.numberOfDose
      : max([expectedDose, nextDose]);

  for (let j = 0; j < maxDoses; j++) {
    const current = j + 1;
    vaccineOptions.push({
      number: current,
      completed: current < nextDose,
      expected: current === expectedDose,
      overdue: current >= nextDose && overdue,
    });
  }

  return { nextDose, vaccineOptions };
};
