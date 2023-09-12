import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVaccineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  manufacturer: string;

  @IsNumber()
  @IsNotEmpty()
  doses: number;

  @IsString()
  @IsOptional()
  gapsInDays: string;
}
