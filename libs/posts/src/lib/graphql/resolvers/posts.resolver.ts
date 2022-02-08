/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ApolloError } from 'apollo-server-express';
import { User } from '@viewscape/users';
import { authorizeAndVerify } from 'apps/graphql-api/src/app/auth/auth';
import { Post } from '@viewscape/posts';

const queries = {
  getPosts: async (parent: any, args: any, context: any, info: any) => {
    try {
      const postsList = await Post.find();
      if (!postsList) {
        throw new ApolloError('No Posts');
      }
      return postsList;
    } catch (error) {
      throw new ApolloError(error as string);
    }
  },

  getPost: async (parent: any, args: any, context: any, info: any) => {
    try {
      const post = await Post.findById(args._id);
      if (!post) {
        throw new ApolloError('Post not found');
      }
      return post;
    } catch (error) {
      throw new ApolloError(error as string);
    }
  },

  author: async (parent: any, args: any, context: any, info: any) => {
    try {
      const userId = parent.author;
      const user = User.findById(userId).select('-passwordHash');
      if(!user){
        throw new ApolloError('User does not exist')
      }
      return user
    } catch (error) {
      throw new ApolloError(error as string)
    }
  }
};

const mutations = {
  createPost: async (
    parent: any,
    args: { fields: any },
    context: { req: any },
    info: any
  ) => {
    try {
      const req = await authorizeAndVerify(context.req);
      const post = new Post({
        ...args.fields,
        author: req._id,
      });
      const result = await post.save();

      return result;
    } catch (error) {
      throw new ApolloError('Post not saved');
    }
  },
};





export const resolvers = { queries, mutations };
