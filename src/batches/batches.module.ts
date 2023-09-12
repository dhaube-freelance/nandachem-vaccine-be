import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BatchesController],
  providers: [BatchesService, PrismaService],
})
export class BatchesModule {}
