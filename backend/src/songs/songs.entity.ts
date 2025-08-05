import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { License } from '../licenses/licenses.entity';
import { Chat } from '../chat/chat.entity';

export enum SongStatus {
  FOR_SALE = 'for_sale',
  PENDING = 'pending',
  SOLD = 'sold',
}

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ name: 'artist_id' })
  artistId: number;

  @ManyToOne(() => User, user => user.songs)
  @JoinColumn({ name: 'artist_id' })
  artist: User;

  @Column({ length: 50, nullable: true })
  genre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: SongStatus,
    default: SongStatus.FOR_SALE,
  })
  status: SongStatus;

  @Column({ name: 'file_url', length: 500, nullable: true })
  fileUrl: string;

  @Column({ nullable: true })
  duration: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  tags: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => License, license => license.song)
  licenses: License[];

  @OneToMany(() => Chat, chat => chat.song)
  chats: Chat[];
}