import { Departments, mockDepartments } from "../data/department_data";

export const getDepartment = async (): Promise<Departments[]> => {
    return mockDepartments;
}

export const getDepartmentById = async (id: number): Promise<Departments | undefined> => {
    return mockDepartments.find(department => department.id === id);
}