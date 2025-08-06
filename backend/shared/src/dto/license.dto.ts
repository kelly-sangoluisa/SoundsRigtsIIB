import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLicenseDto {
  @IsNumber()
  @IsNotEmpty()
  songId!: number;

  @IsNumber()
  @IsNotEmpty()
  buyerId!: number;
}
