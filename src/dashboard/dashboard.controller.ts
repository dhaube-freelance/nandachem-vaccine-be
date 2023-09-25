import {
  Controller,
  Get,
  UseGuards,
  Request,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { NormalGuard } from 'src/auth/normal.guard';
import { AnalyticsDto } from './dto/analytics.dto';

@Controller('dashboard')
@UseGuards(NormalGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('doses-completion')
  getDoseCompletion(@Query('vaccineId') vaccineId: string, @Request() req) {
    if (!vaccineId) {
      throw new BadRequestException();
    }

    return this.dashboardService.getDoseCompletion(
      +vaccineId,
      Number(req.user.id),
    );
  }

  @Get('doses-count')
  getDoseCounts(@Query('vaccineIdk') vaccineId: string, @Request() req) {
    if (!vaccineId) {
      throw new BadRequestException();
    }

    return this.dashboardService.getDoseCounts(+vaccineId, Number(req.user.id));
  }

  @Get('doses-analytics')
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
