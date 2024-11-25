const express = require('express');
const session = require('express-session');
const cors = require('cors');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const purchaseRouter = require('./routes/purchase');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/purchase', purchaseRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
