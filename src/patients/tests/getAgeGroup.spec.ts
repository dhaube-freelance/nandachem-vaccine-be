import { NotFoundException } from '@nestjs/common';
import { getAgeGroup } from '../utils';

class MockPrismaService {
  get vaccine() {
    return {
      findFirst: () => {
        return Promise.resolve({
          ageGroups: [
            {
              id: 113,
              minAge: 6,
              maxAge: 10,
            },
            {
              id: 115,
              minAge: 11,
              maxAge: 15,
            },
          ],
        });
      },
    };
  }
}

describe('getAgeGroup util function', () => {
  it('should throw appropriate age-group not found error', async () => {
    const today = new Date();

    try {
      await getAgeGroup(
        // @ts-ignore
        new MockPrismaService(),
        1,
        new Date(
          today.getFullYear() - 5,
          today.getMonth(),
          today.getDate(),
        ).toString(),
      );
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should return ageGroupId 113', async () => {
    const today = new Date();

    const result1 = await getAgeGroup(
      // @ts-ignore
      new MockPrismaService(),
      1,
      new Date(
        today.getFullYear() - 6,
        today.getMonth(),
        today.getDate() - 1,
      ).toString(),
    );

    expect(result1.ageGroupId).toBe(113);

    const result2 = await getAgeGroup(
      // @ts-ignore
      new MockPrismaService(),
      1,
      new Date(
        today.getFullYear() - 10,
        today.getMonth() - 11,
        today.getDate(),
      ).toString(),
    );

    expect(result2.ageGroupId).toBe(113);


    const result3 = await getAgeGroup(
      // @ts-ignore
      new MockPrismaService(),
      1,
      new Date(
        today.getFullYear() - 11,
        today.getMonth(),
        today.getDate() + 1,
      ).toString(),
    );

    expect(result3.ageGroupId).toBe(113);
  });

  it('should return ageGroupId 115', async () => {
    const today = new Date();

    const result = await getAgeGroup(
      // @ts-ignore
      new MockPrismaService(),
      1,
      new Date(
        today.getFullYear() - 11,
        today.getMonth(),
        today.getDate() - 1,
      ).toString(),
    );

    expect(result.ageGroupId).toBe(115);
  });
});
