import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  
  
  async create(createProductDto: CreateProductDto) {
    try {

      // Aqui lo hace en memoria / transacciones
      const product = this.productRepository.create(createProductDto);
      // Aqui lo hace en la base de datos
      await this.productRepository.save(product);
      
      
      return product;

    } catch (error) {
      this.handleException(error);
    }
  }

  findAll() {
    try {
      const products = this.productRepository.find();

      return products;
    } catch (error) {
      this.handleException(error);
    }
  }

  findOne(id: string) {
    try {
      // const product = this.productRepository.findOne({
      //   where: { id }
      // });
      const product = this.productRepository.findOneBy({ id });

      return product;
    } catch (error) {
      this.handleException(error);
    }
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = this.productRepository.update(id, updateProductDto);

      return product;
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    try {
      const product = this.productRepository.delete(id);

      return product;
    } catch (error) {
      this.handleException(error);
    }
  }


  private handleException(error: any) {
    this.logger.error(error);
    this.logger.error('Error code: ' + error.code);

    if(error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException('Slug already exists');
    }
    
    throw new InternalServerErrorException('Error creating product');
  }
}
