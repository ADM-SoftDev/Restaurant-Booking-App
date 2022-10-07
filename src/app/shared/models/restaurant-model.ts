import { RestaurantLight } from "./resturant-light-model";

export class Restaurante extends RestaurantLight{
    address : string = '';
    turns: any[] = [];
    price: number = 0;
}