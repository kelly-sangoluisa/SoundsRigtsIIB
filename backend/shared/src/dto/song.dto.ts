import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { SongStatus } from '../types/song.types';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  genre!: string;

  @IsNumber()
  @IsNotEmpty()
  price!: number;
}

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsEnum(SongStatus)
  @IsOptional()
  status?: SongStatus;
}

export class SongFiltersDto {
  @IsString()
  @IsOptional()
  genre?: string;

  @IsEnum(SongStatus)
  @IsOptional()
  status?: SongStatus;

  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  maxPrice?: number;
}
