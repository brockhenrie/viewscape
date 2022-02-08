import {} from '@viewscape/posts'
import { UserQl } from '@viewscape/users'
import { PostsQl } from '@viewscape/posts';

const resolvers = {

  Query: {
    ...UserQl.resolvers.queries,
    ...PostsQl.resolvers.queries,
  },

  Mutation: {
    ...UserQl.resolvers.mutations,
    ...PostsQl.resolvers.mutations,

  }


}

export default resolvers;
