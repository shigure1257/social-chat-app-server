/*
  Warnings:

  - Added the required column `refresh_token` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `refresh_token` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL;
