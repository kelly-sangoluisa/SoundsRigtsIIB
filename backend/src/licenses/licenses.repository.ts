import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { License } from './licenses.entity';

@Injectable()
export class LicensesRepository extends Repository<License> {
  constructor(private dataSource: DataSource) {
    super(License, dataSource.createEntityManager());
  }

  async findByBuyer(buyerId: number): Promise<License[]> {
    return this.find({
      where: { buyerId },
      relations: ['song', 'song.artist', 'seller'],
    });
  }

  async findBySeller(sellerId: number): Promise<License[]> {
    return this.find({
      where: { sellerId },
      relations: ['song', 'buyer'],
    });
  }

  async findBySong(songId: number): Promise<License[]> {
    return this.find({
      where: { songId },
      relations: ['buyer', 'seller'],
    });
  }

  async createLicense(licenseData: Partial<License>): Promise<License> {
    const license = this.create(licenseData);
    return this.save(license);
  }

  async checkIfUserOwnsSong(userId: number, songId: number): Promise<boolean> {
    const license = await this.findOne({
      where: { buyerId: userId, songId },
    });
    return !!license;
  }
}