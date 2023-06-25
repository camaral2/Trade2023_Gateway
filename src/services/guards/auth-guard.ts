import { CanActivate, ExecutionContext, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly authServiceClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = await context.switchToHttp().getRequest();

    try {
      const token = await this.getToken(req);

      if (!token) {
        return false;
      }

      // const res = await this.authServiceClient
      //   .send({ role: 'auth', cmd: 'check' }, { jwt: token })
      //   .pipe(timeout(5000))
      //   .toPromise();
      const retAuth = await this.authServiceClient.send(
        { role: 'auth', cmd: 'check' },
        {
          jwt: token,
        },
      );

      const res = await firstValueFrom(retAuth);

      if (res.username) return true;
      else throw new Error('Invalid Authorization');
    } catch (err) {
      Logger.error(err);
      return false;
    } finally {
      await this.authServiceClient.close();
    }
  }
  protected async getToken(request: {
    headers: Record<string, string | string[]>;
  }): Promise<string> {
    const authorization = await request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    const [_, token] = authorization.split(' ');
    return token;
  }
}
