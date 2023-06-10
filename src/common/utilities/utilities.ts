import { join } from 'path';
import { createWriteStream } from 'fs';
export const uploadFile = async (file: any) => {
  const upload = await file.promise;
  const readStream = upload.createReadStream();

  const path = join(process.cwd(), `./src/upload/${upload.filename}`);

  await new Promise((resolve, reject) => {
    readStream.pipe(createWriteStream(path)).on('finish', resolve).on('error', reject);
  });
  return upload;
};
