const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const cTable = require("console.table");

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

    // set up strings to pass results (query return) and response (prompt response)
    let results = "";
    let results2 = "";

    let response = "";

    let list = [];
    let list2 = [];

    let obj = {};
    let obj2 = {};

    // switch case to handle user input action
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
          response.department.toUpperCase()
        );
        results = await db.query("SELECT * FROM department");
        console.table(results[0]);
        break;

      case "Add a Role":
        // grab departments to render in prompt
        results = await db.query("SELECT * FROM department");

        // create a list of existing departments
        for (entry of results[0]) {
          let dept = entry.name;
          let id = entry.id;
          list.push(dept);
        }
        console.log(list);

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
            type: "list",
            name: "department",
            message: "Select a department to add role to",
            choices: list, // insert name of department from database return
          },
        ]);

        // lookup id associated with department selected
        obj = results[0].find((obj) => obj.name === response.department);

        // insert results into database
        insert = await db.query(
          `INSERT INTO role (id, title, salary, department_id) VALUES (default, ?, ?, ?)`,
          [response.name.toUpperCase(), response.salary, obj.id]
        );

        // query to show updated role table, log to screen
        results = await db.query("SELECT * FROM role");
        console.table(results[0]);
        break;

      case "Add an Employee":
        results = await db.query("SELECT * FROM role");

        // create a list of existing departments
        for (entry of results[0]) {
          let role = entry.title;
          let id = entry.id;
          list.push(role);
        }

        results2 = await db.query("SELECT * FROM employee");

        // create a list of existing roles
        for (entry of results2[0]) {
          let first_name = entry.first_name;
          let last_name = entry.last_name;
          list2.push(first_name + " " + last_name);
        }

        // prompt for user input
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
            type: "list",
            name: "role",
            message: "Select a role to assign to employee",
            choices: list, // insert name of employee from database return
          },
          {
            type: "list",
            name: "manager",
            message: "Select a manager to assign to employee",
            choices: list2, // insert name of role from database return
          },
        ]);

        // lookup id associated with role selected
        obj = results[0].find((obj) => obj.title === response.role);
        console.log(obj);

        // lookup id associated with manager selected
        obj2 = results2[0].find(
          (obj) => obj.first_name === response.manager.split(" ")[0]
        );
        console.log(obj2);

        insert = await db.query(
          `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (default, ?, ?, ?, ?)`, // default, 0, or NULL should work as place holder for autoincrement id
          [
            response.firstName.toUpperCase(),
            response.lastName.toUpperCase(),
            obj.id,
            obj2.id,
          ]
        );
        results = await db.query("SELECT * FROM employee");
        console.table(results[0]);
        break;

      case "Update an Employee Role":
        results = await db.query("SELECT * FROM employee");

        // create a list of existing roles
        for (entry of results[0]) {
          let first_name = entry.first_name;
          let last_name = entry.last_name;
          list.push(first_name + " " + last_name);
        }

        results2 = await db.query("SELECT * FROM role");

        // create a list of existing departments
        for (entry of results2[0]) {
          let role = entry.title;
          let id = entry.id;
          list2.push(role);
        }

        response = await inquirer.prompt([
          {
            type: "list",
            name: "employee",
            message: "Select a employee to update their role",
            choices: list, // insert name of employee from database return
          },
          {
            type: "list",
            name: "role",
            message: "Select a role to assign to employee",
            choices: list2, // insert name of role from database return
          },
        ]);

        // lookup id associated with employee selected
        obj = results[0].find(
          (obj) =>
            obj.first_name === response.employee.split(" ")[0] &&
            obj.last_name === response.employee.split(" ")[1]
        );
        console.log(obj);

        // lookup id associated with role selected
        obj2 = results2[0].find((obj) => obj.title === response.role);
        console.log(obj2);

        insert = await db.query(
          `UPDATE employee SET role_id = ? WHERE id = ?`,
          [obj2.id, obj.id]
        );
        results = await db.query("SELECT * FROM employee");
        console.table(results[0]);

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
