import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Placeholder guard.
 *
 * TODO(AWS): This currently only checks that an Authorization header is
 * present. Once Cognito is wired up, replace this with real verification
 * of the JWT (signature, issuer, expiry) using the Cognito User Pool's
 * JWKS - either here with a library like `aws-jwt-verify`, or upstream by
 * letting API Gateway's Cognito authorizer reject invalid tokens before
 * the request ever reaches this Lambda/NestJS handler.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    // TODO(AWS): decode + verify the JWT here instead of just trusting it.
    return true;
  }
}
