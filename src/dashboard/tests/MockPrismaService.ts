export class MockPrismaService {
  get vaccine() {
    return {
      findUnique: () => {
        return {
          id: 1,
          name: "Cecolin",
          ageGroups: [
            {
              minAge: 10,
              maxAge: 20,
              numberOfDose: 2,
              gapsInDays: "180",
            },
            {
              minAge: 21,
              maxAge: 30,
              numberOfDose: 3,
              gapsInDays: "30,150",
            },
          ],
        };
      },
    };
  }
}
