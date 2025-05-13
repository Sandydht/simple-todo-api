import { PrismaClient } from '../src/lib/generated/prisma'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function createUser() {
  await prisma.user.deleteMany();
  const hashedPassword = await bcrypt.hash('password', 10);
  await prisma.user.createMany({
    data: [
      {
        username: 'user1',
        password: hashedPassword,
        image_url: ''
      },
      {
        username: 'user2',
        password: hashedPassword,
        image_url: ''
      },
      {
        username: 'user3',
        password: hashedPassword,
        image_url: ''
      },
      {
        username: 'user4',
        password: hashedPassword,
        image_url: ''
      },
    ]
  })
}

async function createTask() {
  const userData = await prisma.user.findMany();
  
  userData.forEach(async (user, index) => {
    const newTask = await prisma.task.create({
      data: {
        title: `Task ${index + 1}`,
        description: `This is task ${index + 1}`,
        start_date: new Date(Date.now()).toISOString(),
        end_date: new Date(Date.now()).toISOString(),
        is_done: false,
        label_color: '#BB3E00'
      }
    })

    await prisma.userTask.create({
      data: {
        user_id: user.id,
        task_id: newTask.id
      }
    })
  })
}

async function main() {
  await createUser()
  await createTask();
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error('Prisma error: ', error)
    await prisma.$disconnect()
    process.exit(1)
  })