export const types = `
type Post{
  _id: ID!
  title: String!
  content: String!
  author: User!
}

input PostInput {
  title: String!
  content: String!
  author: String
}

`
