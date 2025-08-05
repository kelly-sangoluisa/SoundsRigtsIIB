import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SongsRepository } from './songs.repository';
import { Song, SongStatus } from './songs.entity';

@Injectable()
export class SongsService {
  constructor(private songsRepository: SongsRepository) {}

  async create(songData: Partial<Song>, userId: number): Promise<Song> {
    const newSong = {
      ...songData,
      artistId: userId,
      status: SongStatus.FOR_SALE,
    };
    
    return this.songsRepository.createSong(newSong);
  }

  async findAll(): Promise<Song[]> {
    return this.songsRepository.find({
      relations: ['artist'],
    });
  }

  async findAvailable(): Promise<Song[]> {
    return this.songsRepository.findAvailableSongs();
  }

  async findOne(id: number): Promise<Song> {
    const song = await this.songsRepository.findOne({
      where: { id },
      relations: ['artist'],
    });
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    return song;
  }

  async findByArtist(artistId: number): Promise<Song[]> {
    return this.songsRepository.findByArtist(artistId);
  }

  async update(id: number, songData: Partial<Song>, userId: number): Promise<Song> {
    const song = await this.findOne(id);
    if (song.artistId !== userId) {
      throw new ForbiddenException('You can only update your own songs');
    }
    await this.songsRepository.update(id, songData);
    return this.findOne(id);
  }

  async updateStatus(id: number, status: SongStatus): Promise<Song> {
    const song = await this.findOne(id);
    return this.songsRepository.updateSongStatus(id, status);
  }

  async remove(id: number, userId: number): Promise<void> {
    const song = await this.findOne(id);
    if (song.artistId !== userId) {
      throw new ForbiddenException('You can only delete your own songs');
    }
    await this.songsRepository.delete(id);
  }
}