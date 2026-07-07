import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DemoModule } from './demo/demo.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [AuthModule, DemoModule, ItemsModule],
  controllers: [AppController],
})
export class AppModule {}
