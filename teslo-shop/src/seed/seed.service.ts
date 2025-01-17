import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService
  ) {}

  async executeSeed() {
    this.insertNewProduct();

    return 'Seed executed';
  }

  private async insertNewProduct() {
    this.productsService.deleteAllProducts();

    // se abre el archivo seed-data.ts
    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
