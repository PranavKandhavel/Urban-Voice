import { Navigate } from 'react-router-dom';
import MyComplaints from './MyComplaints';
import AdminComplaints from './AdminComplaints';

export default function Complaints() {
  const user = JSON.parse(localStorage.getItem("loggedInUser") || '{}');
  const role = user.role || 'citizen';

  if (role === 'authority') {
    return <AdminComplaints />;
  }
  return <MyComplaints />;
}

