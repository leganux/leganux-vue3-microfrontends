export interface Product {
  _id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductDto {
  name: string;
}

export interface UpdateProductDto {
  name?: string;
}