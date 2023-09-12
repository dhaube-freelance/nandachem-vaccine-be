import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BatchesModule } from './batches/batches.module';
import { VaccinesModule } from './vaccines/vaccines.module';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    BatchesModule,
    VaccinesModule,
    PatientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
