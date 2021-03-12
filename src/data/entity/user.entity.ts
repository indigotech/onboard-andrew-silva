import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';

import bcrypt from 'bcrypt';
import { AddressEntity } from './address.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  birthDate!: Date;

  @OneToMany(() => AddressEntity, (address) => address.user, { cascade: true })
  @JoinColumn()
  addresses?: AddressEntity[];

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  creationDate!: Date;

  @UpdateDateColumn()
  updateDate!: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
