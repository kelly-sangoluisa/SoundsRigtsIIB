import { Injectable } from '@nestjs/common';
import { LicenseRepository } from './repositories/license.repository';

@Injectable()
export class LicensesService {
  constructor(
    private readonly licenseRepository: LicenseRepository,
  ) {}

  async getPurchasedLicenses(buyerId: number) {
    const licenses = await this.licenseRepository.findByBuyer(buyerId);
    return {
      licenses: licenses.map(license => ({
        id: license.id,
        songId: license.song_id,
        songTitle: license.song.title,
        artistName: license.seller.username,
        price: license.song.price,
        purchaseDate: license.created_at
      }))
    };
  }

  async getSoldLicenses(sellerId: number) {
    const licenses = await this.licenseRepository.findBySeller(sellerId);
    return {
      licenses: licenses.map(license => ({
        id: license.id,
        songId: license.song_id,
        songTitle: license.song.title,
        buyerName: license.buyer.username,
        price: license.song.price,
        saleDate: license.created_at
      }))
    };
  }

  async createLicense(data: {
    songId: number;
    buyerId: number;
    sellerId: number;
    offerPrice?: number;
    message?: string;
  }) {
    const license = await this.licenseRepository.create({
      song_id: data.songId,
      buyer_id: data.buyerId,
      seller_id: data.sellerId
    });

    return {
      licenseId: license.id,
      message: 'Purchase request sent successfully',
      status: 'pending'
    };
  }
}
