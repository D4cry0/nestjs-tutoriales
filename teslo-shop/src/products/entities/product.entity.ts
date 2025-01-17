
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

// Entry is like a row in a table
@Entity({
  name: 'products'
})
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Revisar en la documentacion el tipo de dato que se debe usar en la base de datos
  @Column('varchar', {
    unique: true,
    length: 200
  })
  title: string;

  @Column('float', {
    default: 0
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @Column('varchar', {
    unique: true,
    length: 300
  })
  slug: string;

  @Column('int', {
    default: 0
  })
  stock: number;

  @Column('simple-array')
  sizes: string[];

  // @Column('text', {
  //   array: true
  // })
  // colors: string[];

  @Column('varchar', {
    length: 15
  })
  gender: string;

  @Column('simple-array')
  tags: string[];

  @OneToMany(
    () => ProductImage,
    productImage => productImage.product,
    {
      cascade: true,
      // eager login sirve para que cuando se haga una consulta a la base de datos
      // se seleccione tambien las imagenes
      eager: true
    }
  )
  images?: ProductImage[];

  @BeforeInsert()
  @BeforeUpdate()
  checkSlug() {
    if(!this.slug) this.slug = this.title
    
    this.slug = this.slug
    .toLowerCase()
    //solo caracteres alfanumericos y espacio en blanco
    .replaceAll(/[^a-zA-Z0-9\s]/g,  !this.slug ? '' : ' ')
    //reemplazar espacios en blanco por guiones
    .replaceAll(' ', '-')
    //reemplazar multiples guiones por uno solo
    .replaceAll(/-{2,}/g, '-');
  }
}
