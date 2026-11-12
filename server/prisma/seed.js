require('dotenv').config();
const prisma = require('../src/db');
(async () => {
  const title = 'LSPU Campus Navigation and Student Concern Management System';
  if (await prisma.project.findFirst({ where: { title } })) return console.log('Already seeded, nothing changed.');
  await prisma.project.create({ data: { title,
    description: 'A web-based system designed to help students navigate the Laguna State Polytechnic University – Siniloan Campus, access information about student services and requirements, and submit concerns or requests through an online platform.',
    technologies: 'React.js, JavaScript, Node.js, Express.js, Prisma ORM, MySQL', image: '/projects/lspu-navigation.png' } });
  console.log('Seeded 1 project.');
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
