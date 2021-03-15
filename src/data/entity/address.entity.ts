import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('address')
export class AddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserEntity, (user) => user.addresses, { onDelete: 'CASCADE' })
  user!: UserEntity;

  @Column({ nullable: true })
  label?: string;

  @Column()
  cep!: string;

  @Column()
  street!: string;

  @Column({ type: 'int' })
  streetNumber!: number;

  @Column({ nullable: true })
  complement?: string;

  @Column()
  neighborhood!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;
}
