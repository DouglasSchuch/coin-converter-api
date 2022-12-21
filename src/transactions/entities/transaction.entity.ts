import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ nullable: false })
  source_currency: string;

  @Column({ type: 'float', nullable: false })
  source_value: number;

  @Column({ nullable: false })
  destination_currency: string;

  @Column({ type: 'float', nullable: false })
  conversion_rate: number;

  @Column({ nullable: false })
  date: Date;

  @ManyToOne(() => User, (user: User) => user.id)
  user: User;

  constructor(transaction?: Partial<Transaction>) {
    this.id = transaction?.id;
    this.source_currency = transaction?.source_currency;
    this.source_value = transaction?.source_value;
    this.destination_currency = transaction?.destination_currency;
    this.conversion_rate = transaction?.conversion_rate;
    this.date = transaction?.date || new Date();
  }
}
