import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateListDto) {
		return this.prisma.list.create({
			data: {
				title: dto.title,
				order: dto.order,
				boardId: dto.boardId,
			},
		});
	}

	async update(id: string, dto: UpdateListDto) {
		const existing = await this.prisma.list.findUnique({ where: { id } });
		if (!existing) throw new NotFoundException('Лист не найден');

		return this.prisma.list.update({
			where: { id },
			data: dto,
		});
	}

	async delete(id: string) {
		return this.prisma.list.delete({ where: { id } });
	}

	async getAllByBoard(boardId: string) {
		return this.prisma.list.findMany({
			where: { boardId },
			orderBy: { order: 'asc' },
			include: {
				cards: {
					orderBy: { order: 'asc' },
				},
			},
		});
	}
}
