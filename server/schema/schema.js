const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Owner = require("../models/ownerModel");
const bcrypt = require("bcryptjs");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLBoolean,
} = require("graphql");

// User Type

const OwnerType = new GraphQLObjectType({
  name: "Owner",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    storeName: { type: GraphQLString },
    password: { type: GraphQLString },
    address: { type: GraphQLString },
    phone: { type: GraphQLString },
    jwt: { type: GraphQLString },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    address: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: { type: GraphQLID },
    owner: {
      type: OwnerType,
      resolve(parent, args) {
        console.log(Owner.findById(parent.ownerId));
        return Owner.findById(parent.ownerId);
      },
    },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLInt },
    isSoldOut: { type: GraphQLBoolean },
  }),
});

const OrderType = new GraphQLObjectType({
  name: "Order",
  fields: () => ({
    id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
    products: {
      type: GraphQLList(ProductType),
      resolve(parent, args) {
        const products = [];
        parent.products.map((product) => {
          const prod = Product.findById(product);
          products.push(prod);
        });
        return products;
        // return Product.findById(parent.products);
      },
    },
    totalPrice: { type: GraphQLNonNull(GraphQLInt) },
    dateCreated: { type: GraphQLNonNull(GraphQLString) },
    dateDelivered: { type: GraphQLString },
    isDelivered: { type: GraphQLNonNull(GraphQLBoolean) },
    message: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    owner: {
      type: OwnerType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Owner.findById(args.id);
      },
    },
    users: {
      type: GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    products: {
      type: GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find({});
      },
    },
    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Product.findById(args.id);
      },
    },
    orders: {
      type: GraphQLList(OrderType),
      resolve(parent, args) {
        return Order.find({});
      },
    },
    order: {
      type: OrderType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Order.findById(args.id);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addOwner: {
      type: OwnerType,
      args: {
        firstName: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        storeName: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const hashedPassword = bcrypt.hashSync(args.password, 10);
        return Owner.create({
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          storeName: args.storeName,
          password: hashedPassword,
          address: args.address,
          phone: args.phone,
        });
      },
    },
    addUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const hashedPassword = bcrypt.hashSync(args.password, 10); // using sync - cuz dont know how to use async in resolve graphql
        return User.create({
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          username: args.username,
          password: hashedPassword,
          address: args.address,
          phone: args.phone,
        });
      },
    },
    addProduct: {
      type: ProductType,
      args: {
        ownerId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        price: { type: GraphQLNonNull(GraphQLInt) },
        isSoldOut: {
          type: GraphQLNonNull(GraphQLBoolean),
          defaultValue: false,
        },
      },
      resolve(parent, args) {
        return Product.create({
          ownerId: args.ownerId,
          name: args.name,
          description: args.description,
          price: args.price,
          isSoldOut: args.isSoldOut,
        });
      },
    },
    updateProduct: {
      type: ProductType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLInt },
        isSoldOut: { type: GraphQLBoolean },
      },
      resolve(parent, args) {
        return Product.findByIdAndUpdate(args.id, args, { new: true });
      },
    },
    deleteProduct: {
      type: ProductType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Product.findByIdAndRemove(args.id);
      },
    },
    createOrder: {
      type: OrderType,
      args: {
        userId: { type: GraphQLNonNull(GraphQLID) },
        products: {
          type: GraphQLList(GraphQLID),
        },
        // totalPrice: {
        //   type: GraphQLNonNull(GraphQLInt),
        // },
        dateCreated: { type: GraphQLNonNull(GraphQLString) },
        dateDelivered: { type: GraphQLString, defaultValue: "Not Delivered" },
        isDelivered: { type: GraphQLNonNull(GraphQLBoolean) },
        message: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        // Improve this shit
        const productPrices = args.products.map(async (product) => {
          const productPrices = await Product.findById(product).select(
            "price -_id "
          );
          const { price } = productPrices;
          return price;
        });

        const totalPrice = await Promise.all(productPrices).then((result) =>
          result.reduce((total, price) => total + price, 0)
        );

        return Order.create({
          userId: args.userId,
          products: args.products,
          totalPrice: totalPrice,
          dateCreated: args.dateCreated,
          dateDelivered: args.dateDelivered,
          isDelivered: args.isDelivered,
          message: args.message,
        });
      },
    },
    updateOrder: {
      type: OrderType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        products: {
          type: GraphQLList(GraphQLID),
        },
        dateCreated: { type: GraphQLString },
        dateDelivered: { type: GraphQLString, defaultValue: "Not Delivered" },
        isDelivered: { type: GraphQLBoolean },
        message: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Order.findByIdAndUpdate(args.id, args, { new: true });
      },
    },
    removeOrder: {
      type: OrderType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Order.findByIdAndRemove(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
