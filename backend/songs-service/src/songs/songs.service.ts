import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song, SongDocument, SongStatus } from './schemas/song.schema';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { RequestSongDto, AcceptSongRequestDto, RejectSongRequestDto } from './dto/purchase-song.dto';

@Injectable()
export class SongsService {
  constructor(@InjectModel(Song.name) private songModel: Model<SongDocument>) {}

  async create(createSongDto: CreateSongDto): Promise<Song> {
    const createdSong = new this.songModel({
      ...createSongDto,
      isAvailable: createSongDto.isAvailable ?? true,
      currentOwnerId: createSongDto.ownerId, // Inicialmente el dueño actual es el mismo que el creador
      status: SongStatus.AVAILABLE,
    });
    return createdSong.save();
  }

  async findAll(): Promise<Song[]> {
    return this.songModel.find({ isAvailable: true }).exec();
  }

  async findByOwner(ownerId: string): Promise<Song[]> {
    return this.songModel.find({ ownerId }).exec();
  }

  async findOne(id: string): Promise<Song> {
    const song = await this.songModel.findById(id).exec();
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    return song;
  }

  async update(id: string, updateSongDto: UpdateSongDto): Promise<Song> {
    const updatedSong = await this.songModel
      .findByIdAndUpdate(id, updateSongDto, { new: true })
      .exec();
    
    if (!updatedSong) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    return updatedSong;
  }

  async remove(id: string): Promise<void> {
    const result = await this.songModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
  }

  async searchSongs(query: string): Promise<Song[]> {
    return this.songModel
      .find({
        isAvailable: true,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { artist: { $regex: query, $options: 'i' } },
          { genre: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
        ],
      })
      .exec();
  }

  async findByGenre(genre: string): Promise<Song[]> {
    return this.songModel
      .find({ genre: { $regex: genre, $options: 'i' }, isAvailable: true })
      .exec();
  }

  async incrementPlayCount(id: string): Promise<Song> {
    const updatedSong = await this.songModel
      .findByIdAndUpdate(id, { $inc: { playCount: 1 } }, { new: true })
      .exec();
    
    if (!updatedSong) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    return updatedSong;
  }

  // Nuevos métodos para compras
  async requestSong(requestSongDto: RequestSongDto): Promise<Song> {
    const { songId, requesterId } = requestSongDto;
    
    const song = await this.songModel.findById(songId).exec();
    if (!song) {
      throw new NotFoundException(`Song with ID ${songId} not found`);
    }

    if (song.currentOwnerId === requesterId) {
      throw new BadRequestException('Cannot request your own song');
    }

    if (song.status !== SongStatus.AVAILABLE) {
      throw new BadRequestException('Song is not available for purchase');
    }

    const updatedSong = await this.songModel
      .findByIdAndUpdate(
        songId,
        {
          status: SongStatus.REQUESTED,
          requestedById: requesterId,
          requestedAt: new Date(),
        },
        { new: true }
      )
      .exec();

    return updatedSong;
  }

  async acceptSongRequest(acceptSongRequestDto: AcceptSongRequestDto): Promise<Song> {
    const { songId, newOwnerId } = acceptSongRequestDto;
    
    const song = await this.songModel.findById(songId).exec();
    if (!song) {
      throw new NotFoundException(`Song with ID ${songId} not found`);
    }

    if (song.status !== SongStatus.REQUESTED) {
      throw new BadRequestException('Song has no pending request');
    }

    const updatedSong = await this.songModel
      .findByIdAndUpdate(
        songId,
        {
          status: SongStatus.SOLD,
          currentOwnerId: newOwnerId,
          requestedById: undefined,
          requestedAt: undefined,
        },
        { new: true }
      )
      .exec();

    return updatedSong;
  }

  async rejectSongRequest(rejectSongRequestDto: RejectSongRequestDto): Promise<Song> {
    const { songId } = rejectSongRequestDto;
    
    const song = await this.songModel.findById(songId).exec();
    if (!song) {
      throw new NotFoundException(`Song with ID ${songId} not found`);
    }

    if (song.status !== SongStatus.REQUESTED) {
      throw new BadRequestException('Song has no pending request');
    }

    const updatedSong = await this.songModel
      .findByIdAndUpdate(
        songId,
        {
          status: SongStatus.AVAILABLE,
          requestedById: undefined,
          requestedAt: undefined,
        },
        { new: true }
      )
      .exec();

    return updatedSong;
  }

  async getRequestedSongs(ownerId: string): Promise<Song[]> {
    return this.songModel
      .find({ 
        currentOwnerId: ownerId, 
        status: SongStatus.REQUESTED 
      })
      .exec();
  }

  async getPurchasedSongs(userId: string): Promise<Song[]> {
    return this.songModel
      .find({ 
        currentOwnerId: userId,
        ownerId: { $ne: userId } // Canciones que no creó pero que ahora posee
      })
      .exec();
  }
}
