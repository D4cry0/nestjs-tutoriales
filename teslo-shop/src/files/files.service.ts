import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {

  getStaticProductImage(imageName: string) {
    
    // donde me encuentro y anexo el restante
    const path = join( __dirname, '../../static/products', imageName);

    if( !existsSync(path) ) throw new BadRequestException('Image not found:' + imageName);

    return path;
  }

}
