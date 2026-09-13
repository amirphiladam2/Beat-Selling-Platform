import { IsEnum, IsInt, IsNumber, Min } from 'class-validator';

enum LicenseType {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  EXCLUSIVE = 'EXCLUSIVE',
}

export class CreateLicenseDto {
  @IsEnum(LicenseType)
  type!: LicenseType;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsInt()
  @Min(1)
  beatId!: number;
}