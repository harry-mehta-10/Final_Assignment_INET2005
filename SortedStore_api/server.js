const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const usersRoute = require('./routes/users');
const productsRoute = require('./routes/products');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.use('/users', usersRoute);
app.use('/products', productsRoute);

app.get('/', (req, res) => res.send('SortedStore API is running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));