import {
	Body,
	Controller,
	Post,
	Patch,
	Delete,
	Param,
	Get
} from '@nestjs/common'
import { ListService } from './list.service'
import { CreateListDto } from './dto/create-list.dto'
import { UpdateListDto } from './dto/update-list.dto'

@Controller('lists')
export class ListController {
	constructor(private readonly listService: ListService) {}

	@Post()
	create(@Body() dto: CreateListDto) {
		return this.listService.create(dto)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: UpdateListDto) {
		return this.listService.update(id, dto)
	}

	@Delete(':id')
	delete(@Param('id') id: string) {
		return this.listService.delete(id)
	}

	@Get('/board/:boardId')
	getAllByBoard(@Param('boardId') boardId: string) {
		return this.listService.getAllByBoard(boardId)
	}
}
