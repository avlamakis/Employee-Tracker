DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  INDEX dep_ind (department_id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  roles_id INT UNSIGNED NOT NULL,
  INDEX roles_ind (roles_id),
  CONSTRAINT fk_roles FOREIGN KEY (roles_id) REFERENCES roles(id) ON DELETE CASCADE,
  manager_id INT UNSIGNED,
  INDEX man_ind (manager_id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

use employees_db;

INSERT INTO department
    (department_name)
VALUES
    ('Operations'),
    ('Analystics'),
    ('Marketing'),
    ('Executive');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('General Manager', 5000000, 1),
    ('Coach', 9000000, 1),
    ('Team Analyst', 600000, 2),
    ('Team Lead Analyst', 800000, 2),
    ('Media Lead', 400000, 3),
    ('Media Specialist', 3000000, 3),
    ('CEO', 20000000, 4),

INSERT INTO employee
    (first_name, last_name, roles_id, manager_id)
VALUES
    ('Sam', 'Presti', 1, 4),
    ('Jerry', 'Sloan', 2, 1),
    ('Donovan', 'Mitchell', 3, 2),
    ('Larry', 'Miller', 4, NULL),
    ('Rudy', 'Gobert', 5, 3),
    ('Karl', 'Malone', 6, 2)
    ('John', 'Stockton', 7, NULL);



