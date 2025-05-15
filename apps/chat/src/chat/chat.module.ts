import { Module } from '@nestjs/common'
import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service'
import { PrismaService } from '../prisma/prisma.service'
import { AuthClient } from '../auth/auth.client'

@Module({
	providers: [ChatGateway, ChatService, PrismaService, AuthClient]
})
export class ChatModule {}
