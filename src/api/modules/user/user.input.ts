import { InputType, Field } from 'type-graphql';
import { Contains, Length, IsEmail, IsDate, Matches } from 'class-validator';

@InputType()
export class UserInput {
  @Field()
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(7)
  password!: string;

  @Field()
  @IsDate()
  birthDate!: Date;
}
