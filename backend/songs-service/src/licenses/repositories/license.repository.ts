import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { License } from '../entities/license.entity';

@Injectable()
export class LicenseRepository {
  constructor(
    @InjectRepository(License)
    private readonly licenseRepo: Repository<License>,
  ) {}

  async findByBuyer(buyerId: number): Promise<License[]> {
    return this.licenseRepo.find({ 
      where: { buyer_id: buyerId },
      relations: ['song', 'song.artist', 'seller'],
      order: { created_at: 'DESC' }
    });
  }

  async findBySeller(sellerId: number): Promise<License[]> {
    return this.licenseRepo.find({ 
      where: { seller_id: sellerId },
      relations: ['song', 'buyer'],
      order: { created_at: 'DESC' }
    });
  }

  async create(licenseData: Partial<License>): Promise<License> {
    const license = this.licenseRepo.create(licenseData);
    return this.licenseRepo.save(license);
  }

  async findById(id: number): Promise<License | null> {
    return this.licenseRepo.findOne({ 
      where: { id },
      relations: ['song', 'buyer', 'seller']
    });
  }
}
