import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SeedService {

  public constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async runSeed() {

    await this.deleteTables();

    const adminUser = await this.insertUsers();
    await this.inserNewProducts(adminUser);

    return 'El seed ha sido ejecutado';
  }

  private async deleteTables() {

    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder.delete().where({}).execute();

  }

  private async insertUsers() {

    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user => {

      users.push(this.userRepository.create({
        ...user,
        password: bcrypt.hashSync(user.password, 10)

      }))
    })

    const usuarios=await this.userRepository.save(users)

    return usuarios[0];
  }

  private async inserNewProducts(user:User) {

    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {

      insertPromises.push(this.productsService.create(product,user ));
    })

    await Promise.all(insertPromises);

    return true;
  }

}
