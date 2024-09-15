const { BadRequestError } = require("../expressError");

/**
 * Generates the SQL statement needed to update specific fields in a database
 * and returns the values to be used in the query.
 *
 * @param {Object} dataToUpdate - An object with the fields to update and their new values.
 *   Example: { firstName: 'John', age: 45 }
 * 
 * @param {Object} jsToSql - An optional object to map JavaScript-style field names
 *   (camelCase) to SQL column names (snake_case).
 *   Example: { firstName: 'first_name' }
 *
 * @throws {BadRequestError} - If no data is provided for the update.
 *
 * @returns {Object} - An object with:
 *   - `setCols` {string}: A SQL string for the `SET` clause with placeholders like `$1`, `$2`, etc.
 *   - `values` {Array}: An array of values corresponding to the placeholders.
 *
 * @example
 *   const dataToUpdate = { firstName: 'John', age: 45 };
 *   const jsToSql = { firstName: 'first_name' };
 *   const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
 *   result:
 *   { setCols: '"first_name"=$1, "age"=$2', values: ['John', 45] }
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
