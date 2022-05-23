# Myos Store

## Description

This app is a minimal product store tha allows you to buy products

It allows a user to:
- Get the list of products
- Search products
- Go through checkout process

###
Each response will be returned with one of the following HTTP status codes:

- `200` `OK` The request was successful
- `400` `Bad Request` There was a problem with the request (security, malformed)
- `401` `Unauthorized` The supplied API credentials are invalid
- `404` `Not Found` An attempt was made to access an endpoint or resource that does not exist
- `500` `Server Error` An error on the server occurred

## Getting Started

### Dependencies

Install the following prerequisites

- Install [Node.js](https://nodejs.org/en/download)
- Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- Install [PostgreSQL](https://www.postgresql.org/download/)

Now we can install our dependencies with the following command.

```bash
$ yarn install
```

### Create your .ENV file

Create a `.env` file and copy the `.env.example` into it. In this file set you local environment variables.

### Database Setup
To have a database with dummy data
```bash
# run migrations
yarn migrate:run

# Seed database with products
yarn seed:run
```

### Running the Application
```bash
# watch mode
$ yarn run dev

# development
$ yarn build && yarn start
```

### Running Tests
- Run `$ yarn test` from the root folder.

## API

### Unprotected endpoints
### Sign up User
POST /signup
```json
{
  "email": "email@email.com",
  "password": "password"
}
```

### Login User
POST /login
```json
{
  "email": "email@email.com",
  "password": "password"
}
```

### Get a Product
GET /products/:id

### Get Products
GET /products?page=1&size=10&keyword=doe

### Protected endpoints - Require Token
- The assumption is that only a signed in user can go through the cart flow and checkout process

### Add Item to Cart
- Add item to cart without cartId. If no cart exists for the user, cart will be created. If existing `open` cart exists for the user item will be added to cart
POST /carts/product
- Add Item to cart using cart Id
POST /carts/:id/product
```json
{
  "productId": "123456",
  "quantity": 1
}
```

### Get Cart
- Getting cart without Id returns the user's open cart
GET /carts
- Getting cart with id returns the requested cart
GET /carts/:id

### Remove item from Cart
DELETE /carts/:id/item/:itemId

### Checkout Cart
POST /carts/:id/checkout
- The assumption here is that the payment is made on the frontend and only the paymentId is sent to the backend
```json
{
  "address": {
    "street": "",
    "city": "",
    "state": "",
    "zip": "",
    "country": "",
  },
  "paymentId": "12344,
}
```
