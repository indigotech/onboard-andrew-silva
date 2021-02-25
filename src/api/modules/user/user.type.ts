import { ObjectType, Field, ID } from 'type-graphql';
import { UserEntity } from '../../../data/entity/user.entity';

@ObjectType()
export class UserType {
  @Field(() => ID, { description: 'User id' })
  id!: string;

  @Field(() => String, { description: 'User name' })
  name!: string;

  @Field(() => String, { description: 'User e-mail' })
  email!: string;

  @Field(() => Date, { description: 'User birth date' })
  birthDate!: Date;

  @Field(() => Date, { description: 'User creation date' })
  creationDate!: Date;

  @Field(() => Date, { description: 'User update date' })
  updateDate!: Date;
}
