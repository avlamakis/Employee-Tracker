const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }
  // Repetitive functions for each query in the server.js file
  findAllEmployees() {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  }

  findAllRoles() {
    return this.connection.promise().query(
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id; "
      );
  }

  findAllDept() {
    return this.connection.promise().query(
      "SELECT department.id, department.name FROM department;"
      );
  }

  addEmp(employee) {
    return this.connection.promise().query(
      "INSERT INTO employee SET ?", employee
    );
  }

  getManagers() {
    return this.connection.promise().query(
      "SELECT * FROM employee WHERE manager_id IS null",
    );
  }

  addDept(department) {
    return this.connection.promise().query(
      "INSERT INTO department SET ?", department
    );
  }

  addRole(role) {
    return this.connection.promise().query(
      "INSERT INTO role SET ?", role
    );
  }

  updateEmpRole (role_id, id) {
    return this.connection.promise().query(
      "UPDATE employee SET role_id =? WHERE id = ?", [role_id, id]
    );
  }
}

module.exports = new DB(connection);