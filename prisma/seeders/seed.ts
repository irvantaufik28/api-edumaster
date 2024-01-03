import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();


async function main() {
  const role = await prisma.role.createMany({
    data: [
      {
        id: 1,
        name: 'administrator'
      },
      {

        id: 2,
        name: 'student'
        ,
      }
    ]

  })
  const staffAdmin = await prisma.staff.create({
    data: {
      id: uuidv4(),
      nik: '3205050708940000',
      first_name: "Cindy",
      last_name: "Mutiara",
      middle_name: "Sidik",
      birth_date: "1994-08-09",
      birth_place: "Garut",
      gender: "female",
      phone: "082315156666",
      email: "cindy@gmail.com",
      address: "Jl. Cimanuk no 110 Garut",
      foto_url: "http://res.cloudinary.com/dnvltueqb/image/upload/v1702991363/staff_foto/1702991361966_download_dzrfrw.png",
      religion: "islam",
      status: "active"
    },
  });

  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      username: 'super_admin',
      password: await bcrypt.hash('password', 10)
    },
  });
  const user_has_staff = await prisma.staffUser.create({
    data: {
      staff_id: staffAdmin.id,
      user_id: user.id
    }
  })

  const admin_has_role = await prisma.userRoles.create({
    data: {
      user_id: user.id,
      role_id: 1
    }
  })


  console.log({ role, user, admin_has_role, user_has_staff });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });