const express = require('express');
const { updateProduct, updatePack } = require('./controllers/products');

const routes = express();

routes.post('/updateProductPrice', updateProduct);
routes.post('/updatePackPrice', updatePack);

module.exports = routes;