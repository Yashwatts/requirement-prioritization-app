import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RequirementsModule } from './requirements/src/requirements.module';
import { AppController } from './app.controller';
import { AppHandler } from './app.handler';
import ormConfig from './shared/infrastructure/database/config/mikro-orm.config';
import { OutboxProducerModule } from './shared/infrastructure/message-bus/outbox-producer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync({
      useFactory: () => ormConfig('requirements'),
    }),
    OutboxProducerModule,
    RequirementsModule,
  ],
  controllers: [AppController],
  providers: [AppHandler],
})
export class AppModule {}
