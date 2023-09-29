import {  IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


class AgeGroupDto {
  @IsNumber()
  @IsNotEmpty()
  minAge: number;

  @IsNumber()
  @IsNotEmpty()
  maxAge: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfDose: number;

  @IsString()
  @IsNotEmpty()
  gapsInDays: string;
}


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

  @IsArray()
  @ValidateNested({ each: true }) // Validate each item in the array
  @Type(() => AgeGroupDto) // Ensure proper class transformation
  ageGroups: AgeGroupDto[];
}
