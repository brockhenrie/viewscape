import * as mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }

})


export const OrderItem = mongoose.model('OrderItem', orderItemSchema)

