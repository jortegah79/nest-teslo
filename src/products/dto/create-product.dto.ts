import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateProductDto {


    @IsString({ message: 'title debe ser un texto' })
    @MinLength(1, { message: 'title debe tener como mínimo un carácter' })
    title: string

    @IsNumber()
    @IsPositive({ message: 'price debe ser 0 o mayor a 0' })
    @IsOptional()
    price?: number;

    @IsString({ message: 'descripcion debe ser un texto' })
    @IsOptional()
    descripcion?: string;

    @IsString({ message: 'slug debe ser un texto' })
    @IsOptional()
    slug?: string;

    @IsInt({ message: 'stock debe ser un número sin decimales' })
    @IsPositive({ message: 'stock debe ser 0 o mayor a 0' })
    @IsOptional()
    stock?: number;

    @IsString({ each: true, message: 'Todos los valores de sizes deben ser strings' })
    @IsArray({ message: "sizes requiere que sea un array" })
    sizes: String[]

    @IsIn(['men', 'women', 'kid', 'unisex'], { message: 'gender debe ser uno de los valores permitidos men,women,kids o unisex' })
    gender: string;

    @IsString({ each: true, message: "Todos los valores deben de ser strings" })
    @IsArray({ message: "tags requiere ser un array" })
    @IsOptional()
    tags: string[]

    @IsString({ each: true, message: "Todos los valores deben de ser strings" })
    @IsArray({ message: "tags requiere ser un array" })
    @IsOptional()
    images: string[]



}
