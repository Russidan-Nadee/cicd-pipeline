import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const items = [
    { item: 'item 1' },
    { item: 'item 2' },
    { item: 'item 3' },
    { item: 'item 4' },
    { item: 'item 5' },
    { item: 'item 6' },
    { item: 'item 7' },
    { item: 'item 8' },
    { item: 'item 9' },
    { item: 'item 10' },
  ];

  for (const itemData of items) {
    const item = await prisma.item.create({
      data: itemData,
    });
    console.log(`Created item with id: ${item.id} - ${item.item}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
