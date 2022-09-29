const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const cTable = require("console.table");
// const table = cTable.getTable([])

// Enable access to .env variables
require("dotenv").config();

async function accessDB(action) {
  // Connect to database
  try {
    const db = await mysql.createConnection(
      {
        host: "localhost",
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
      }
      // console.log(`Connected to the ${process.env.database} database.`)
    );

    let results = "";
    let response = "";

    switch (action) {
      case "View All Departments":
        // Query database
        results = await db.query("SELECT * FROM department");
        console.table(results[0]);
        break;
      case "View All Roles":
        // Query database
        results = await db.query("SELECT * FROM role");
        console.table(results[0]);
        break;
      case "View All Employees":
        results = await db.query("SELECT * FROM employee");
        console.table(results[0]);
        break;
      case "Add a Department":
        response = await inquirer.prompt([
          {
            type: "input",
            name: "department",
            message: "Input name of department to add",
          },
        ]);
        insert = await db.query(
          `INSERT INTO department (id, name) VALUES (default, ?)`, // default, 0, or NULL should work as place holder for autoincrement id
          response.department
        );
        results = await db.query("SELECT * FROM department");
        console.table(results[0]);
        break;
      case "Add a Role":
        response = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "Input name of role to add",
          },
          {
            type: "input",
            name: "salary",
            message: "Input salary of role",
          },
          {
            type: "input",
            name: "department",
            message: "Input department of role",
          },
        ]);
        insert = await db.query(
          `INSERT INTO role (id, title, salary, department_id) VALUES (default, ?, ?, ?)`, // default, 0, or NULL should work as place holder for autoincrement id
          [response.name, response.salary, response.department]
        );
        results = await db.query("SELECT * FROM role");
        console.table(results[0]);
        break;
      case "Add an Employee":
        response = await inquirer.prompt([
          {
            type: "input",
            name: "firstName",
            message: "Input first name of employee",
          },
          {
            type: "input",
            name: "lastName",
            message: "Input last name of employee",
          },
          {
            type: "input",
            name: "role",
            message: "Input role of employee",
          },
          {
            type: "input",
            name: "manager",
            message: "Input manager id",
          },
        ]);
        insert = await db.query(
          `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (default, ?, ?, ?, ?)`, // default, 0, or NULL should work as place holder for autoincrement id
          [
            response.firstName,
            response.lastName,
            response.role,
            response.manager,
          ]
        );
        results = await db.query("SELECT * FROM department");
        console.table(results[0]);
        break;
      case "Update an Employee Role":
        console.log("update - Update an Employee Role");
        break;
      default:
        console.log("Please select an action");
        break;
    }
  } catch (e) {
    console.log(e);
  }
}

function main() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then(async (res) => {
      await accessDB(res.action);
      console.log("___________________________________");
      main();
    });
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
