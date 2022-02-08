import { OrderItem } from '../models/order-item.model';


export interface Order {
  orderItems:OrderItem,
  shippingAddress1:string,
  shippingAddress2:string,
  city:string,
  state:string,
  country:string,
  zip:string,
  status: string,
  totalPrice:number,
  user: User,
  dateOrdered:Date,
  phone: string
}
