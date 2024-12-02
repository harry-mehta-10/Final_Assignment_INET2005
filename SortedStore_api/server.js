const express = require("express");
const cors = require("cors");
const app = express();
const prisma = require("@prisma/client").PrismaClient;
const prismaClient = new prisma();
const passwordValidator = require("password-validator");
app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/images"));

const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(8)
  .has().digits()
  .has().lowercase()
  .has().uppercase();

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/products", async (req, res) => {
  try {
    const products = await prismaClient.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await prismaClient.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching product" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    const isValidPassword = passwordSchema.validate(password);

    if (!isValidPassword) {
      return res.status(400).json({
        error: "Password does not meet the required criteria.",
        details: passwordSchema.validate(password, { list: true }),
      });
    }

    const existingUser = await prismaClient.customer.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const user = await prismaClient.customer.create({
      data: {
        email,
        password,
        first_name,
        last_name,
      },
    });

    res.status(201).json({ message: "User created successfully.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const authenticateUser = (req, res, next) => {
  req.user = { id: 1 };
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }
  next();
};

app.post("/complete-purchase", authenticateUser, async (req, res) => {
  try {
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
      invoice_total,
    } = req.body;

    if (!cart || !cart.trim()) {
      return res.status(400).json({ error: "Cart cannot be empty." });
    }

    const productIds = cart.split(",").map((id) => parseInt(id.trim(), 10));

    const productQuantities = productIds.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const purchase = await prismaClient.purchase.create({
      data: {
        customer_id: req.user.id,
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
      },
    });

    const purchaseItemsData = Object.entries(productQuantities).map(
      ([productId, quantity]) => ({
        purchase_id: purchase.purchase_id,
        product_id: parseInt(productId, 10),
        quantity,
      })
    );

    await prismaClient.purchaseItem.createMany({
      data: purchaseItemsData,
    });

    res.status(201).json({
      message: "Purchase completed successfully.",
      purchase,
      items: purchaseItemsData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
