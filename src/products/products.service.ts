import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm/repository/Repository';
import { log } from 'console';
import { isValidObjectId } from 'mongoose';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto) {

    try {

      const producto = this.productRepository.create(createProductDto);

      await this.productRepository.save(producto);

      return producto;

    } catch (error) {

      this.handleExceptions(error);

    }

    return 'This action adds a new product';
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {

      return this.productRepository.find({
        take: limit,
        skip: offset
      });

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findOne(term: string) {

    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
      if (!product) {
        throw new NotFoundException(`No se encuentra ningún producto mediante ${term}`)
      }
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where('UPPER(title) = :title or slug = :slug', {
        title: term.toLocaleUpperCase(),
        slug: term.toLocaleLowerCase()
      }).getOne();

      // product = await this.productRepository.findOne({ where: { slug: term } });
      if (!product) {
        throw new NotFoundException(`No encontramos ningún producto mediante ${term}`)
      }
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    })
    if (!product) {
      throw new NotFoundException(`No existen productos con el id ${id}`)
    }
    try {
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(term: string) {

    const producto = await this.findOne(term);
    await this.productRepository.remove(producto);

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

}
