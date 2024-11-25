const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/complete', async (req, res) => {
    const {
        street,
        city,
        province,
        country,
        postal_code,
        credit_card,
        credit_expire,
        credit_cvv,
        cart,
        invoice_amt,
        invoice_tax,
        invoice_total
    } = req.body;

    if (!req.session.user) {
        return res.status(401).json({
            status: "error",
            message: "You must be logged in to complete a purchase"
        });
    }

    const customer_id = req.session.user.customer_id;
    const cartItems = cart.split(',').map(item => parseInt(item)).filter(item => !isNaN(item));

    if (cartItems.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "Cart cannot be empty"
        });
    }

    const products = await prisma.product.findMany({
        where: {
            id: { in: cartItems }
        }
    });

    const purchase = await prisma.purchase.create({
        data: {
            customer_id,
            street,
            city,
            province,
            country,
            postal_code,
            credit_card,
            credit_expire,
            credit_cvv,
            invoice_amt,
            invoice_tax,
            invoice_total,
            order_date: new Date()
        }
    });

    for (const product of products) {
        const quantity = cartItems.filter(item => item === product.id).length;

        await prisma.purchaseItem.create({
            data: {
                purchase_id: purchase.purchase_id,
                product_id: product.id,
                quantity
            }
        });
    }

    res.json({
        status: "success",
        message: "Purchase completed successfully",
        purchase
    });
});

module.exports = router;
