import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

enum Genre {
  RB = 'RB',
  HIP_HOP = 'HIP_HOP',
  POP = 'POP',
  ELECTRONIC = 'ELECTRONIC',
}

enum Mood {
  ATMOSPHERIC = 'ATMOSPHERIC',
  SOULFUL = 'SOULFUL',
  DARK = 'DARK',
  CHILL = 'CHILL',
  BRIGHT = 'BRIGHT',
  EUPHORIC = 'EUPHORIC',
}

export class UpdateBeatDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Genre)
  genre?: Genre;

  @IsOptional()
  @IsEnum(Mood)
  mood?: Mood;

  @IsOptional()
  @IsInt()
  @Min(1)
  bpm?: number;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  audioKey?: string;

  @IsOptional()
  @IsUrl()
  coverUrl?: string;
}