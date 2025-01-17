import { v4 as uuid } from 'uuid';

export const fileNamer = (req: any, file: Express.Multer.File, callback: Function) => { 
  if(!file) return callback( new Error('Files is empty'), 'nofile');

  const fileExtension = file.mimetype.split('/')[1];

  const fileName = `${uuid()}.${fileExtension}`;

  callback(null, fileName);
}