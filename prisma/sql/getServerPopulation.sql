-- Online accounts, registered accounts, and guilds, read in one round trip
-- so the page checks out a single pool connection.
SELECT
  (SELECT COUNT(*) FROM `MEMB_STAT` WHERE `ConnectStat` <> 0) AS online,
  (SELECT COUNT(*) FROM `MEMB_INFO`) AS registered,
  (SELECT COUNT(*) FROM `Guild`) AS guilds;
