import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateProductDto {

    @ApiProperty({
        description:'Product title(unique)',
        nullable:false,
        minLength:1
     })
    @IsString({ message: 'title debe ser un texto' })
    @MinLength(1, { message: 'title debe tener como mínimo un carácter' })
    title: string

    @ApiProperty({
        description:'Price of the product',
        minimum:0,
        nullable:false
    })
    @IsNumber()
    @IsPositive({ message: 'price debe ser 0 o mayor a 0' })
    @IsOptional()
    price?: number;

    @ApiProperty()
    @IsString({ message: 'descripcion debe ser un texto' })
    @IsOptional()
    descripcion?: string;

    @ApiProperty()
    @IsString({ message: 'slug debe ser un texto' })
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @IsInt({ message: 'stock debe ser un número sin decimales' })
    @IsPositive({ message: 'stock debe ser 0 o mayor a 0' })
    @IsOptional()
    stock?: number;

    @ApiProperty()
    @IsString({ each: true, message: 'Todos los valores de sizes deben ser strings' })
    @IsArray({ message: "sizes requiere que sea un array" })
    sizes: String[]

    @ApiProperty()
    @IsIn(['men', 'women', 'kid', 'unisex'], { message: 'gender debe ser uno de los valores permitidos men,women,kids o unisex' })
    gender: string;

    @ApiProperty()
    @IsString({ each: true, message: "Todos los valores deben de ser strings" })
    @IsArray({ message: "tags requiere ser un array" })
    @IsOptional()
    tags: string[]

    @ApiProperty()
    @IsString({ each: true, message: "Todos los valores deben de ser strings" })
    @IsArray({ message: "tags requiere ser un array" })
    @IsOptional()
    images: string[]



}
