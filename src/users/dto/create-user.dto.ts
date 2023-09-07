import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsIn(['ADMIN', 'NORMAL'], {
    message: 'Role must be either ADMIN or NORMAL',
  })
  @IsOptional()
  role?: 'ADMIN' | 'NORMAL';

  @IsBoolean()
  @IsOptional()
  verified: boolean;
}
