const express = require("express");
const cors = require("cors");
const app = express();
const prisma = require("@prisma/client").PrismaClient;
const prismaClient = new prisma();
const passwordValidator = require("password-validator");

app.use(express.json());
app.use("/images", express.static("public/images"));

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

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

// POST route to create a new product
app.post("/products", async (req, res) => {
  try {
    const { name, description, cost, image } = req.body;

    if (!name || !description || !cost || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newProduct = await prismaClient.product.create({
      data: {
        name,
        description,
        cost,
        image,
      },
    });

    res.status(201).json({ message: "Product added successfully", newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding product" });
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prismaClient.customer.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
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
    } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart cannot be empty." });
    }

    const productIds = cart.map((item) => item.productId).filter((id) => id !== undefined && id !== null);

    if (productIds.length === 0) {
      return res.status(400).json({ error: "Cart contains invalid product IDs." });
    }

    const products = await prismaClient.product.findMany({
      where: { id: { in: productIds } },
    });

    const productQuantities = cart.reduce((acc, item) => {
      acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
      return acc;
    }, {});

    let invoice_amt = 0;
    let invoice_tax = 0;
    const TAX_RATE = 0.13;

    products.forEach((product) => {
      const quantity = productQuantities[product.id];
      const cost = product.cost;
      invoice_amt += cost * quantity;
      invoice_tax += cost * quantity * TAX_RATE;
    });

    const invoice_total = invoice_amt + invoice_tax;

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

    const purchaseItemsData = cart.map((item) => ({
      purchase_id: purchase.purchase_id,
      product_id: item.productId,
      quantity: item.quantity,
    }));

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

app.post("/cart/add", (req, res) => {
  try {
    const { productId, quantity, cart } = req.body;

    if (!productId || !quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "Invalid productId or quantity." });
    }

    let updatedCart = cart || [];

    const existingProductIndex = updatedCart.findIndex(
      (item) => item.productId === productId
    );

    if (existingProductIndex !== -1) {
      updatedCart[existingProductIndex].quantity += quantity;
    } else {
      updatedCart.push({ productId, quantity });
    }

    res.status(200).json({
      message: "Product added to cart successfully.",
      updatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding product to cart." });
  }
});

app.post("/cart/remove", (req, res) => {
  try {
    const { productId, cart } = req.body;
    const updatedCart = cart.filter((id) => id !== productId.toString());

    res.status(200).json({
      message: "Product removed successfully.",
      updatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error removing product from cart." });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
