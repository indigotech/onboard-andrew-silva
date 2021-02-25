import { InputType, Field } from 'type-graphql';

@InputType()
export class UserInput {
  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  birthDate!: Date;
}
