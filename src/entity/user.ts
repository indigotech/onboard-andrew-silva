import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  @Field(() => String)
  @Column()
  password!: string;

  @Field(() => Date)
  @Column({ type: 'date' })
  birthDate!: Date;

  @Field(() => Boolean)
  @Column({ default: true })
  isActive!: boolean;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  creationDate!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updateDate!: Date;
}
