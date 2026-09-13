import { IsEnum, IsInt, IsOptional, Min,Max, IsBoolean, IsString, IsNumber } from "class-validator";
import { Type, Transform } from "class-transformer";

enum Genre {
    RB = 'RB',
    HIP_HOP = 'HIP_HOP',
    POP = 'POP',
    ELECTRONIC = 'ELECTRONIC'
}
enum Mood {
    ATMOSPHERIC = 'ATMOSPHERIC',
    SOULFUL = 'SOULFUL',
    DARK = 'DARK',
    CHILL = 'CHILL',
    BRIGHT = 'BRIGHT',
    EUPHORIC = 'EUPHORIC',
}
enum LicenseType {
    BASIC = 'BASIC',
    PREMIUM = 'PREMIUM',
    EXCLUSIVE = 'EXCLUSIVE',
}
export class GetBeatsDto {
    @IsOptional()
    @IsEnum(Genre)
    genre?: Genre;
    @IsOptional()
    @IsEnum(Mood)
    mood?: Mood;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    minBpm?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    maxBpm?: number;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    featured?: boolean;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(LicenseType)
    licenseType?: LicenseType;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;
}