import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SongRepository } from './repositories/song.repository';
import { LicensesService } from '../licenses/licenses.service';

@Injectable()
export class SongsService {
  constructor(
    private readonly songRepository: SongRepository,
    private readonly licensesService: LicensesService,
  ) {}

  async getMySongs(artistId: number) {
    const songs = await this.songRepository.findByArtist(artistId);
    return {
      songs: songs.map(song => ({
        id: song.id,
        name: song.title,
        artist: song.artist.username,
        genre: song.genre,
        price: song.price,
        status: song.status,
        createdAt: song.created_at,
        updatedAt: song.updated_at,
        artistId: song.artist_id
      })),
      total: songs.length
    };
  }

  async getAvailableSongs(filters: { genre?: string; maxPrice?: number; search?: string }) {
    const songs = await this.songRepository.findAvailable(filters);
    return {
      songs: songs.map(song => ({
        id: song.id,
        name: song.title,
        artist: song.artist.username,
        genre: song.genre,
        price: song.price,
        status: song.status,
        createdAt: song.created_at,
        updatedAt: song.updated_at,
        artistId: song.artist_id
      })),
      total: songs.length
    };
  }

  async createSong(songData: { title: string; genre: string; price: number; artistId: number }) {
    const song = await this.songRepository.create({
      title: songData.title,
      genre: songData.genre,
      price: songData.price,
      artist_id: songData.artistId,
      status: 'for_sale'
    });

    return {
      id: song.id,
      name: song.title,
      genre: song.genre,
      price: song.price,
      status: song.status,
      createdAt: song.created_at,
      updatedAt: song.updated_at,
      artistId: song.artist_id
    };
  }

  async updateSong(id: number, songData: { title?: string; genre?: string; price?: number; artistId: number }) {
    const song = await this.songRepository.findById(id);
    if (!song) {
      throw new NotFoundException('Song not found');
    }

    if (song.artist_id !== songData.artistId) {
      throw new ForbiddenException('You can only edit your own songs');
    }

    if (song.status === 'sold') {
      throw new ForbiddenException('Cannot edit a sold song');
    }

    const updatedSong = await this.songRepository.update(id, {
      title: songData.title,
      genre: songData.genre,
      price: songData.price
    });

    return {
      id: updatedSong.id,
      name: updatedSong.title,
      genre: updatedSong.genre,
      price: updatedSong.price,
      status: updatedSong.status,
      createdAt: updatedSong.created_at,
      updatedAt: updatedSong.updated_at,
      artistId: updatedSong.artist_id
    };
  }

  async deleteSong(id: number, artistId: number) {
    const song = await this.songRepository.findById(id);
    if (!song) {
      throw new NotFoundException('Song not found');
    }

    if (song.artist_id !== artistId) {
      throw new ForbiddenException('You can only delete your own songs');
    }

    if (song.status === 'sold') {
      throw new ForbiddenException('Cannot delete a sold song');
    }

    await this.songRepository.delete(id);
    return { message: 'Song deleted successfully' };
  }

  async getSong(id: number) {
    const song = await this.songRepository.findById(id);
    if (!song) {
      throw new NotFoundException('Song not found');
    }

    return {
      id: song.id,
      name: song.title,
      artist: song.artist.username,
      genre: song.genre,
      price: song.price,
      status: song.status,
      createdAt: song.created_at,
      updatedAt: song.updated_at,
      artistId: song.artist_id
    };
  }

  async purchaseSong(songId: number, purchaseData: { buyerId: number; buyerMessage?: string; offerPrice?: number }) {
    const song = await this.songRepository.findById(songId);
    if (!song) {
      throw new NotFoundException('Song not found');
    }

    if (song.status !== 'for_sale') {
      throw new ForbiddenException('Song is not available for purchase');
    }

    // Cambiar estado a pending
    await this.songRepository.updateStatus(songId, 'pending');

    // Crear licencia
    return this.licensesService.createLicense({
      songId,
      buyerId: purchaseData.buyerId,
      sellerId: song.artist_id,
      offerPrice: purchaseData.offerPrice || song.price,
      message: purchaseData.buyerMessage
    });
  }
}
