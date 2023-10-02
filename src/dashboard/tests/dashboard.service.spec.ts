import { Test, TestingModule } from "@nestjs/testing";
import { DashboardService } from "../dashboard.service";
import { PrismaService } from "../../prisma.service";
import { MockPrismaService } from "./MockPrismaService";

describe("DashboardService", () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // there is nothing to test, the only test that needs to be done is the queries
});
