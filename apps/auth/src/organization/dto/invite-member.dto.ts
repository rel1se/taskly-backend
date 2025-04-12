// invite-member.dto.ts
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { OrganizationRole } from '@prisma/__generated__'

export class InviteMemberDto {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsEnum(OrganizationRole)
	role: OrganizationRole;
}
