/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customer_id` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Customer` table. All the data in the column will be lost.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `image_filename` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Product` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL
);
INSERT INTO "new_Customer" ("email", "password") SELECT "email", "password" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" REAL NOT NULL,
    "image" TEXT NOT NULL
);
INSERT INTO "new_Product" ("cost", "description", "name") SELECT "cost", "description", "name" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
