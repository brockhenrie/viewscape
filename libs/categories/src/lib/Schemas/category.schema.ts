import * as mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon:{
        type: String
    },
    color:{
        //#000 format
        type: String
    },
    // image:{

    //     type: String
    // },
})


categorySchema.set('toJSON', {
    virtuals: true
});

export const Category = mongoose.model('Category', categorySchema)

module.exports = Category;
