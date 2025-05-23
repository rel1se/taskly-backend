import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'

@Controller()
export class AuthController {
	@MessagePattern({ cmd: 'ping' })
	ping() {
		return 'pong from auth-service 🐇'
	}
}
