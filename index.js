const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
// const table = cTable.getTable([])

// Enable access to .env variables
require("dotenv").config();

// Connect to database
// const db = mysql.createConnection(
//   {
//     host: "localhost",
//     user: process.env.user,
//     password: process.env.password,
//     database: process.env.database,
//   },
//   console.log(`Connected to the ${process.env.database} database.`)
// );

// Query database
// db.query("SELECT * FROM students", function (err, results) {
//   console.log(results);
// });

async function main() {
  const action = await inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees,",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then((res) => res.action); // return response

  switch (action) {
    case "View All Departments":
      console.log("query - view all departments");
      break;
    case "View All Roles":
      console.log("query - view all roles");
      break;
    case "View All Employees":
      console.log("query - view all employees");
      break;
    case "Add a Department":
      console.log("update - add a department");
      break;
    case "Add a Role":
      console.log("update - add a role");
      break;
    case "Add an Employee":
      console.log("update - add a employee");
      break;
    case "Update an Employee Role":
      console.log("update - Update an Employee Role");
      break;
    default:
      console.log("Please select an action");
      break;
  }
}

main();

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
