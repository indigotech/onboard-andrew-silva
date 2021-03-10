import { UserEntity } from '@data/entity/user.entity';
import faker from 'faker';

export const UserSeed = async (num: Number = 50) => {
  faker.seed(10);

  await UserEntity.clear();

  for (let i = 0; i < num; i++) {
    const user = UserEntity.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: '123abcd',
      birthDate: faker.date.past(80),
    });
    await user.save();
  }
};
