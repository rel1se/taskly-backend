import { NestFactory } from '@nestjs/core'
import { GatewayModule } from './gateway.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(GatewayModule)

	const config = app.get(ConfigService)
	const port = config.get<number>('GATEWAY_PORT') || 3000

	app.enableCors({
		origin: config.get<string>('ALLOWED_ORIGIN') || '*',
		credentials: true
	})

	await app.listen(port)
	console.log(`🚀 API Gateway is running on http://localhost:${port}`)
}

bootstrap()
