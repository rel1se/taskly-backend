import { Module, MiddlewareConsumer } from '@nestjs/common'
import { BoardsModule } from './boards/boards.module'
import { SessionMiddleware } from './middleware/session.middleware'

@Module({
	imports: [BoardsModule]
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(SessionMiddleware).forRoutes('*')
	}
}
