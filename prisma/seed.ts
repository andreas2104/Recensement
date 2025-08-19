import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient

async function main() {
  // Créer un utilisateur avec le rôle ADMIN
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      firstname: 'Premier',
      email: 'admin@exemple.com',
      contact: '0123456789',
      password: 'mot_de_passe_secure', // Changez-le immédiatement !
      role: 'ADMIN', // On assigne le rôle ADMIN explicitement
      communeId: 1 // Assurez-vous que cette commune existe
    },
  })
  console.log(`Utilisateur administrateur créé : ${adminUser.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

  //in the package json
//   "scripts": {
//   "seed": "ts-node prisma/seed.ts"
// }