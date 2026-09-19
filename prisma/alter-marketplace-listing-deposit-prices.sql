-- Website table: mixed deposit-currency prices. Run in phpMyAdmin (same
-- process as AccountDeposit). Do not use prisma migrate / db push.
-- Rename zenPrice to Zen so listing columns match AccountDeposit.
ALTER TABLE `MarketplaceListing`
  ADD COLUMN `Rena` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `zenPrice`,
  ADD COLUMN `JewelOfBless` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `Rena`,
  ADD COLUMN `JewelOfSoul` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `JewelOfBless`,
  ADD COLUMN `JewelOfLife` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `JewelOfSoul`,
  ADD COLUMN `JewelOfCreation` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `JewelOfLife`,
  ADD COLUMN `JewelOfChaos` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `JewelOfCreation`;

ALTER TABLE `MarketplaceListing`
  CHANGE COLUMN `zenPrice` `Zen` INT UNSIGNED NOT NULL DEFAULT 0;
