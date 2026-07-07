import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller()
export class DemoController {
  // GET /profile - stands in for the "protected" business endpoint that
  // will eventually sit behind API Gateway + a Cognito authorizer.
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() request: Request) {
    const token = request.headers['authorization'];

    // TODO(AWS): once JWT verification is added, return decoded claims
    // (sub, email, etc.) instead of just echoing the raw token back.
    return {
      message: 'Protected endpoint reached',
      token,
    };
  }
}
