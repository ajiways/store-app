import { unlink } from 'fs';
import { resolve } from 'path';

export function deleteFiles(files?: Express.Multer.File[]) {
  if (files) {
    files.forEach(({ filename }) => {
      unlink(resolve(__dirname, '../../../../uploads/' + filename), () => {});
    });
  }
}
