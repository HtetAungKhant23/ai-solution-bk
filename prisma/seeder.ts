import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const deleteUserInquiries = async () => {
    await prisma.user.deleteMany();
}

const deleteEvents = async () => {
    await prisma.file.deleteMany();
    await prisma.event.deleteMany();
}

deleteUserInquiries();
deleteEvents();

