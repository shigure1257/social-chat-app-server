-- CreateTable
CREATE TABLE `Picture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `md5` VARCHAR(255) NOT NULL,
    `path` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Picture_md5_key`(`md5`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
