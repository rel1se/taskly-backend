import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../auth/src/prisma/prisma.service'
import { SendMessageDto } from './dto/send-message.dto'

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}

	async saveMessage(data: SendMessageDto & { senderId: string }) {
		return this.prisma.message.create({
			data,
		});
	}

	async getMessagesForUser(userId: string) {
		return this.prisma.message.findMany({
			where: {
				OR: [{ senderId: userId }, { receiverId: userId }],
			},
			orderBy: { createdAt: 'desc' },
		});
	}
}
