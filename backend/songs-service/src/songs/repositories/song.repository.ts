import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../entities/song.entity';

@Injectable()
export class SongRepository {
  constructor(
    @InjectRepository(Song)
    private readonly songRepo: Repository<Song>,
  ) {}

  async findByArtist(artistId: number): Promise<Song[]> {
    return this.songRepo.find({ 
      where: { artist_id: artistId },
      relations: ['artist'],
      order: { created_at: 'DESC' }
    });
  }

  async findAvailable(filters?: { genre?: string; maxPrice?: number; search?: string }): Promise<Song[]> {
    const query = this.songRepo.createQueryBuilder('song')
      .leftJoinAndSelect('song.artist', 'artist')
      .where('song.status = :status', { status: 'for_sale' });

    if (filters?.genre) {
      query.andWhere('song.genre = :genre', { genre: filters.genre });
    }

    if (filters?.maxPrice && filters.maxPrice > 0) {
      query.andWhere('song.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters?.search) {
      query.andWhere(
        '(LOWER(song.title) LIKE LOWER(:search) OR LOWER(artist.username) LIKE LOWER(:search))',
        { search: `%${filters.search}%` }
      );
    }

    return query.orderBy('song.created_at', 'DESC').getMany();
  }

  async findById(id: number): Promise<Song | null> {
    return this.songRepo.findOne({ 
      where: { id },
      relations: ['artist']
    });
  }

  async create(songData: Partial<Song>): Promise<Song> {
    const song = this.songRepo.create(songData);
    return this.songRepo.save(song);
  }

  async update(id: number, songData: Partial<Song>): Promise<Song> {
    await this.songRepo.update(id, songData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.songRepo.delete(id);
  }

  async updateStatus(id: number, status: Song['status']): Promise<Song> {
    await this.songRepo.update(id, { status });
    return this.findById(id);
  }
}
