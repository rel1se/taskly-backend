import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator'
import { OrganizationRole } from '@prisma/db-auth'

export class InviteMemberDto {
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsEnum(OrganizationRole)
	role: OrganizationRole
}
