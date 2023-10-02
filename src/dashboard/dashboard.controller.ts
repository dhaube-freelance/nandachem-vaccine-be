import {
  Controller,
  Get,
  UseGuards,
  Request,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { NormalGuard } from '../auth/normal.guard';
import { AnalyticsDto } from './dto/analytics.dto';
import { DoseCountDto } from './dto/dose-count.dto';

@Controller('dashboard')
@UseGuards(NormalGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('dose-completion')
  getDoseCompletion(@Query('vaccineId') vaccineId: string, @Request() req) {
    if (!vaccineId) {
      throw new BadRequestException();
    }

    return this.dashboardService.getDoseCompletion(
      +vaccineId,
      Number(req.user.id),
    );
  }

  @Get('dose-count')
  getDoseCounts(@Query() query: DoseCountDto, @Request() req) {
    const {vaccineId, type = "MONTH"} = query;

    if (!vaccineId) {
      throw new BadRequestException('vaccineId is required');
    }

    return this.dashboardService.getDoseCounts(+vaccineId, type, Number(req.user.id));
  }

  @Get('dose-analytics')
  getDoseAnalytics(@Query() query: AnalyticsDto, @Request() req) {
    const { vaccineId, doseNumber, type = 'MONTH' } = query;

    if (!vaccineId || !doseNumber) {
      throw new BadRequestException();
    }

    return this.dashboardService.getDoseAnalytics(
      +vaccineId,
      +doseNumber,
      type,
      Number(req.user.id),
    );
  }
}
