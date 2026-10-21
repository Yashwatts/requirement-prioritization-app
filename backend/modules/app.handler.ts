import { Injectable } from '@nestjs/common';

@Injectable()
export class AppHandler {
  handle(): { message: string } {
    return { message: 'This is Requirement Specification App Service' };
  }
}
