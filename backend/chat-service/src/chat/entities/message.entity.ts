import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../../shared/entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chat_id: number;

  @ManyToOne(() => Chat, chat => chat.messages)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @Column({ nullable: true })
  sender_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column('text')
  content: string;

  @CreateDateColumn()
  sent_at: Date;
}
