import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { GatewayController } from './gateway.controller'

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'AUTH_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: ['amqp://rabbitmq:5672'],
					queue: 'auth_queue',
					queueOptions: { durable: false }
				}
			}
		])
	],
	controllers: [GatewayController]
})
export class GatewayModule {}
