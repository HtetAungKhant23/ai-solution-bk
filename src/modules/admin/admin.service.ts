import { PrismaService } from "@app/shared/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class adminService{
    constructor(private readonly dbService: PrismaService){}

    async getAllUserInquries(){
        return this.dbService.user.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

}