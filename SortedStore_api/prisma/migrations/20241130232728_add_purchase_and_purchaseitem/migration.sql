/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customer_id` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `id` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Purchase" (
    "purchase_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "credit_card" TEXT NOT NULL,
    "credit_expire" TEXT NOT NULL,
    "credit_cvv" TEXT NOT NULL,
    "invoice_amt" REAL NOT NULL,
    "invoice_tax" REAL NOT NULL,
    "invoice_total" REAL NOT NULL,
    "order_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Purchase_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PurchaseItem" (
    "purchase_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("purchase_id", "product_id"),
    CONSTRAINT "PurchaseItem_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "Purchase" ("purchase_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PurchaseItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_Customer" ("email", "first_name", "last_name", "password") SELECT "email", "first_name", "last_name", "password" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Purchase_customer_id_idx" ON "Purchase"("customer_id");
