const typeDefs = `
type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type User {
    _id: ID!
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
}

type Auth {
    token: ID!
    user: User
}

type Query {
    userProfile(_id: ID, username: String): User
    me: User
}

type Mutation {
    login(username: String, email: String, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookToSave: BookInput): User
    deleteBook(bookId: ID!): User
}

input BookInput {
    authors: [String]
    description: String
    bookId: String!
    image: String
    link: String
    title: String
}
`


 
module.exports = typeDefs;