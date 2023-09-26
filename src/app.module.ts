import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BatchesModule } from './batches/batches.module';
import { VaccinesModule } from './vaccines/vaccines.module';
import { PatientsModule } from './patients/patients.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { JwtModule } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRY_TIME } from './auth/consts';


@Module({
  imports: [
    UsersModule,
    AuthModule,
    BatchesModule,
    VaccinesModule,
    PatientsModule,
    DashboardModule,
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: `${ACCESS_TOKEN_EXPIRY_TIME}s` },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
