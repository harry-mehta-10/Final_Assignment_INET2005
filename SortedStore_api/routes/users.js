const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    if (!email?.trim() || !password?.trim() || !first_name?.trim() || !last_name?.trim()) {
        return res.status(400).json({ 
            status: "error",
            message: "Missing required fields" 
        });
    }

    try {
        const existingUser = await prisma.customer.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return res.status(409).json({ 
                status: "error",
                message: "Account already exists" 
            });
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.customer.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                first_name,
                last_name
            }
        });

        res.status(201).json({ 
            status: "success",
            message: "Account created successfully",
            userId: newUser.id 
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ 
            status: "error",
            message: "Registration failed" 
        });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            status: "error",
            message: "Email and password are required" 
        });
    }

    try {
        const user = await prisma.customer.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return res.status(401).json({ 
                status: "error",
                message: "Authentication failed" 
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ 
                status: "error",
                message: "Authentication failed" 
            });
        }

        res.json({ 
            status: "success",
            message: "Authentication successful",
            user: {
                email: user.email,
                firstName: user.first_name
            }
        });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ 
            status: "error",
            message: "Server error" 
        });
    }
});

module.exports = router;