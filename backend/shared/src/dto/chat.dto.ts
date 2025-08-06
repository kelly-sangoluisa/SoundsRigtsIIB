import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  @IsNotEmpty()
  songId!: number;

  @IsNumber()
  @IsNotEmpty()
  buyerId!: number;

  @IsNumber()
  @IsNotEmpty()
  artistId!: number;
}

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
