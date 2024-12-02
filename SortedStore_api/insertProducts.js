const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function insertProducts() {
  try {
    const products = [
      {
        name: "Yellow T-shirt",
        description: "This is a yellow t-shirt, Oversized",
        cost: 12.99,
        image: "pic1.jpg",
      },
      {
        name: "White T-shirt",
        description: "This is a white t-shirt, L size",
        cost: 25.99,
        image: "pic2.jpg",
      },
      {
        name: "Trench coat",
        description: "This is a Large Trench coat",
        cost: 57.99,
        image: "pic3.jpg",
      },
      {
        name: "Mustard T-shirt",
        description: "This is a printed Mustard T-shirt, Medium size",
        cost: 24.99,
        image: "pic4.jpg",
      },
      {
        name: "Jeans",
        description: "This is a jeans, Medium size",
        cost: 15.99,
        image: "pic5.jpg",
      },
      {
        name: "Navy Blue Jeans",
        description: "This is a navy blue jeans, Large size",
        cost: 29.99,
        image: "pic6.jpg",
      },
      {
        name: "Y2K Light-blue Jeans",
        description: "Y2K Style Jeans, Large size",
        cost: 29.99,
        image: "pic7.jpg",
      },
      {
        name: "Yellow Hoodie",
        description: "Stylish Yellow Hoodie, Oversized fit",
        cost: 29.99,
        image: "pic8.jpg",
      },
      {
        name: "Black Hoodie",
        description: "This is a Black Hoodie, Loose fit",
        cost: 14.99,
        image: "pic9.jpg",
      },
      {
        name: "Printed Hoodie",
        description: "This is a printed hoodie, XL size",
        cost: 34.99,
        image: "pic10.jpg",
      },
    ];

    for (const product of products) {
      await prisma.product.create({
        data: product,
      });
    }

    console.log("10 products inserted into the database!");
  } catch (error) {
    console.error("Error inserting products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

insertProducts();
