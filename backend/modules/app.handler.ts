import { Injectable } from '@nestjs/common';

@Injectable()
export class AppHandler {
  getServiceStatus(): { message: string } {
    return { message: 'This is Requirement Specification App Service' };
  }
}
