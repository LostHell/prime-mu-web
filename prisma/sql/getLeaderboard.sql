-- Characters in rank order with their guild, read in one round trip.
-- Rankings pages filter and page this list in memory.
SELECT
  c.`Name`,
  c.`Class`,
  c.`cLevel`,
  c.`ResetCount`,
  ROW_NUMBER() OVER (ORDER BY c.`ResetCount` DESC, c.`cLevel` DESC, c.`Name` ASC) AS ranking,
  g.`G_Name` AS guild
FROM `Character` AS c
LEFT JOIN `GuildMember` AS g ON g.`Name` = c.`Name`
ORDER BY ranking;
