export const types = `
type User {
  name: String!
  _id: ID!
  token: String
  email: String
  passwordHash: String
  phone: String
  isAdmin: Boolean
  address:String
  address2: String
  city: String
  state:String
  zip:String
  country:String
  posts: [Post!]


}

input AuthInput{
  email: String!
  password: String!
  name: String!
  phone: String
  isAdmin: Boolean
  address:String
  address2: String
  city: String
  state:String
  zip:String
  country:String


}
`
