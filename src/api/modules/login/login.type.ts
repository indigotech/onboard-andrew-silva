import { ObjectType, Field } from 'type-graphql';
import { UserType } from '../user/user.type';

@ObjectType()
export class LoginType {
  @Field(() => UserType, { description: 'Authorized user' })
  user!: UserType;

  @Field(() => String, { description: 'User access token' })
  token!: string;
}
