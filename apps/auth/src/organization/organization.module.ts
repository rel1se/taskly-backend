import { Module } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { OrganizationService } from './organization.service'
import { OrganizationController } from './organization.controller'
import { UserModule } from '@/user/user.module'

@Module({
	imports: [UserModule],
	controllers: [OrganizationController],
	providers: [OrganizationService, PrismaService],
	exports: [OrganizationService]
})
export class OrganizationModule {}
