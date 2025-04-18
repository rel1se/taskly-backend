import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService, PrismaClient],
})
export class BoardsModule {}
