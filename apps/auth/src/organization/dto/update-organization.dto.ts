// update-organization.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	avatar?: string;
}
