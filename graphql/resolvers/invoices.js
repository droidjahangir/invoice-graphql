const { AuthenticationError, UserInputError } = require('apollo-server');
const { resolveGraphqlOptions } = require('apollo-server-core');
const voucher_codes = require('voucher-code-generator');
const moment = require('moment-timezone');

const Invoice = require('../../models/Invoice');
const Item = require('../../models/InvoiceItem');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getInvoicesList() {
      try {
        console.log('request accepted');
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        console.log(invoices);
        return invoices;
      } catch (err) {
        throw new Error(err);
      }
    },
    async invoiceGroupByCustomer(_, { customerId }, context) {
      try {
        const loginUser = checkAuth(context);
        console.log(loginUser);
        if (!loginUser) {
          throw new Error('Actions not allowed, Must be login');
        }
        const invoice = await Invoice.find({ 'user._id': customerId }, {});
        if (invoice) {
          return invoice;
        } else {
          throw new Error('Invoice not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async invoiceGroupByDate(_, args, context) {
      try {
        let startDate = moment().subtract(1, 'month').format();
        let endDate = moment().format();
        const loginUser = checkAuth(context);
        if (!loginUser) {
          throw new Error('Actions not allowed, Must be login');
        }
        const invoice = await Invoice.find({
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        });
        console.log(invoice);
        if (invoice) {
          return invoice;
        } else {
          throw new Error('Invoice not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createInvoice(_, args, context) {
      try {
        const loginUser = checkAuth(context);
        console.log(loginUser);
        if (!loginUser) {
          throw new Error('Action not allowed, Must be login');
        }

        console.log(args.invoiceInput);
        let items = [];

        for (let i = 0; i < args.invoiceInput.length; i++) {
          let res = await Item.findOne(
            { name: args.invoiceInput[i].name },
            { currentStock: 0, createdAt: 0 }
          );

          let currentStock = await Item.findOne(
            { name: args.invoiceInput[i].name },
            { currentStock: 1 }
          );
          console.log(currentStock);
          if (args.invoiceInput[i].quantity > currentStock.currentStock) {
            throw new Error(
              'orderd item quantity cross the stock item quantity'
            );
          }

          let updatedQuantity =
            currentStock.currentStock - args.invoiceInput[i].quantity;
          await Item.updateOne(
            { name: res.name },
            { $set: { currentStock: updatedQuantity } }
          );

          console.log(res);
          items.push(res);
        }

        let finalItem = [];
        let totalBill = 0;

        items.map((item, index) => {
          totalBill += item.price * args.invoiceInput[index].quantity;
        });

        let invoice_id = voucher_codes.generate({
          length: 7,
          count: 1,
          pattern: '##-###-##',
        });

        console.log('Total bill : ');
        console.log(totalBill);

        // let result = await args.invoiceInput.map(async item => {
        //   res : await Item.findById(item.id)
        // })

        console.log('Items : ');
        console.log(items);

        const newInvoice = new Invoice({
          user: {
            _id: loginUser.id,
            username: loginUser.username,
            email: loginUser.email,
            role: loginUser.role,
          },
          items: items,
          totalBill: totalBill,
          invoiceId: invoice_id[0],
          createdAt: new Date().toISOString(),
        });
        await newInvoice.save();
        return newInvoice;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
