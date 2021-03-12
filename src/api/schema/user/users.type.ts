import { ObjectType, Field, Int } from 'type-graphql';
import { PageType } from '@api/schema/pagination/page.type';
import { UserType } from './user.type';

@ObjectType()
export class UsersType {
  @Field(() => [UserType], { description: 'List of users' })
  users!: [UserType];

  @Field(() => PageType, { description: 'Page data' })
  page!: PageType;
}
