//Citations:
// https://www.w3schools.com/howto/howto_js_password_validation.asp

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(8)
  .is().max(20)
  .has().digits()
  .has().lowercase()
  .has().uppercase()
  .has().not().spaces();

router.post('/insertTestUser', async (req, res) => {
    const email = 'harry25mehta@gmail.com';
    const password = 'H123';

    try {
        const isValidPassword = passwordSchema.validate(password);
        if (!isValidPassword) {
            return res.status(400).json({
                status: "error",
                message: "Password does not meet the required policy"
            });
        }

        const existingUser = await prisma.customer.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.customer.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                first_name: 'Harry',
                last_name: 'Mehta',
            },
        });

        res.json({
            status: "success",
            message: "Test user inserted successfully",
            user: newUser
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to insert user"
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

        req.session.user = {
            customer_id: user.customer_id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
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
    if (req.session.user) {
        return res.json({
            status: "success",
            user: {
                customer_id: req.session.user.customer_id,
                email: req.session.user.email,
                first_name: req.session.user.first_name,
                last_name: req.session.user.last_name
            }
        });
    } else {
        return res.status(401).json({
            status: "error",
            message: "Not logged in"
        });
    }
});

module.exports = router;
