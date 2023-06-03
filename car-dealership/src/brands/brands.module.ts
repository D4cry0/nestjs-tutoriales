import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService], // de esta forma podemo acceder al servicio e inyectarlo en otros controladores
  imports: [] // modulos a importar, tienen que estar en exports
})
export class BrandsModule {}
