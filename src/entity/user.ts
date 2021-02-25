import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @PrimaryColumn()
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'date' })
  birthDate!: Date;

  @Column()
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  creationDate!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate!: Date;
}
