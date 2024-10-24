import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";


@Entity({name:'products'})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', { unique: true })
    title: string

    @Column('float', { default: 0 })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    descripcion: string;

    @Column({
        type: 'text',
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0,
    })
    stock: number;

    @Column('text', {
        array: true
    })
    sizes: String[]

    @Column('text')
    gender: string;

    @Column('text',{
        array:true,
        default:[]
    })
    tags:string[];

    @OneToMany( 
        ()=>ProductImage,
        (image)=>image.product,
        { cascade:true,eager:true}
    )
    images?:ProductImage[];

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
