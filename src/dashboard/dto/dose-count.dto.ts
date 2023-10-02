import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class DoseCountDto {
    @IsString()
    @IsNotEmpty()
    vaccineId: string;

  @IsOptional()
  type: 'MONTH' | "WEEK";
}
