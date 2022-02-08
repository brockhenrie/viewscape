import {Category } from "@viewscape/categories";

export interface Product{
  name: string,
  description:string,
  richDescription:string,
  images:string[],
  image: string,
  brand:string
  price:  number,
  category: Category,
  countInStock: number,
  isFeatured: boolean,
  dateCreated: Date
}
