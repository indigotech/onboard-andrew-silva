import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userName!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  isActive!: boolean;
}
