import { Employee, mockEmployees } from '../data/employees_data';
import { mockDepartments } from '../../phong-ban/data/department_data';

export const getEmployees = async (): Promise<Employee[]> => {
    return mockEmployees.filter((employee) => employee.status === true);
}

export const deleteEmployee = async (id: number): Promise<void> => {
    const employeeIndex = mockEmployees.findIndex((employee) => employee.id === id);
    if (employeeIndex === -1) {
        throw new Error(`Employee with id ${id} not found`);
    }
    mockEmployees.splice(employeeIndex, 1);
};

export const updateEmployee = async (id: number, updatedEmployee: Employee): Promise<Employee | undefined> => {
    const index = mockEmployees.findIndex((updatedEmployee) => updatedEmployee.id === id);
    if (index !== -1) {
        mockEmployees[index] = updatedEmployee;
        return updatedEmployee;
    }
    return undefined;
};

export const addEmployee = async (employee: Employee): Promise<Employee> => {
    const maxId = mockEmployees.length > 0 ? Math.max(...mockEmployees.map(emp => emp.id)) : 0;
    const newEmployee = { ...employee, id: maxId + 1 };
    mockEmployees.push(newEmployee);
    return newEmployee;
};

export const getEmployeeById = async (id: number): Promise<Employee | undefined> => {
    return mockEmployees.find(emp => emp.id === id);
};

export const getUser = async (): Promise<{ id: number, role: string, name: string, department: string, departmentId: number }[]> => {
    return mockEmployees.map(employee => {
        const department = mockDepartments.find(dept => dept.id === employee.idDepartment);
        return {
            id: employee.id,
            role: employee.role,
            name: employee.name,
            departmentId: employee.idDepartment,
            department: department ? department.name : '',
        };
    });
};

export const getNameEmployee = async (): Promise<{ id: number, name: string }[]> => {
    return mockEmployees.map(employee => {
        return {
            id: employee.id,
            name: employee.name,
        };
    });
};
