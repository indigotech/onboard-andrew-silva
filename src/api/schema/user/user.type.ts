import { ObjectType, Field, ID } from 'type-graphql';
import { AddressType } from '../address/address.type';

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

  @Field(() => [AddressType], { description: 'User addresses' })
  addresses!: AddressType[];

  static propertiestoString = (): string => {
    return `id name email birthDate addresses { ${AddressType.propertiestoString()} }`;
  };
}
