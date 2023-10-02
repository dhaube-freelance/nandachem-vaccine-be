import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req, 
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CompleteDoseDto } from './dto/complete-dose.dto';
import { NormalGuard } from '../auth/normal.guard';

@Controller('patients')
@UseGuards(NormalGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto, @Request() req) {
    return this.patientsService.create(createPatientDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Get('/phone-number/:number')
  findFromPhoneNumber(@Param('number') number: string) {
    return this.patientsService.findFromPhoneNumber(number);
  }

  @Post('/complete-dose')
  completeDose(@Body() completeDoseDto :CompleteDoseDto, @Req() req) {
    return this.patientsService.completeDose(completeDoseDto, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne({ id: +id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update({ id: +id }, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove({ id: +id });
  }
}
