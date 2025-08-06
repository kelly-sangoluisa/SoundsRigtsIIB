import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column()
  artist_id: number;

  @Column({ length: 50, nullable: true })
  genre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ length: 20, default: 'for_sale' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
