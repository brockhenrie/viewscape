
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';


const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

postSchema.set('toJSON', {
  virtuals: true,
});


export const Post = mongoose.model('Post', postSchema);
