import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import ormConfig from '../modules/shared/database/config/orm.config';
import { RequirementsModule } from '../modules/requirements/src/requirements.module';
import { FirebaseAuthService } from '../modules/shared/auth/firebase-auth.service';
import { AuthMiddleware } from '../modules/shared/auth/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MikroOrmModule.forRootAsync({
      useFactory: () => ormConfig,
    }),
    RequirementsModule,
  ],
  providers: [FirebaseAuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
