import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CompleteDoseDto {
    @IsString()
    @IsNotEmpty()
    dob: string;
  
    @IsNumber()
    @IsNotEmpty()
    doseNumber: number;

    @IsNumber()
    @IsNotEmpty()
    patientId: number;

    @IsNumber()
    @IsNotEmpty()
    batchId: number;

    @IsNumber()
    @IsNotEmpty()
    vaccineId: number;
}
