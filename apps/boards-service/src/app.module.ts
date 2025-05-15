import { Module, MiddlewareConsumer } from '@nestjs/common'
import { BoardsModule } from './boards/boards.module'

@Module({
	imports: [BoardsModule]
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply().forRoutes('*')
	}
}
