import { IsString } from 'class-validator';

export class RequestSongDto {
  @IsString()
  songId: string;

  @IsString()
  requesterId: string;
}

export class AcceptSongRequestDto {
  @IsString()
  songId: string;

  @IsString()
  newOwnerId: string;
}

export class RejectSongRequestDto {
  @IsString()
  songId: string;
}
