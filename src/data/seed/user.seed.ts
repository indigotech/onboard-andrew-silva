import { AddressEntity } from '@data/entity/address.entity';
import { UserEntity } from '@data/entity/user.entity';
import faker from 'faker';

export const UserSeed = async (numUsers: Number = 50, numAddresses: Number = 1): Promise<UserEntity[]> => {
  faker.seed(10);

  await UserEntity.delete({});

  const users = [];
  for (let i = 0; i < numUsers; i++) {
    users.push(
      UserEntity.create({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: '123abcd',
        birthDate: faker.date.past(80),
      }),
    );

    users[i].addresses = [];
    for (let j = 0; j < numAddresses; j++) {
      users[i].addresses.push(
        AddressEntity.create({
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          streetNumber: 4,
          neighborhood: faker.address.streetSuffix(),
          city: faker.address.city(),
          state: faker.address.state(),
        }),
      );
      await users[i].addresses[j].save();
    }

    await users[i].save();
  }

  return users;
};
