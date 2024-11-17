const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/list', async (req, res) => {
    try {
        const items = await prisma.product.findMany();
        res.json({ 
            status: "success",
            items,
            count: items.length 
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
            status: "error",
            message: "Database error occurred" 
        });
    }
});

router.get('/item/:id', async (req, res) => {
    const itemId = req.params.id;
    try {
        const item = await prisma.product.findUnique({
            where: { id: Number(itemId) }  
        });
        if (!item) {
            return res.status(404).json({ 
                status: "error",
                message: "Item not available" 
            });
        }
        res.json({ 
            status: "success",
            item 
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ 
            status: "error",
            message: "Failed to retrieve item" 
        });
    }
});

module.exports = router;