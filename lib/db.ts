import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// in developement mode next js do hot reload which will initialize multiple prisma client thats why we have initialized in the globalThis
// and globalThis is excluded in hot reload
export const db = globalThis.prisma || new PrismaClient();
console.log('globalThis: ', globalThis);

if (process.env.NODE_ENV != 'production') {
  globalThis.prisma = db;
}
