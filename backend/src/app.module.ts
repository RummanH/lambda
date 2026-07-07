import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DemoModule } from './demo/demo.module';

@Module({
  imports: [AuthModule, DemoModule],
  controllers: [AppController],
})
export class AppModule {}
