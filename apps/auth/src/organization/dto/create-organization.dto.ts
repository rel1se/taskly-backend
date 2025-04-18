import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateOrganizationDto {
	@IsNotEmpty()
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	avatar?: string
}
