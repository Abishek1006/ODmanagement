import React, { useState, useEffect } from 'react';
import api from '../services/api';

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
    isLeader: false,
    tutorId: '',
    acId: '',
    hodId: ''
  });

  // Update the input handlers to use proper state updates
  const handleInputChange = (field, value) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', newUser);
      fetchUsers();
      setNewUser({
        name: '',
        email: '',
        password: '',
        primaryRole: 'student',
        secondaryRoles: [],
        department: '',
        staffId: '',
        rollNo: '',
        isLeader: false,
        tutorId: '',
        acId: '',
        hodId: ''
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${editingUser._id}`, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers(); // Refresh the users list after deletion
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };
  

  const UserForm = ({ user, setUser, onSubmit, formTitle }) => {
    const isStudent = user.primaryRole === 'student';
    const isTeacher = ['teacher', 'tutor', 'ac', 'hod'].includes(user.primaryRole);

    return (
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">{formTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Common Fields with Labels */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              type="text"
              required
              value={user.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              type="email"
              required
              value={user.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              type="text"
              required
              value={user.password || ''}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Primary Role</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={user.primaryRole}
              required
              onChange={(e) => handleInputChange('primaryRole', e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="tutor">Tutor</option>
              <option value="ac">Academic Coordinator</option>
              <option value="hod">HOD</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              type="text"
              required
              value={user.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
            />
          </div>

          {/* Student-specific fields */}
          {isStudent && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                type="text"
                required
                value={user.rollNo}
                onChange={(e) => handleInputChange('rollNo', e.target.value)}
              />
            </div>
          )}

          {/* Teacher-specific fields */}
          {isTeacher && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Staff ID</label>
                <input
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  type="text"
                  required
                  value={user.staffId}
                  onChange={(e) => handleInputChange('staffId', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Secondary Roles (Hold Ctrl/Cmd to select multiple)</label>
                <select
                  multiple
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={user.secondaryRoles}
                  onChange={(e) => handleInputChange('secondaryRoles', Array.from(e.target.selectedOptions, option => option.value))}
                >
                  <option value="teacher">Teacher</option>
                  <option value="tutor">Tutor</option>
                  <option value="ac">Academic Coordinator</option>
                  <option value="hod">HOD</option>
                </select>
              </div>
            </>
          )}
        </div>
        <button 
          type="submit"
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {formTitle}
        </button>
      </form>
    );
  };  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
      
      {editingUser ? (
        <UserForm 
          user={editingUser} 
          setUser={setEditingUser} 
          onSubmit={handleUpdateUser}
          formTitle="Update User"
        />
      ) : (
        <UserForm 
          user={newUser} 
          setUser={setNewUser} 
          onSubmit={handleCreateUser}
          formTitle="Create New User"
        />
      )}
  
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.primaryRole}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setEditingUser(user)}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
