import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

// TODO(AWS): This module is the future home of Cognito-related setup,
// e.g. a CognitoService wrapping `aws-jwt-verify` or the AWS SDK to
// validate access tokens issued by the Cognito User Pool.
@Module({
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
