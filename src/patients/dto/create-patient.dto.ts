import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsIn(['MALE', 'FEMALE', 'OTHERS'], {
    message: 'gender must be either MALE, FEMALE or OTHERS',
  })
  gender: 'MALE' | 'FEMALE' | 'OTHERS';


  @IsString()
  @IsNotEmpty()
  dob: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  street?: string;

  @IsNumber()
  @IsNotEmpty()
  vaccineId: number;
}
