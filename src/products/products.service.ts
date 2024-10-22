import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm/repository/Repository';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProductImage } from './entities';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource
  ) { }

  async create(createProductDto: CreateProductDto) {

    try {

      const { images = [], ...productDetails } = createProductDto;

      const producto = this.productRepository.create(
        {
          ...productDetails,
          images: images.map(image => this.productImageRepository.create({ url: image }))
        });

      await this.productRepository.save(producto);

      return { ...producto, images: images };

    } catch (error) {

      this.handleExceptions(error);

    }

    return 'This action adds a new product';
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {

      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      });

      return products.map(product => ({
        ...product,
        images: product.images.map(images => images.url)
      }))

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findOne(term: string) {

    if (isUUID(term)) {
      const product = await this.productRepository.findOneBy({ id: term });
      if (!product) {
        throw new NotFoundException(`No se encuentra ningún producto mediante ${term}`)
      }
      return product;
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      const product = await queryBuilder.where('UPPER(title) = :title or slug = :slug', {
        title: term.toLocaleUpperCase(),
        slug: term.toLocaleLowerCase()
      })
        .leftJoinAndSelect('prod.images', 'prodImages')        
        .getOne();
     
      if (!product) {
        throw new NotFoundException(`No encontramos ningún producto mediante ${term}`)
      }
      return product;
    }

  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...toUpdate })
    if (!product) {
      throw new NotFoundException(`No existen productos con el id ${id}`)
    }

    //create query runner

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //si hay imagenes, borramos a las imagenes si vienen
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map(image => this.productImageRepository.create({ url: image }))
      }
      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      //  await this.productRepository.save(product);

      return this.findOnePlain(id);
      //return product;
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error)
    }
  }

  async remove(term: string) {

    const producto = await this.findOne(term);
    await this.productRepository.remove(producto);

  }

  async findOnePlain(term: string) {

    const product = await this.findOne(term);
    return { ...product, images: product.images.map(images => images.url) }

  }

  private handleExceptions(error: any) {

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    if (error === NotFoundException) {

    }
    this.logger.error(error);
    throw new InternalServerErrorException("Error inesperado.Consulte logs");
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product')
    try {
      return await query
        .delete()
        .where({})
        .execute();
        
    } catch (error) {
      this.handleExceptions(error)
    }
  }

}
