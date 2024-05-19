import { FileHandle } from "./file-handle.model";


export interface Product {
  name: string;
  description: string;
  price: number;
  productImages: FileHandle[];
  categories: string[];
  image_path: string;
}
