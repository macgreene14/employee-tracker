INSERT INTO department (id, name)
VALUES (001, "Engineering"),
       (002, "Sales");

INSERT INTO role (id, title, salary, department_id)
VALUES (001, "Drafter", 50000, 001),
       (002, "Analyst", 60000, 002);


INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES (001, "Mac", "Greene", 001, NULL),
       (002, "Addison", "Miller", 002, NULL),
       (003, "Michelle", "Sanchez", 001, 001);

       