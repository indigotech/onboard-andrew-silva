import { ObjectType, Field, ID, Int } from 'type-graphql';

@ObjectType()
export class AddressType {
  @Field(() => ID, { description: 'Address id' })
  id!: string;

  @Field(() => String, { description: 'Address label/name', nullable: true })
  label?: string;

  @Field(() => String, { description: 'Address CEP (postal code)' })
  cep!: string;

  @Field(() => String, { description: 'Address street name' })
  street!: string;

  @Field(() => Int, { description: 'Address street number' })
  streetNumber!: number;

  @Field(() => String, { description: 'Address complement', nullable: true })
  complement?: string;

  @Field(() => String, { description: 'Address neighborhood name' })
  neighborhood!: string;

  @Field(() => String, { description: 'Address city name' })
  city!: string;

  @Field(() => String, { description: 'Address state name' })
  state!: string;

  static propertiestoString = (): string => {
    return 'id label cep street streetNumber complement neighborhood city state';
  };
}
