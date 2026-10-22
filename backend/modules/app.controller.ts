import { Controller, Get } from '@nestjs/common';
import { AppHandler } from './app.handler';

@Controller()
export class AppController {
  constructor(private readonly handler: AppHandler) {}

  @Get()
  handle(): { message: string } {
    return this.handler.handle();
  }
}
