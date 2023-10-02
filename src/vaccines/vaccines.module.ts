import { Module } from '@nestjs/common';
import { VaccinesService } from './vaccines.service';
import { VaccinesController } from './vaccines.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [VaccinesController],
  providers: [VaccinesService, PrismaService],
})
export class VaccinesModule {}
