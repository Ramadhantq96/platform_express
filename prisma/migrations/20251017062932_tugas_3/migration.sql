-- AlterTable
ALTER TABLE `buyers` ADD COLUMN `role` ENUM('ADMIN', 'MEMBER', 'BUYER') NOT NULL DEFAULT 'BUYER';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('ADMIN', 'MEMBER', 'BUYER') NOT NULL DEFAULT 'MEMBER';

-- CreateTable
CREATE TABLE `auth_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiredAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `auth_tokens_token_key`(`token`),
    INDEX `auth_tokens_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `auth_tokens` ADD CONSTRAINT `auth_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
