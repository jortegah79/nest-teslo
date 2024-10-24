import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type:     'postgres',
      host:     process.env.DB_HOST,
      port:     Number(process.env.DB_POST),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),
    ServeStaticModule.forRoot({
      rootPath:join(__dirname,'..','public'),
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule
  ],
})
export class AppModule { }
