import { NestFactory } from '@nestjs/core'

async function bootstrap() {
	const app = await NestFactory.create(ChatModule)
	await app.listen(3002)
}

bootstrap()
