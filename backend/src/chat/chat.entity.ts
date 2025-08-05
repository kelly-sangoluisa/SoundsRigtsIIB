import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Song } from '../songs/songs.entity';
import { Message } from './message.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'song_id' })
  songId: number;

  @Column({ name: 'buyer_id' })
  buyerId: number;

  @Column({ name: 'artist_id' })
  artistId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Song, song => song.chats)
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @ManyToOne(() => User, user => user.buyerChats)
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @ManyToOne(() => User, user => user.artistChats)
  @JoinColumn({ name: 'artist_id' })
  artist: User;

  @OneToMany(() => Message, message => message.chat)
  messages: Message[];
}