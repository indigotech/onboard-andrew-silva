import { InputType, Field, Int } from 'type-graphql';
import {} from 'class-validator';

@InputType()
export class AddressInput {
  @Field(() => String, { nullable: true })
  label?: string;

  @Field(() => String)
  cep!: string;

  @Field(() => String)
  street!: string;

  @Field(() => Int)
  streetNumber!: number;

  @Field(() => String, { nullable: true })
  complement?: string;

  @Field(() => String)
  neighborhood!: string;

  @Field(() => String)
  city!: string;

  @Field(() => String)
  state!: string;
}
