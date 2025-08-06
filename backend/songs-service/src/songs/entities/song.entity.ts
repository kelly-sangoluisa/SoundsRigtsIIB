import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../shared/entities/user.entity';

export type SongStatus = 'for_sale' | 'pending' | 'sold';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column()
  artist_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'artist_id' })
  artist: User;

  @Column({ length: 50, nullable: true })
  genre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'for_sale'
  })
  status: SongStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
