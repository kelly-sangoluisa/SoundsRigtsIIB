import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Song } from '../../songs/entities/song.entity';
import { User } from '../../shared/entities/user.entity';

@Entity('licenses')
export class License {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  song_id: number;

  @ManyToOne(() => Song)
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @Column()
  buyer_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @Column()
  seller_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  // Campos adicionales que podrías necesitar:
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  purchase_price: number;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string; // 'active', 'expired', 'cancelled'

  @Column('text', { nullable: true })
  license_terms: string; // Términos específicos de la licencia

  @CreateDateColumn()
  created_at: Date;
}
