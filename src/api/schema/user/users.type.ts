import { ObjectType, Field, ID } from 'type-graphql';
import { PageType } from '@api/schema/pagination/page.type';
import { UserType } from './user.type';

@ObjectType()
export class UsersType extends PageType {
  @Field(() => [UserType], { description: 'List of users' })
  users!: [UserType];
}
