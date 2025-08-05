import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Song } from '../songs/songs.entity';

@Entity('licenses')
export class License {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'song_id' })
  songId: number;

  @Column({ name: 'buyer_id' })
  buyerId: number;

  @Column({ name: 'seller_id' })
  sellerId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Song, song => song.licenses)
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @ManyToOne(() => User, user => user.purchasedLicenses)
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @ManyToOne(() => User, user => user.soldLicenses)
  @JoinColumn({ name: 'seller_id' })
  seller: User;
}