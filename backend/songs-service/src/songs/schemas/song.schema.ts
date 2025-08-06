import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SongDocument = Song & Document;

export enum SongStatus {
  AVAILABLE = 'available',
  REQUESTED = 'requested', 
  SOLD = 'sold'
}

@Schema({ timestamps: true })
export class Song {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  artist: string;

  @Prop({ required: true })
  genre: string;

  @Prop({ required: true })
  duration: number; // duration in seconds

  @Prop({ required: true })
  price: number; // price in USD

  @Prop()
  description?: string;

  @Prop()
  albumCover?: string; // URL to album cover image

  @Prop()
  audioFile?: string; // URL to audio file

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ required: true })
  ownerId: string; // ID del usuario que originalmente creó/posee la canción

  @Prop()
  currentOwnerId?: string; // ID del usuario que actualmente posee la canción (puede cambiar al venderse)

  @Prop({ enum: SongStatus, default: SongStatus.AVAILABLE })
  status: SongStatus; // Estado de la canción: available, requested, sold

  @Prop()
  requestedById?: string; // ID del usuario que solicitó comprar la canción

  @Prop()
  requestedAt?: Date; // Fecha cuando se solicitó la compra

  @Prop({ default: 0 })
  playCount: number;

  @Prop({ default: [] })
  tags: string[];

  @Prop()
  releaseDate?: Date;
}

export const SongSchema = SchemaFactory.createForClass(Song);
