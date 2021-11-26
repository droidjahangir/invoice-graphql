const itemsResolvers = require('./invoiceItems');
const usersResolvers = require('./users');
const invoiceResolvers = require('./invoices');

module.exports = {
  Query: {
    ...itemsResolvers.Query,
    ...invoiceResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...itemsResolvers.Mutation,
    ...invoiceResolvers.Mutation,
  },
};
