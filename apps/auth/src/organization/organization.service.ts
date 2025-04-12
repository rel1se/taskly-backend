import {
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { OrganizationRole } from '@prisma/__generated__';
import { UpdateOrganizationDto } from '@/organization/dto/update-organization.dto';

@Injectable()
export class OrganizationService {
	constructor(private readonly prisma: PrismaService) {}

	async createOrganization(userId: string, dto: CreateOrganizationDto, fileBuffer?: Buffer) {
		const organization = await this.prisma.organization.create({
			data: {
				name: dto.name,
				avatar: fileBuffer,
			},
		});

		await this.prisma.organizationMembership.create({
			data: {
				userId,
				organizationId: organization.id,
				role: OrganizationRole.ADMIN,
			},
		});

		return organization;
	}

	async getOrganizationById(organizationId: string) {
		return this.prisma.organization.findUnique({
			where: { id: organizationId },
			include: {
				memberships: {
					include: {
						user: true,
					},
				},
			},
		});
	}

	async inviteMember(
		organizationId: string,
		inviterUserId: string,
		dto: InviteMemberDto,
	) {
		const membership = await this.prisma.organizationMembership.findFirst({
			where: {
				organizationId,
				userId: inviterUserId,
			},
		});

		if (!membership || membership.role !== OrganizationRole.ADMIN) {
			throw new ForbiddenException('Только Администраторы организации могут отправлять приглашения.');
		}

		const userToInvite = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (!userToInvite) {
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, проверьте правильность почты пользователя.'
			);
		}

		return this.prisma.organizationMembership.create({
			data: {
				userId: userToInvite.id,
				organizationId,
				role: dto.role,
			},
		});
	}

	async updateOrganization(
		organizationId: string,
		userId: string,
		dto: UpdateOrganizationDto,
		fileBuffer?: Buffer,
	) {
		const membership = await this.prisma.organizationMembership.findFirst({
			where: {
				organizationId,
				userId,
			},
		});

		if (!membership || membership.role !== OrganizationRole.ADMIN) {
			throw new ForbiddenException('Только Администраторы организации могут изменять организацию');
		}

		const data: any = {
			name: dto.name,
		};

		if (fileBuffer) {
			data.avatar = fileBuffer;
		}

		return this.prisma.organization.update({
			where: { id: organizationId },
			data,
		});
	}

	async deleteOrganization(organizationId: string, userId: string) {
		const membership = await this.prisma.organizationMembership.findFirst({
			where: {
				organizationId,
				userId,
			},
		});

		if (!membership || membership.role !== OrganizationRole.ADMIN) {
			throw new ForbiddenException('Only admin can delete organization');
		}

		return this.prisma.organization.delete({
			where: { id: organizationId },
		});
	}
}
