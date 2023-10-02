import { BadRequestException } from '@nestjs/common';
import { getVaccineOptions } from '../utils';

const today = new Date();

const record1 = {
  date: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
  doseNumber: 1,
  ageGroup: {
    numberOfDose: 3,
    gapsInDays: '30,150',
  },
};

const record2 = {
  date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14),
  doseNumber: 1,
  ageGroup: {
    numberOfDose: 3,
    gapsInDays: '30,150',
  },
};

const record3 = {
  date: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 134,
  ),
  doseNumber: 2,
  ageGroup: {
    numberOfDose: 3,
    gapsInDays: '30,150',
  },
};

const record4 = {
  date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 145),
  doseNumber: 2,
  ageGroup: {
    numberOfDose: 3,
    gapsInDays: '30,150',
  },
};

const record5 = {
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 46),
    doseNumber: 1,
    ageGroup: {
      numberOfDose: 3,
      gapsInDays: '30,150',
    },
  };

  const record6 = {
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 166),
    doseNumber: 2,
    ageGroup: {
      numberOfDose: 3,
      gapsInDays: '30,150',
    },
  };

describe('getVaccineOptions util function', () => {
  it('should throw error', () => {
    try {
      // @ts-ignore
      getVaccineOptions({});
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should expect dose number 2', () => {
    // @ts-ignore
    const result1 = getVaccineOptions(record1);
    expect(result1).toStrictEqual({
      nextDose: 2,
      vaccineOptions: [
        { number: 1, completed: true, expected: false, overdue: false },
        { number: 2, completed: false, expected: true, overdue: false },
        { number: 3, completed: false, expected: false, overdue: false },
      ],
    });
  });

  it('should expect dose in-eligible', () => {
    // @ts-ignore
    const result2 = getVaccineOptions(record2);
    expect(result2).toStrictEqual({
      nextDose: 2,
      vaccineOptions: [
        { number: 1, completed: true, expected: false, overdue: false },
        { number: 2, completed: false, expected: false, overdue: false },
        { number: 3, completed: false, expected: false, overdue: false },
      ],
    });

    // @ts-ignore
    const result3 = getVaccineOptions(record3);
    expect(result3).toStrictEqual({
      nextDose: 3,
      vaccineOptions: [
        { number: 1, completed: true, expected: false, overdue: false },
        { number: 2, completed: true, expected: false, overdue: false },
        { number: 3, completed: false, expected: false, overdue: false },
      ],
    });
  });

  it('should expect dose number 3', () => {
    // @ts-ignore
    const result4 = getVaccineOptions(record4);
    expect(result4).toStrictEqual({
      nextDose: 3,
      vaccineOptions: [
        { number: 1, completed: true, expected: false, overdue: false },
        { number: 2, completed: true, expected: false, overdue: false },
        { number: 3, completed: false, expected: true, overdue: false },
      ],
    });
  });

  it('should expect overdue', () => {
    // @ts-ignore
    const result5 = getVaccineOptions(record5);
    expect(result5).toStrictEqual({
      nextDose: 2,
      vaccineOptions: [
        { number: 1, completed: true, expected: false, overdue: false },
        { number: 2, completed: false, expected: true, overdue: true },
        { number: 3, completed: false, expected: false, overdue: false },
      ],
    });

    // @ts-ignore
    const result6 = getVaccineOptions(record6);
    expect(result6).toStrictEqual({
      nextDose: 3,
      vaccineOptions: [
        { number: 1, completed: true, expected: false, overdue: false },
        { number: 2, completed: true, expected: false, overdue: false },
        { number: 3, completed: false, expected: true, overdue: true },
      ],
    });
  });
});
