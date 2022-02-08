/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { authorizeAndVerify } from '../../../../../../apps/graphql-api/src/app/auth/auth';
import { userOwnership } from '../../../../../../apps/graphql-api/src/app/utils/tools';
import { User } from '../../Schema/user.schema';


const queries = {
  getAllUsers: async (parent:any, args:any, context:any, info:any)=>{
    try {
      const usersList = User.find().select('-passwordHash');
      return usersList;
    } catch (err) {
      console.log(err);
    }
  },

 getUser: async(parent:any, args:any, context:any, info:any)=>{
    const req = authorizeAndVerify(context.req);
    try {
      const user = await User.findById(args._id).select('-passwordHash');
      if (!user) {
        throw new ApolloError('No user found!');
      }
      const owner = userOwnership(req, args._id)
      if(!owner){
        throw new AuthenticationError('You dont own this user!')
      }
      return user;
    } catch (error) {
      throw error;
    }
  },

}

 const mutations = {
  createUser: async (parent:any, args:any, context:any, info:any)=>{
    try {
      console.log(args);
      let user = new User({
        name: args.fields.name,
        email: args.fields.email,
        passwordHash: args.fields.password,
        phone: args.fields.phone,
        isAdmin: args.fields.isAdmin,
        address: args.fields.street,
        address2: args.fields.apartment,
        zip: args.fields.zip,
        city: args.fields.city,
        state: args.fields.state,
        country: args.fields.country,
      });

      const getToken = await user.generateToken();
      if (!getToken) {
        throw new AuthenticationError('No Token Generated!');
      }

      user = await user.save()
      return user;
    } catch (error) {
      throw new ApolloError(error as string);
    }
  },

 signIn: async(parent:any, args:any, context:any, info:any)=>{
    try {
      const user = await User.findOne({ email: args.fields.email });
      const checkPass = await user.comparePassword(args.fields.password);

      if (!checkPass) {
        throw new ApolloError('Wrong Password!');
      }

      const getToken = await user.generateToken();
      if (!getToken) {
        throw new AuthenticationError('No Token Generated!');
      }

      return user;
    } catch (error) {
      throw { message: 'Email Does Not Exist', error: error };
    }
  },


 }


 export const resolvers = {queries, mutations}



