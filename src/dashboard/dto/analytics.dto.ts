import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AnalyticsDto {
    @IsString()
    @IsNotEmpty()
    vaccineId: string;

    @IsString()
    @IsNotEmpty()
    doseNumber: string;

    @IsString()
  @IsIn(['MONTH', 'WEEK'], {
    message: 'type must be MONTH or WEEK',
  })
  @IsOptional()
    type: 'MONTH' | "WEEK";
}
