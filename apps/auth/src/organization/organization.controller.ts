import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch,
	UseGuards,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { UpdateOrganizationDto } from '@/organization/dto/update-organization.dto';
import { Authorized } from '@/auth/decorators/authorized.decorator';

@Controller('organization')
@UseGuards(AuthGuard, RolesGuard)
export class OrganizationController {
	constructor(private readonly organizationService: OrganizationService) {}

	@Post()
	@UseInterceptors(FileInterceptor('avatar'))
	async createOrganization(
		@Authorized('id') userId: string,
		@Body() dto: CreateOrganizationDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		return this.organizationService.createOrganization(userId, dto, file?.buffer);
	}

	@Get(':id')
	async getOrganization(@Param('id') id: string) {
		return this.organizationService.getOrganizationById(id);
	}

	@Post(':id/invite')
	async inviteMember(
		@Authorized('id') userId: string,
		@Param('id') id: string,
		@Body() dto: InviteMemberDto,
	) {
		return this.organizationService.inviteMember(id, userId, dto);
	}

	@Patch(':id')
	@UseInterceptors(FileInterceptor('avatar'))
	async updateOrganization(
		@Authorized('id') userId: string,
		@Param('id') id: string,
		@Body() dto: UpdateOrganizationDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		return this.organizationService.updateOrganization(id, userId, dto, file?.buffer);
	}

	@Delete(':id')
	async deleteOrganization(
		@Authorized('id') userId: string,
		@Param('id') id: string,
	) {
		return this.organizationService.deleteOrganization(id, userId);
	}
}
