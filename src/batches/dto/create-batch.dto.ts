import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  expiryDate: string;

  @IsNumber()
  @IsNotEmpty()
  vaccineId: number;
}
