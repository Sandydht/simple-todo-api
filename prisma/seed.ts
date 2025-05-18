/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '../src/lib/generated/prisma';
import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();

async function createUser() {
  const hashedPassword = await bcrypt.hash('password', 10);
  await prisma.user.createMany({
    data: [
      {
        username: 'user1',
        password: hashedPassword,
        image_url: '',
      },
      {
        username: 'user2',
        password: hashedPassword,
        image_url: '',
      },
      {
        username: 'user3',
        password: hashedPassword,
        image_url: '',
      },
      {
        username: 'user4',
        password: hashedPassword,
        image_url: '',
      },
    ],
  });
}

async function createTask() {
  const userData = await prisma.user.findMany();

  userData.forEach(async (user, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const formatNow = DateTime.fromMillis(date.getTime()).toISO();

    const newTask = await prisma.task.create({
      data: {
        title: `Task ${index + 1}`,
        description: `This is task ${index + 1}`,
        start_date: String(formatNow),
        end_date: String(formatNow),
        is_done: false,
        label_color: '#BB3E00',
      },
    });

    await prisma.userTask.create({
      data: {
        user_id: user.id,
        task_id: newTask.id,
      },
    });
  });
}

async function main() {
  await Promise.all([
    prisma.userTask.deleteMany(),
    prisma.task.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  await createUser();
  await createTask();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Prisma error: ', error);
    await prisma.$disconnect();
    process.exit(1);
  });
