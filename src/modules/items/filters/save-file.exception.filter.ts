import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { deleteFiles } from '../common/delete-files';

@Catch(HttpException)
export class SaveFileExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<{
      files?: {
        additional?: Express.Multer.File[];
        main?: Express.Multer.File[];
      };
    }>();
    const status = exception.getStatus();

    deleteFiles(request.files?.additional);
    deleteFiles(request.files?.main);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: 'Validation error',
    });
  }
}
