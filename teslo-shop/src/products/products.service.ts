import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

import { validate as isUUID} from 'uuid';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ) {}
  
  
  async create(createProductDto: CreateProductDto) {
    try {

      const { images = [], ...productDetails } = createProductDto;

      // Aqui lo hace en memoria / transacciones
      // De estaforma TypeORM hace una asignacion de ids anidados como Prisma
      const product = this.productRepository.create({
        ...productDetails,
        // Necesita las instancias de las imagenes como se requieren en la tabla
        images: images.map(image => this.productImageRepository.create({ url: image }))
      });
      // Aqui lo hace en la base de datos
      await this.productRepository.save(product);
      
      
      return {
        ...product,
        images: images
      };

    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {
    try {
      
      const products = await this.productRepository.find({
        skip: PaginationDto.offset,
        take: PaginationDto.limit,
        relations: {
          images: true
        }
      });

      return products.map(product => ({
        
        // con este codigo lo que se busca es que el 
        // arreglo de images que se retorna 
        // tenga unicamente la URL de la imagen
        ...product,
        images: product.images.map(img => img.url)
      }));
    } catch (error) {
      this.handleException(error);
    }
  }

  async findOne(term: string) {
    try {

      // const product = await this.productRepository.findOne({
        // where: isUUID(term) ? { id: term } : { slug: term}
      // });

      let product;
      if(isUUID(term)) {
        // con el eager se hace una consulta a la base de datos a todas las relaciones
        product = await this.productRepository.findOneBy({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder('product');
        product = await queryBuilder
          .where(
            'UPPER(title) = :title or slug = :slug', 
            { slug: term.toLowerCase(), title: term.toUpperCase() }
          )
          .leftJoinAndSelect('product.images', 'images')
          .getOne();
      }

      // const product = this.productRepository.findOne({
      //   where: { id }
      // });
      // product = await this.productRepository.findOneBy({ id });

      if(!product)
        throw new NotFoundException('Product not found, search term: ' + term);

      return product;
    } catch (error) {
      this.handleException(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // const product = await this.productRepository.update(id, updateProductDto);
      const { images, ...toUpdate } = updateProductDto;


      // Lo prepara para la actualizacion
      const product = await this.productRepository.preload({
        id: id,
        ...toUpdate,
      });

      if(!product)
        throw new NotFoundException('Product not found');

      if(images) {
        // tener cuidado en armar el query para que no se borren todas las imagenes 

        // tiene ese comportamiento porque asi se definio el endpoint
        // se borran todas las imagenes y se crean las nuevas, no se anexan
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        product.images = images.map(
          image => this.productImageRepository.create({ url: image })
        );
      }

      await queryRunner.manager.save(product);
      // await this.productRepository.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();


      // return product;
      // se necesitan las imagenes
      return this.findOnePlain(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.handleException(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);

      return product;
    } catch (error) {
      this.handleException(error);
    }
  }

  // se hace esta funcion porque en remove se tiene que hacer una busqueda
  // de un producto por id y en findOne
  // y tiene problema cuando se quiere retornar las url de las imagenes aplanadas
  async findOnePlain( term: string ) {
    const { images = [], ...rest } = await this.findOne( term );

    return {
      ...rest,
      images: images.map( img => img.url )
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

  async deleteAllProducts() {
    try {
      const query = this.productRepository.createQueryBuilder('product');
      query.delete().where({}).execute();
      
    } catch (error) {
      this.handleException(error);
    }
  }
}
