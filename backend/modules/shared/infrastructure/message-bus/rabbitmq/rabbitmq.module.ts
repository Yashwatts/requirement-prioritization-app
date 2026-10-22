import { Global, Module } from '@nestjs/common';
import { RabbitmqConnectionService } from './rabbitmq-connection.service';

@Global()
@Module({
  providers: [RabbitmqConnectionService],
  exports: [RabbitmqConnectionService],
})
export class RabbitmqModule {}
