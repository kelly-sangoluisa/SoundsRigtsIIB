import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LicensesRepository } from './licenses.repository';
import { SongsService } from '../songs/songs.service';
import { License } from './licenses.entity';
import { SongStatus } from '../songs/songs.entity';

@Injectable()
export class LicensesService {
  constructor(
    private licensesRepository: LicensesRepository,
    private songsService: SongsService,
    private dataSource: DataSource,
  ) {}

  async purchaseLicense(songId: number, buyerId: number): Promise<License> {
    // Usar transacción para asegurar consistencia
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar que la canción existe y está disponible
      const song = await this.songsService.findOne(songId);
      
      if (song.status !== SongStatus.FOR_SALE) {
        throw new BadRequestException('Song is not available for purchase');
      }

      if (song.artistId === buyerId) {
        throw new BadRequestException('You cannot purchase your own song');
      }

      // Verificar si el usuario ya tiene una licencia para esta canción
      const existingLicense = await this.licensesRepository.checkIfUserOwnsSong(buyerId, songId);
      if (existingLicense) {
        throw new ConflictException('You already own a license for this song');
      }

      // Crear la licencia
      const license = await this.licensesRepository.createLicense({
        songId,
        buyerId,
        sellerId: song.artistId,
      });

      // Actualizar el estado de la canción a vendida
      await this.songsService.updateStatus(songId, SongStatus.SOLD);

      await queryRunner.commitTransaction();
      return license;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<License[]> {
    return this.licensesRepository.find({
      relations: ['song', 'buyer', 'seller'],
    });
  }

  async findOne(id: number): Promise<License> {
    const license = await this.licensesRepository.findOne({
      where: { id },
      relations: ['song', 'buyer', 'seller'],
    });
    if (!license) {
      throw new NotFoundException(`License with ID ${id} not found`);
    }
    return license;
  }

  async findUserPurchases(userId: number): Promise<License[]> {
    return this.licensesRepository.findByBuyer(userId);
  }

  async findUserSales(userId: number): Promise<License[]> {
    return this.licensesRepository.findBySeller(userId);
  }

  async findBySong(songId: number): Promise<License[]> {
    return this.licensesRepository.findBySong(songId);
  }

  async checkOwnership(userId: number, songId: number): Promise<boolean> {
    return this.licensesRepository.checkIfUserOwnsSong(userId, songId);
  }
}