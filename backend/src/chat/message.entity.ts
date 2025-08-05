import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Chat } from './chat.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'chat_id' })
  chatId: number;

  @Column({ name: 'sender_id' })
  senderId: number;

  @Column('text')
  content: string;

  @CreateDateColumn({ name: 'sent_at' })
  sentAt: Date;

  @ManyToOne(() => Chat, chat => chat.messages)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @ManyToOne(() => User, user => user.messages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;
}