const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/list', async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json({
            status: "success",
            products
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Database error occurred"
        });
    }
});

router.get('/item/:id', async (req, res) => {
    const productId = req.params.id;

    if (isNaN(productId) || !Number.isInteger(Number(productId))) {
        return res.status(400).json({
            status: "error",
            message: "Invalid product ID, must be an integer"
        });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(productId) }
        });

        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found"
            });
        }

        res.json({
            status: "success",
            product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            status: "error",
            message: "Failed to retrieve product"
        });
    }
});

module.exports = router;
