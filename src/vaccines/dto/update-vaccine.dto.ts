import { PartialType } from '@nestjs/mapped-types';
import { CreateVaccineDto } from './create-vaccine.dto';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AgeGroupDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

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
export class UpdateVaccineDto extends PartialType(CreateVaccineDto) {
    @IsArray()
    @ValidateNested({ each: true }) // Validate each item in the array
    @Type(() => AgeGroupDto) // Ensure proper class transformation
    @IsOptional()
    ageGroups?: AgeGroupDto[];
}
