import { IsString } from 'class-validator'

export class CopyListDto {
	@IsString()
	id: string

	@IsString()
	boardId: string
}
