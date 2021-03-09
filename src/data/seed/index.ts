import { Server } from '@api/server/server';
import { Connection } from '@data/config/connection';
import { UserSeed } from './user.seed';

const DatabaseSeed = async () => {
  await Connection();
  await Server();

  UserSeed();
};

DatabaseSeed();
