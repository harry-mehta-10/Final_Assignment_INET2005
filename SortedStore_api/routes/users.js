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

        // Store session data
        req.session.user = {
            customer_id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
        };

        res.json({
            status: "success",
            message: "Authentication successful",
            user: {
                email: user.email,
                firstName: user.first_name
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Server error"
        });
    }
});

router.post('/logout', (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Failed to log out"
            });
        }

        res.json({
            status: "success",
            message: "Logged out successfully"
        });
    });
});

router.get('/getSession', (req, res) => {
    // Check if user is logged in (if session exists)
    if (req.session.user) {
        res.json({
            status: "success",
            user: req.session.user
        });
    } else {
        res.status(401).json({
            status: "error",
            message: "Not logged in"
        });
    }
});

module.exports = router;
