import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { deleteFiles } from '../common/delete-files';

export class MinumumFilesInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<{
      files?: {
        additional?: Express.Multer.File[];
        main?: Express.Multer.File[];
      };
    }>();

    if (!req.files || !req.files.additional || !req.files.main) {
      deleteFiles(req.files?.additional);
      deleteFiles(req.files?.main);

      throw new BadRequestException(
        'You need to pass at least one main and one additional image',
      );
    }

    return next.handle().pipe();
  }
}
