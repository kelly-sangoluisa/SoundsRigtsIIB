import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsDateString, IsEnum } from 'class-validator';
import { SongStatus } from '../schemas/song.schema';

export class CreateSongDto {
  @IsString()
  title: string;

  @IsString()
  artist: string;

  @IsString()
  genre: string;

  @IsNumber()
  duration: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  albumCover?: string;

  @IsOptional()
  @IsString()
  audioFile?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsString()
  ownerId: string;

  @IsOptional()
  @IsString()
  currentOwnerId?: string;

  @IsOptional()
  @IsEnum(SongStatus)
  status?: SongStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDateString()
  releaseDate?: string;
}
