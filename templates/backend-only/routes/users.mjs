import { createORM } from '@axero/orm';

const orm = await createORM({ url: './data.json' });
const users = orm.collection('users');

export default async (_, res) => {
  res.json(await users.find());
};

export const POST = async (req, res) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  res.json(await users.create(JSON.parse(body || '{}')));
};
