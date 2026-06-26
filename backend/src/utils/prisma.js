const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['error']
});

const keepAlive = () => {
  setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      // silently ignore
    }
  }, 4 * 60 * 1000);
};

keepAlive();

module.exports = prisma;