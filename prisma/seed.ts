import { PrismaClient } from '../src/lib/generated/prisma'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function createUser() {
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
    ]
  })
}

async function main() {
  await createUser()
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