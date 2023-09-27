import { calculateAge, calculateDaysDifference } from '.';

describe('patients utils functions test', () => {
  test('calculateAge function', () => {
    const today = new Date();
    expect(
      calculateAge(
        `${today.getFullYear() - 1}/${today.getMonth() - 1}/${
          today.getDate() - 1
        }`,
      ),
    ).toBe(1);
    expect(
      calculateAge(
        `${today.getFullYear() - 1}/${today.getMonth() + 1}/${
          today.getDate() + 1
        }`,
      ),
    ).toBe(0);
  });

  test('calculateDaysDifference function', () => {
    const today = new Date();
    const yesterday = `${today.getFullYear()}/${today.getMonth() + 1}/${
      today.getDate() - 1
    }`;
    expect(calculateDaysDifference(yesterday)).toBe(1);
  });

  test("getVaccineOptions function", () => {
    
  })
});
