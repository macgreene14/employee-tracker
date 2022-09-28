INSERT INTO department (name)
VALUES ("Engineering"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Drafter", 50000, 001),
       ("Analyst", 60000, 002);


INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Mac", "Greene", 001, NULL),
       ("Addison", "Miller", 002, NULL),
       ("Michelle", "Sanchez", 001, 001);

       