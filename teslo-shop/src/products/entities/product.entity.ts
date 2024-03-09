
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// Entry is like a row in a table
@Entity()
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    unique: true,
    length: 200
  })
  title: string;

  @Column('float', {
    default: 0
  })
  price: number;

  @Column('text', {
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

  @Column('varchar', {
    length: 15
  })
  gender: string;


  @BeforeInsert()
  checkSlugInsert() {
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
