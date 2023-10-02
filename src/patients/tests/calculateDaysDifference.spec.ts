import { calculateDaysDifference } from "../utils";

describe('calculateDaysDifference function', () => {
it('should return 1', () => {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), 
      today.getDate() - 1
    );
    expect(calculateDaysDifference(yesterday.toString())).toBe(1);
  });
})
