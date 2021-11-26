const { AuthenticationError, UserInputError } = require('apollo-server');

const Item = require('../../models/InvoiceItem');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getItems() {
      try {
        const items = await Item.find().sort({ createdAt: -1 });
        return items;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getItem(_, { itemId }) {
      try {
        const item = await Item.findById(itemId);
        if (item) {
          return item;
        } else {
          throw new Error('Item not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createItem(_, { name, description, price, currentStock }, context) {
      const user = checkAuth(context);
      console.log('User : ');
      console.log(user);

      // Only user can create ITEM
      if (user.role == 'customer') {
        throw new Error('Customer can not create Item');
      }
      if (name.trim() === '') {
        throw new Error('Item name must not be empty');
      }
      const isExistName = await Item.findOne({ name });
      if (isExistName) {
        throw new UserInputError('Name is taken', {
          errors: {
            email: 'This Name is taken',
          },
        });
      }

      if (description.trim() === '') {
        throw new Error('Item description must not be empty');
      }
      if (price == null) {
        throw new Error('Item price must not be empty');
      }
      if (currentStock == null) {
        throw new Error('Item currentStock must not be empty');
      }

      const newItem = new Item({
        name,
        description,
        price,
        currentStock,
        // createdAt: new Date().toISOString(),
        createdAt: formatDate(new Date()),
      });
      function formatDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return day + '/' + month + '/' + year;
      }

      const item = await newItem.save();

      return item;
    },
    async deleteItem(_, { itemId }, context) {
      const user = checkAuth(context);

      try {
        const item = await Item.findById(itemId);
        if (user.role == 'user') {
          await item.delete();
          return 'Item deleted successfully';
        } else {
          throw new AuthenticationError(
            'Action not allowed or customer can not delete ITEM'
          );
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
