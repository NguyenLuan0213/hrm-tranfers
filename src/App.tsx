import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Employee from './modules/nhan-vien/EmployeesRouter';
import Departments from './modules/phong-ban/DeparmentsRouter';
import TransferRequest from './modules/dieu-huong-luan-chuyen/TransfersRequestRouter';
import { UserRoleProvider } from './hooks/UserRoleContext';

function App() {
  return (
    <UserRoleProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="employees/*" element={<Employee />} />
          <Route path="departments/*" element={<Departments />} />
          <Route path="transfers/*" element={<TransferRequest />} />
        </Route>
      </Routes>
    </UserRoleProvider>
  );
}

export default App;
