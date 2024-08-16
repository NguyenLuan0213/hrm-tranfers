import IMGNam from '../../../assets/images/avatar/img_nam_avatar.png';
import IMGNu from '../../../assets/images/avatar/img_nu_avatar.png';

export interface Employee {
    id: number;
    name: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    gender: boolean;
    born: Date;
    status: boolean;
    role: string;
    idDepartment: number;
    avatar?: string;
}

// Mảng toàn cục để lưu trữ dữ liệu mẫu
let mockEmployees: Employee[] = [
    {
        id: 1,
        name: "Leah Zulauf",
        username: "ConsueloRobel22",
        password: "password1",
        email: "Arlo_Pacocha@hotmail.com",
        phone: "155765495971474",
        gender: true,
        born: new Date("Thu Jun 29 1972"),
        status: true,
        role: "Ban giám đốc",
        idDepartment:7,
        avatar: IMGNu,
    },
    {
        id: 2,
        name: "Hazel Kessler-Beier I",
        username: "Destiny54",
        password: "password2",
        email: "Taya.Hartmann@gmail.com",
        phone: "(205)29894384115",
        gender: true,
        born: new Date("Sun Feb 26 1995"),
        status: true,
        role: "Ban giám đốc",
        idDepartment: 7,
        avatar: IMGNu,
    },
    {
        id: 3,
        name: "Katherine Lesch",
        username: "Diana14",
        password: "password3",
        email: "Olaf.West66@yahoo.com",
        phone: "17184691459473",
        gender: true,
        born: new Date("Thu May 20 1982"),
        status: true,
        role: "Ban giám đốc",
        idDepartment: 8,
        avatar: IMGNu,
    },
    {
        id: 4,
        name: "Jerome Mann",
        username: "Mittie56",
        password: "password4",
        email: "Rex36@gmail.com",
        phone: "1212760479053722",
        gender: true,
        born: new Date("Wed Aug 26 1987"),
        status: true,
        role: "Quản lý",
        idDepartment: 1,
        avatar: IMGNu,

    },
    {
        id: 5,
        name: "Ervin Bechtelar",
        username: "shanelOrtiz47",
        password: "password5",
        email: "Keaton.Hoeger80@hotmail.com",
        phone: "16463079331",
        gender: true,
        born: new Date("Tue Sep 24 1991"),
        status: true,
        role: "Quản lý",
        idDepartment: 2,
        avatar: IMGNu,
    },
    {
        id: 6,
        name: "Florence Reilly",
        username: "Barry20",
        password: "password6",
        email: "Brett_OHara66@hotmail.com",
        phone: "12178004872",
        gender: false,
        born: new Date("Wed Feb 08 1989"),
        status: true,
        role: "Quản lý",
        idDepartment: 3,
        avatar: IMGNam,
    },
    {
        id: 7,
        name: "Patricia Predovic Jr.",
        username: "Beverly92",
        password: "password7",
        email: "Leonel.Rowe51@yahoo.com",
        phone: "165569989972069",
        gender: false,
        born: new Date("Thu Feb 13 1997"),
        status: true,
        role: "Quản lý",
        idDepartment: 4,
        avatar: IMGNam,
    },
    {
        id: 8,
        name: "Jesus Sawayn",
        username: "Bradford.Bradtke78",
        password: "password8",
        email: "Martine.Witting26@yahoo.com",
        phone: "(581)97530974635",
        gender: false,
        born: new Date("Tue Jun 14 1988"),
        status: true,
        role: "Quản lý",
        idDepartment: 5,
        avatar: IMGNam,
    },
    {
        id: 9,
        name: "Lester Sawayn Jr.",
        username: "Foster.Mohr68",
        password: "password9",
        email: "Kaelyn_Robel86@gmail.com",
        phone: "(899)40336229754",
        gender: false,
        born: new Date("Tue Apr 03 1973"),
        status: true,
        role: "Quản lý",
        idDepartment: 6,
        avatar: IMGNam,
    },
    {
        id: 10,
        name: "Philip Grady",
        username: "Mayra86",
        password: "password10",
        email: "Adrianna69@yahoo.com",
        phone: "(691)45214606612",
        gender: false,
        born: new Date("Fri Jan 28 1977"),
        status: true,
        role: "Nhân viên",
        idDepartment: 1,
        avatar: IMGNam,
    },
    {
        id: 11,
        name: "Alex Morgan",
        username: "AlexM01",
        password: "securepassword1",
        email: "alex.morgan@example.com",
        phone: "12345678901",
        gender: true,
        born: new Date("1985-03-15"),
        status: true,
        role: "Nhân viên",
        idDepartment: 1,
        avatar: IMGNu,
    },
    {
        id: 12,
        name: "Taylor Swift",
        username: "TaylorS02",
        password: "securepassword2",
        email: "taylor.swift@example.com",
        phone: "23456789012",
        gender: true,
        born: new Date("1990-12-13"),
        status: true,
        role: "Nhân viên",
        idDepartment: 1,
        avatar: IMGNu,
    },
    {
        id: 13,
        name: "Jordan Fisher",
        username: "JordanF03",
        password: "securepassword3",
        email: "jordan.fisher@example.com",
        phone: "34567890123",
        gender: true,
        born: new Date("1988-07-22"),
        status: true,
        role: "Nhân viên",
        idDepartment: 1,
        avatar: IMGNu,
    },
    {
        id: 14,
        name: "Morgan Freeman",
        username: "MorganF04",
        password: "securepassword4",
        email: "morgan.freeman@example.com",
        phone: "45678901234",
        gender: true,
        born: new Date("1975-04-09"),
        status: true,
        role: "Nhân viên",
        idDepartment: 2,
        avatar: IMGNu,
    },
    {
        id: 15,
        name: "Sophia Turner",
        username: "SophiaT05",
        password: "securepassword5",
        email: "sophia.turner@example.com",
        phone: "56789012345",
        gender: true,
        born: new Date("1993-11-30"),
        status: true,
        role: "Nhân viên",
        idDepartment: 2,
        avatar: IMGNam,
    },
    {
        id: 16,
        name: "Emily Blunt",
        username: "EmilyB06",
        password: "securepassword6",
        email: "emily.blunt@example.com",
        phone: "67890123456",
        gender: false,
        born: new Date("1987-05-15"),
        status: true,
        role: "Nhân viên",
        idDepartment: 2,
        avatar: IMGNam,
    },
    {
        id: 17,
        name: "Chris Hemsworth",
        username: "ChrisH07",
        password: "securepassword7",
        email: "chris.hemsworth@example.com",
        phone: "78901234567",
        gender: true,
        born: new Date("1983-08-11"),
        status: true,
        role: "Nhân viên",
        idDepartment: 2,
        avatar: IMGNam,
    },
    {
        id: 18,
        name: "Jennifer Lawrence",
        username: "JenniferL08",
        password: "securepassword8",
        email: "jennifer.lawrence@example.com",
        phone: "89012345678",
        gender: false,
        born: new Date("1990-10-24"),
        status: true,
        role: "Nhân viên",
        idDepartment: 3,
        avatar: IMGNam,
    },
    {
        id: 19,
        name: "Ryan Reynolds",
        username: "RyanR09",
        password: "securepassword9",
        email: "ryan.reynolds@example.com",
        phone: "90123456789",
        gender: true,
        born: new Date("1976-10-23"),
        status: true,
        role: "Nhân viên",
        idDepartment: 3,
        avatar: IMGNam,
    },
    {
        id: 20,
        name: "Scarlett Johansson",
        username: "ScarlettJ10",
        password: "securepassword10",
        email: "scarlett.johansson@example.com",
        phone: "01234567890",
        gender: false,
        born: new Date("1984-11-22"),
        status: true,
        role: "Nhân viên",
        idDepartment: 3,
        avatar: IMGNam,
    },
    {
        id: 21,
        name: "Olivia Wilde",
        username: "OliviaW11",
        password: "securepassword11",
        email: "olivia.wilde@example.com",
        phone: "12345678910",
        gender: false,
        born: new Date("1984-03-10"),
        status: true,
        role: "Nhân viên",
        idDepartment: 3,
        avatar: IMGNu,
    },
    {
        id: 22,
        name: "Tom Hardy",
        username: "TomH12",
        password: "securepassword12",
        email: "tom.hardy@example.com",
        phone: "23456789101",
        gender: true,
        born: new Date("1977-09-15"),
        status: true,
        role: "Nhân viên",
        idDepartment: 4,
        avatar: IMGNu,
    },
    {
        id: 23,
        name: "Zendaya Maree",
        username: "ZendayaM13",
        password: "securepassword13",
        email: "zendaya.maree@example.com",
        phone: "34567890212",
        gender: false,
        born: new Date("1996-09-01"),
        status: true,
        role: "Nhân viên",
        idDepartment: 4,
        avatar: IMGNam,
    },
    {
        id: 24,
        name: "Michael B. Jordan",
        username: "MichaelJ14",
        password: "securepassword14",
        email: "michael.jordan@example.com",
        phone: "45678901323",
        gender: true,
        born: new Date("1987-02-09"),
        status: true,
        role: "Nhân viên",
        idDepartment: 4,
        avatar: IMGNam,
    },
    {
        id: 25,
        name: "Alicia Vikander",
        username: "AliciaV15",
        password: "securepassword15",
        email: "alicia.vikander@example.com",
        phone: "56789012434",
        gender: false,
        born: new Date("1988-10-03"),
        status: true,
        role: "Nhân viên",
        idDepartment: 4,
        avatar: IMGNam,
    },
    {
        id: 26,
        name: "Jason Momoa",
        username: "JasonM16",
        password: "securepassword16",
        email: "jason.momoa@example.com",
        phone: "67890123545",
        gender: true,
        born: new Date("1979-08-01"),
        status: true,
        role: "Nhân viên",
        idDepartment: 5,
        avatar: IMGNu,
    },
    {
        id: 27,
        name: "Emma Stone",
        username: "EmmaS17",
        password: "securepassword17",
        email: "emma.stone@example.com",
        phone: "78901234656",
        gender: false,
        born: new Date("1988-11-06"),
        status: true,
        role: "Nhân viên",
        idDepartment: 5,
        avatar: IMGNu,
    },
    {
        id: 28,
        name: "Henry Cavill",
        username: "HenryC18",
        password: "securepassword18",
        email: "henry.cavill@example.com",
        phone: "89012345767",
        gender: true,
        born: new Date("1983-05-05"),
        status: true,
        role: "Nhân viên",
        idDepartment: 5,
        avatar: IMGNam,
    },
    {
        id: 29,
        name: "Natalie Portman",
        username: "NatalieP19",
        password: "securepassword19",
        email: "natalie.portman@example.com",
        phone: "90123456878",
        gender: false,
        born: new Date("1981-06-09"),
        status: true,
        role: "Nhân viên",
        idDepartment: 5,
        avatar: IMGNam,
    },
    {
        id: 30,
        name: "Chris Pratt",
        username: "ChrisP20",
        password: "securepassword20",
        email: "chris.pratt@example.com",
        phone: "01234567989",
        gender: true,
        born: new Date("1979-06-21"),
        status: true,
        role: "Nhân viên",
        idDepartment: 6,
        avatar: IMGNam,
    },
    {
        id: 31,
        name: "Henry Cavill",
        username: "HenryC18",
        password: "securepassword18",
        email: "henry.cavill@example.com",
        phone: "89012345767",
        gender: true,
        born: new Date("1983-05-05"),
        status: true,
        role: "Nhân viên",
        idDepartment: 6,
        avatar: IMGNam,
    },
    {
        id: 32,
        name: "Natalie Portman",
        username: "NatalieP19",
        password: "securepassword19",
        email: "natalie.portman@example.com",
        phone: "90123456878",
        gender: false,
        born: new Date("1981-06-09"),
        status: true,
        role: "Nhân viên",
        idDepartment: 6,
        avatar: IMGNam,
    },
    {
        id: 33,
        name: "Chris Pratt",
        username: "ChrisP20",
        password: "securepassword20",
        email: "chris.pratt@example.com",
        phone: "01234567989",
        gender: true,
        born: new Date("1979-06-21"),
        status: true,
        role: "Nhân viên",
        idDepartment: 6,
        avatar: IMGNam,
    }
];

export const getEmployees = async (): Promise<Employee[]> => {
    return mockEmployees.filter((employee) => employee.status === true);
}

export const deleteEmployee = (id: number): Employee[] => {
    mockEmployees = mockEmployees.filter(employee => employee.id !== id);
    return mockEmployees;
};

export const updateEmployee = (id: number, updatedEmployee: Partial<Employee>): Employee[] => {
    mockEmployees = mockEmployees.map(emp =>
        emp.id === id
            ? { ...emp, ...updatedEmployee }
            : emp
    );
    return mockEmployees;
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

export const getSumEmployees = async (): Promise<number> => {
    return mockEmployees.length;
};
