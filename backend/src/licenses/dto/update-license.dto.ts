import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

enum LicenseType {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  EXCLUSIVE = 'EXCLUSIVE',
}

export class UpdateLicenseDto {
  @IsOptional()
  @IsEnum(LicenseType)
  type?: LicenseType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}