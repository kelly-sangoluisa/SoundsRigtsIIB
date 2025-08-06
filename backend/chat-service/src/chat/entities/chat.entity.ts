import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { Song } from '../../shared/entities/song.entity';
import { Message } from './message.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  song_id: number;

  @ManyToOne(() => Song)
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @Column({ nullable: true })
  buyer_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @Column({ nullable: true })
  artist_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'artist_id' })
  artist: User;

  @OneToMany(() => Message, message => message.chat)
  messages: Message[];

  @CreateDateColumn()
  created_at: Date;
}
