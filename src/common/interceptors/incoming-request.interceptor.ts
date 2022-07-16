import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogRequestInterface } from './interfaces/request.interface';

@Injectable()
export class IncomingRequestInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<Record<any, any>>,
  ): Observable<unknown> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest() as LogRequestInterface;

    Logger.debug(
      `[Request${req.url}] Begin (Handler: ${
        context.getHandler().name
      }, Args: ${JSON.stringify(req.body)})`,
    );

    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.debug(
            `[Request${req.url}] End (Time spent: ${Date.now() - now} ms)`,
          ),
        ),
      );
  }
}
