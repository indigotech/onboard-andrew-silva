import * as path from 'path';
import { createConnection, Connection as TypeORMConnection } from 'typeorm';

export const Connection = async (): Promise<TypeORMConnection> => {
  return await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [path.join(__dirname, '..') + '/entity/*.{ts,js}'],
    synchronize: true,
    logging: false,
  })
};
