import { PrismaService } from "@app/shared/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { ExceptionConstants } from "@app/core/exceptions/constants";
import { hashText, verifyText } from "@app/utils/hashText";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private readonly dbService: PrismaService, private readonly jwtService: JwtService){}

    async register(dto: RegisterDto) {
        const existAdmin = await this.dbService.admin.findUnique({
          where: {
            email: dto.email,
          },
        });
    
        if (existAdmin) {
          throw new BadRequestException({
            message: `Admin already exist`,
            code: ExceptionConstants.BadRequestCodes.RESOURCE_ALREADY_EXISTS,
          });
        }

        return this.dbService.admin.create({
            data: {
              name: dto.name,
              email: dto.email,
              password: await hashText(dto.password),
            },
        });
        
    }

    async login(dto: LoginDto): Promise<string>  {
        const existAdmin = await this.dbService.admin.findUnique({
          where: {
            email: dto.email,
            isDeleted: false
          },
        });
    
        if (!existAdmin) {
          throw new BadRequestException({
            message: `Admin not found`,
            code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
          });
        }
    
        const matchPw = await verifyText(existAdmin.password, dto.password);
    
        if (!matchPw) {
          throw new BadRequestException({
            message: `Wrong credential`,
            code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
          });
        }
    
        return this.generateToken(existAdmin.id, existAdmin.email, process.env.ADMIN_SECRET_KEY as string);
    }

    private async generateToken(id: string, email: string, secretKey: string): Promise<string> {
        const token: string = await this.jwtService.signAsync(
          { id, email },
          {
            secret: secretKey,
            expiresIn: '1m',
          },
        );
        return token;
    }

}