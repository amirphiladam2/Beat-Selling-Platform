import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsNotEmpty,
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

export class CreateBeatDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Genre)
  genre!: Genre;

  @IsOptional()
  @IsEnum(Mood)
  mood?: Mood;

  @IsInt()
  @Min(1)
  bpm!: number;

  @IsBoolean()
  featured!: boolean;

  @IsString()
  @IsNotEmpty()
  audioKey!: string;

  @IsOptional()
  @IsUrl()
  coverUrl?: string;
}