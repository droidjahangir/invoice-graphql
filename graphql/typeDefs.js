const { gql } = require('apollo-server');

module.exports = gql`
  input InvoiceInput {
    name: String
    quantity: Int
  }
  type ReturnInvoice {
    user: ReturnUser
    items: [ReturnItem]
    totalBill: Int
    invoiceId: String
    createdAt: String
  }
  type ReturnItem {
    _id: ID
    name: String
    description: String
    price: Int
  }
  type ReturnUser {
    _id: ID
    username: String
    email: String
    role: String
  }
  type Item {
    id: ID!
    name: String!
    description: String!
    price: Int!
    currentStock: Int!
    createdAt: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    role: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
    role: String!
  }
  type Query {
    getItems: [Item]
    getItem(itemId: ID!): Item
    getInvoicesList: [ReturnInvoice]
    invoiceGroupByCustomer(customerId: ID!): [ReturnInvoice]
    invoiceGroupByDate: [ReturnInvoice]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!, role: String!): User!
    createItem(
      name: String!
      description: String!
      price: Int!
      currentStock: Int!
    ): Item!
    deleteItem(itemId: ID!): String!
    createInvoice(invoiceInput: [InvoiceInput]): ReturnInvoice
  }
`;
