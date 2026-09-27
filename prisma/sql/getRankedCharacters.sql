-- @param {String} $1:namePattern Escaped character-name LIKE pattern
-- @param {Int} $2:rowLimit Number of rows to return, including the next-page sentinel
-- @param {Int} $3:rowOffset Number of matching rows to skip
SELECT Name, Class, cLevel, ResetCount, ranking
FROM (
  SELECT Name, Class, cLevel, ResetCount,
    ROW_NUMBER() OVER (ORDER BY ResetCount DESC, cLevel DESC, Name ASC) AS ranking
  FROM `Character`
) AS ranked
WHERE Name LIKE ? ESCAPE '!'
ORDER BY ranking
LIMIT ? OFFSET ?;
