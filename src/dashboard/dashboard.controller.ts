import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { NormalGuard } from 'src/auth/normal.guard';

@Controller('dashboard')
@UseGuards(NormalGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(':vaccineId')
  find(@Param() vaccineId: string, @Request() req) {
    return req.user;
  }
}
