import { Transaction } from '../../transactions/entities/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Transaction, (Transaction) => Transaction.user)
  transactions: Transaction[];

  constructor(user?: Partial<User>) {
    this.id = user?.id;
    this.email = user?.email;
    this.password = user?.password;
  }
}
