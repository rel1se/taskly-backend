import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	OnGatewayConnection,
} from '@nestjs/websockets';
import { SendMessageDto } from './dto/send-message.dto';
import { Socket } from 'socket.io';
import { AuthClient } from '../auth/auth.client';
import { ChatService } from '../chat.service'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
	constructor(
		private chatService: ChatService,
		private authClient: AuthClient,
	) {}

	async handleConnection(client: Socket) {
		const token = client.handshake.auth.token;
		const user = await this.authClient.verifyToken(token);

		if (!user) {
			client.disconnect();
		}

		(client as any).user = user;
	}

	@SubscribeMessage('send_message')
	async handleSendMessage(
		@MessageBody() payload: SendMessageDto,
		@ConnectedSocket() client: Socket,
	) {
		const user = (client as any).user;
		const message = await this.chatService.saveMessage({
			...payload,
			senderId: user.id,
		});

		// Отправить сообщение обратно участникам
		client.emit('new_message', message);
		client.broadcast.emit('new_message', message); // Можно фильтровать по receiverId
	}
}
