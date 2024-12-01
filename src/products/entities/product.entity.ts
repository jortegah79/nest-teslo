import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({name:'products'})
export class Product {

    @ApiProperty({
        example:'06c0a215-5a92-40f7-94d3-b9d3100b12ff',
        description:'product_id',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        example:'t-shirt teslo',
        description:'Product_title',
        uniqueItems:true
    })
    @Column('text', { unique: true })
    title: string

    @ApiProperty({
        example: 10,
        description:'Product price',
        uniqueItems:false,
    })
    @Column('float', { default: 0 })
    price: number;

    @ApiProperty({
        example:'descripcion del producto larga',
        description:'Product description',
        uniqueItems:false,
    })
    @Column({
        type: 'text',
        nullable: true
    })
    descripcion: string;

    @ApiProperty({
        example:'t_shirt_teslo',
        description:'Product slug',
        uniqueItems:false,
    })
    @Column({
        type: 'text',
        unique: true
    })
    slug: string;

    @ApiProperty({
        example:10,
        description:'Product stock',
        uniqueItems:false,
    })
    @Column('int', {
        default: 0,
    })
    stock: number;

    @ApiProperty({
        example:['M','XL','XXL'],
        description:'Product sizes',
        uniqueItems:false,
    })
    @Column('text', {
        array: true
    })
    sizes: String[]

    @ApiProperty({
        example:'women',
        description:'Product gender',
        uniqueItems:false,
    })    
    @Column('text')
    gender: string;

    @ApiProperty({
        example:['colors','younger'],
        description:'Product tags',
        uniqueItems:false,
    })
    @Column('text',{
        array:true,
        default:[]
    })
    tags:string[];

    @ApiProperty({
        example:['www.img.es/foto1.jpg'],
        description:'Product images',
        uniqueItems:false,
    })
    @OneToMany( 
        ()=>ProductImage,
        (image)=>image.product,
        { cascade:true,eager:true}
    )
    images?:ProductImage[];

    @ApiProperty({})
    @ManyToOne(
        ()=>User,
        ( user )=>user.product,
        ({eager:true})
    )
    user:User

    @BeforeInsert()
    updateSlugInsert() {

        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLocaleLowerCase()
            .replaceAll(' ', '-')
            .replaceAll("'", "");

    }
    @BeforeUpdate()
    updateSlugUpdate(){
      
        this.slug = this.slug
            .toLocaleLowerCase()
            .replaceAll(' ', '-')
            .replaceAll("'", "");
    }

}
