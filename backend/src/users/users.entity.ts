import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Song } from '../songs/songs.entity';
import { License } from '../licenses/licenses.entity';
import { Chat } from '../chat/chat.entity';
import { Message } from '../chat/message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Song, song => song.artist)
  songs: Song[];

  @OneToMany(() => License, license => license.buyer)
  purchasedLicenses: License[];

  @OneToMany(() => License, license => license.seller)
  soldLicenses: License[];

  @OneToMany(() => Chat, chat => chat.buyer)
  buyerChats: Chat[];

  @OneToMany(() => Chat, chat => chat.artist)
  artistChats: Chat[];

  @OneToMany(() => Message, message => message.sender)
  messages: Message[];
}