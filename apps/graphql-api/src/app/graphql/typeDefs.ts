/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {gql} from 'apollo-server-express'
import { UserQl } from '@viewscape/users'
import { PostsQl } from '@viewscape/posts'



const typeDefs = gql`
${UserQl.types}
${PostsQl.types}

type Query{
  ${UserQl.queries}
  ${PostsQl.queries}
}

type Mutation{
  ${UserQl.mutations}
  ${PostsQl.mutations}

}

`
export default typeDefs

