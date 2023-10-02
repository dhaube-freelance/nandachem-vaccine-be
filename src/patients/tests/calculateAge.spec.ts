import { calculateAge } from '../utils';

describe('test calculateAge function', () => {
  it('should return 1', () => {
    const today = new Date();
    const newDate = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate() - 1,
    );
    expect(calculateAge(newDate.toString())).toBe(1);
  });

  it('should return 0', () => {
    const today = new Date();
    const newDate = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate() + 1,
    );
    expect(calculateAge(newDate.toString())).toBe(0);
  });
});
