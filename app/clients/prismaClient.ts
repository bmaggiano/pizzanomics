// app/clients/prismaClient.ts

import { PrismaClient } from "@prisma/client";

// Extend the global namespace in TypeScript to add `prisma`
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

// If the application is in production mode, instantiate a new Prisma client
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // In development mode, use the global prisma instance to avoid creating a new client on every reload
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
