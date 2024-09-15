// Import the function to be tested and the error class
const { sqlForPartialUpdate } = require('./sql');
const { BadRequestError } = require('../expressError');

// Test cases for sqlForPartialUpdate
describe("sqlForPartialUpdate", function() {
  
  test("works: with valid data", function() {
    const dataToUpdate = { firstName: 'John', age: 45 };
    const jsToSql = { firstName: 'first_name', age: 'age' };
    
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
    
    // Ensure SQL string and values are correct
    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ['John', 45]
    });
  });

  test("works: without jsToSql mappings", function() {
    const dataToUpdate = { firstName: 'John', age: 45 };
    
    // No jsToSql object provided, should default to the original keys
    const result = sqlForPartialUpdate(dataToUpdate, {});
    
    expect(result).toEqual({
      setCols: '"firstName"=$1, "age"=$2',
      values: ['John', 45]
    });
  });

  test("throws error if no data is provided", function() {
    // No data to update should throw BadRequestError
    expect(() => {
      sqlForPartialUpdate({}, { firstName: 'first_name' });
    }).toThrow(BadRequestError);
  });

  test("works: with only one field", function() {
    const dataToUpdate = { age: 45 };
    const jsToSql = { age: 'age' };
    
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
    
    expect(result).toEqual({
      setCols: '"age"=$1',
      values: [45]
    });
  });

});
