import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding categories...')
  
  const gaming = await prisma.category.upsert({
    where: { slug: 'gaming' },
    update: {},
    create: {
      nameAr: 'الألعاب',
      nameFr: 'Jeux',
      slug: 'gaming'
    }
  })

  const subs = await prisma.category.upsert({
    where: { slug: 'subscriptions' },
    update: {},
    create: {
      nameAr: 'الاشتراكات',
      nameFr: 'Abonnements',
      slug: 'subscriptions'
    }
  })

  console.log('Seeding products...')

  await prisma.product.upsert({
    where: { slug: 'steam-gift-card-10' },
    update: {},
    create: {
      nameAr: 'بطاقة ستيم 10 دولار',
      nameFr: 'Carte Steam 10$',
      descriptionAr: 'بطاقة هدايا ستيم بقيمة 10 دولار لتعبئة رصيدك.',
      descriptionFr: 'Carte cadeau Steam de 10$ pour recharger votre compte.',
      price: 2500,
      slug: 'steam-gift-card-10',
      categoryId: gaming.id,
      keys: {
        create: [
          { code: 'ABCD-1234-EFGH', status: 'AVAILABLE' },
          { code: 'IJKL-5678-MNOP', status: 'AVAILABLE' }
        ]
      }
    }
  })

  await prisma.product.upsert({
    where: { slug: 'netflix-1-month' },
    update: {},
    create: {
      nameAr: 'اشتراك نتفلكس شهر واحد',
      nameFr: 'Netflix 1 Mois',
      descriptionAr: 'اشتراك نتفلكس بريميوم لمدة شهر بجودة 4K.',
      descriptionFr: 'Abonnement Netflix Premium de 1 mois en 4K.',
      price: 1200,
      slug: 'netflix-1-month',
      categoryId: subs.id,
      keys: {
        create: [
          { code: 'NET-FLIX-TOKEN-99', status: 'AVAILABLE' }
        ]
      }
    }
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
