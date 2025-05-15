import { IsString, IsNotEmpty, IsInt } from 'class-validator'

export class CreateListDto {
	@IsString()
	@IsNotEmpty()
	title: string

	@IsInt()
	order: number

	@IsString()
	boardId: string
}
