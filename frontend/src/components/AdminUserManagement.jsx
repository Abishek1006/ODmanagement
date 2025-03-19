import React, { useState, useEffect } from 'react';
import api from '../services/api';
import UserForm from './UserForm';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    primaryRole: 'student',
    secondaryRoles: [],
    department: '',
    staffId: '',
    rollNo: '',
    semester: '',
    isLeader: false,
    tutorId: '',
    acId: '',
    hodId: ''
  });
  const [tutors, setTutors] = useState([]);
  const [acs, setAcs] = useState([]);
  const [hods, setHods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchMentors();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const [tutorRes, acRes, hodRes] = await Promise.all([
        api.get('/admin/users?role=tutor'),
        api.get('/admin/users?role=ac'),
        api.get('/admin/users?role=hod')
      ]);
      setTutors(tutorRes.data || []);
      setAcs(acRes.data || []);
      setHods(hodRes.data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updateFunc = editingUser ? setEditingUser : setNewUser;
    updateFunc(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked :
              name === 'secondaryRoles' ? Array.from(e.target.selectedOptions, option => option.value) :
              value
    }));
  };
    const handleCreateUser = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        // Create a new object instead of modifying the existing one
        const userData = { ...newUser };
  
        // Handle role-specific fields
        if (userData.primaryRole === 'student') {
          // For students, include student-specific fields and remove staff fields
          userData.semester = userData.semester;
          userData.rollNo = userData.rollNo;
          userData.isLeader = userData.isLeader || false;
          delete userData.staffId; // IMPORTANT: Remove staffId completely
          delete userData.secondaryRoles; // Students don't have secondary roles
        } else {
          // For non-students, include staff-specific fields and remove student fields
          userData.staffId = userData.staffId;
          delete userData.rollNo; // Remove student-specific fields
          delete userData.semester;
          userData.isLeader = false;
        }

        // Include mentor references if provided
        if (!userData.tutorId) delete userData.tutorId;
        if (!userData.acId) delete userData.acId;
        if (!userData.hodId) delete userData.hodId;

        await api.post('/admin/users', userData);
        await fetchUsers();
        setSuccess('User created successfully!');
        setNewUser({
          name: '',
          email: '',
          password: '',
          primaryRole: 'student',
          secondaryRoles: [],
          department: '',
          staffId: '',
          rollNo: '',
          semester: '',
          isLeader: false,
          tutorId: '',
          acId: '',
          hodId: ''
        });
      } catch (error) {
        setError('Failed to create user: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };
    const handleUpdateUser = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        // Create a new object instead of modifying the existing one
        const userData = { ...editingUser };
      
        // Handle role-specific fields
        if (userData.primaryRole === 'student') {
          // For students, include student-specific fields and remove staff fields
          userData.semester = userData.semester;
          userData.rollNo = userData.rollNo;
          userData.isLeader = userData.isLeader || false;
          delete userData.staffId; // IMPORTANT: Remove staffId completely
        } else {
          // For non-students, include staff-specific fields and remove student fields
          userData.staffId = userData.staffId;
          delete userData.rollNo; // Remove student-specific fields
          delete userData.semester;
          userData.isLeader = false;
        }

        // Remove password if not provided
        if (!userData.password) delete userData.password;
      
        // Include mentor references if provided
        if (!userData.tutorId) delete userData.tutorId;
        if (!userData.acId) delete userData.acId;
        if (!userData.hodId) delete userData.hodId;

        await api.put(`/admin/users/${editingUser._id}`, userData);
        setEditingUser(null);
        await fetchUsers();
        setSuccess('User updated successfully!');
      } catch (error) {
        setError('Failed to update user: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        await api.delete(`/admin/users/${userId}`);
        await fetchUsers();
        setSuccess('User deleted successfully!');
      } catch (error) {
        setError('Failed to delete user: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      {success && <div className="p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}

      <UserForm
        formData={editingUser || newUser}
        tutors={tutors}
        acs={acs}
        hods={hods}
        onChange={handleInputChange}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        isEditing={!!editingUser}
        loading={loading}
        onCancel={() => setEditingUser(null)}
      />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Users</h3>
        
        {loading && <p className="text-gray-500">Loading users...</p>}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.primaryRole}
                      </span>
                      {user.secondaryRoles?.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {user.secondaryRoles.map(role => (
                            <span key={role} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                              {role}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.primaryRole === 'student' ? user.rollNo : user.staffId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setEditingUser({ ...user, password: '' })}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;