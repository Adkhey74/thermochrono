import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Créer des véhicules
  const vehicles = await prisma.vehicle.createMany({
    data: [
      {
        name: 'Mercedes V-Class',
        type: 'Van',
        capacity: 7,
        description: 'Véhicule premium pour tous vos déplacements. Confort supérieur, sièges cuir, espace bagages généreux.',
        isAvailable: true,
      },
      {
        name: 'Skoda Kodiaq',
        type: 'SUV',
        capacity: 6,
        description: 'SUV moderne pour vos trajets urbains et longue distance. 4x4 disponible, technologie avancée, fiabilité.',
        isAvailable: true,
      },
    ],
    skipDuplicates: true,
  })

  console.log(`✅ Created ${vehicles.count} vehicles`)

  // Créer des chauffeurs (optionnel)
  const drivers = await prisma.driver.createMany({
    data: [
      {
        firstName: 'Pierre',
        lastName: 'Martin',
        phone: '0612345678',
        email: 'pierre.martin@hern-taxi.fr',
        license: 'PERM123456',
        isAvailable: true,
      },
      {
        firstName: 'Marie',
        lastName: 'Dubois',
        phone: '0698765432',
        email: 'marie.dubois@hern-taxi.fr',
        license: 'PERM789012',
        isAvailable: true,
      },
    ],
    skipDuplicates: true,
  })

  console.log(`✅ Created ${drivers.count} drivers`)

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

