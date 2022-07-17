import { HttpStatus } from '@nestjs/common';

export class SaveItemResponseDTO {
  status: HttpStatus;
  message: string;
  data: unknown;
}
