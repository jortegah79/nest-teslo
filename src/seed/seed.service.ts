import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {

  public constructor(private readonly productsService: ProductsService) { }

  async runSeed() {

    await this.inserNewProducts();

    return 'This action adds a new seed';
  }

  private async inserNewProducts() {

    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    // products.forEach(product => {

    //   insertPromises.push(this.productsService.create(product, ));
    // })

    await Promise.all(insertPromises);

    return true;
  }

}
