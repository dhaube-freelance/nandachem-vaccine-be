import { IsNotEmpty, IsNumber } from "class-validator";

export class CompleteDoseDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    dosesTaken: number;
}
