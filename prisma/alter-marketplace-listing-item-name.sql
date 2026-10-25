-- Website table: searchable item name so market browse filters in SQL.
-- Run in phpMyAdmin. Do not use prisma migrate / db push.
-- Fill existing rows with prisma/backfill-marketplace-item-names.sql.
ALTER TABLE `MarketplaceListing`
  ADD COLUMN `itemName` VARCHAR(80) NULL AFTER `itemHex`;
