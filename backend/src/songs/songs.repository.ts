import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Song, SongStatus } from './songs.entity';

@Injectable()
export class SongsRepository extends Repository<Song> {
  constructor(private dataSource: DataSource) {
    super(Song, dataSource.createEntityManager());
  }

  async findByArtist(artistId: number): Promise<Song[]> {
    return this.find({
      where: { artistId },
      relations: ['artist'],
    });
  }

  async findByStatus(status: SongStatus): Promise<Song[]> {
    return this.find({
      where: { status },
      relations: ['artist'],
    });
  }

  async findAvailableSongs(): Promise<Song[]> {
    return this.find({
      where: { status: SongStatus.FOR_SALE },
      relations: ['artist'],
    });
  }

  async createSong(songData: Partial<Song>): Promise<Song> {
    const song = this.create(songData);
    return this.save(song);
  }

  async updateSongStatus(id: number, status: SongStatus): Promise<Song> {
    await this.update(id, { status });
    return this.findOne({ where: { id }, relations: ['artist'] });
  }
}