

export const fileFilter = (req: Request, file: Express.Multer.File, callback: Function) => { 
  if(!file) return callback( new Error('Files is empty'), false);

  const extension = file.mimetype.split('/')[1];
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if(allowedExtensions.includes(extension)){
    return callback(null, true);
  }

  callback(null, false);
}