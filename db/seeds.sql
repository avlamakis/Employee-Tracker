SELECT roles.id, roles.title, roles.salary FROM roles ORDER BY roles.id;
SELECT roles.id, roles.title FROM roles ORDER BY roles.id;
SELECT * FROM employee;

SELECT department.id, department.name FROM department ORDER BY department.id;

SELECT department.name AS department, roles.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN roles ON (roles.id = employee.roles_id)
    LEFT JOIN department ON (department.id = roles.department_id)
    ORDER BY department.name;
    
SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, roles.title
  FROM employee
  LEFT JOIN employee manager on manager.id = employee.manager_id
  INNER JOIN roles ON (roles.id = employee.roles_id && employee.manager_id != 'NULL')
  INNER JOIN department ON (department.id = roles.department_id)
  ORDER BY manager;
  
SELECT roles.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN roles ON (roles.id = employee.roles_id)
    LEFT JOIN department ON (department.id = roles.department_id)
    ORDER BY roles.title;

SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employee
  LEFT JOIN employee manager on manager.id = employee.manager_id
  INNER JOIN roles ON (roles.id = employee.roles_id)
  INNER JOIN department ON (department.id = roles.department_id)
  ORDER BY employee.id;
  
SELECT first_name, last_name, roles_id FROM employee 	WHERE employee.id = 4;