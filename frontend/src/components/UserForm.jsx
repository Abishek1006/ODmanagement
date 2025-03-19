import React from 'react';

const UserForm = ({
  formData,
  tutors,
  acs,
  hods,
  onChange,
  onSubmit,
  isEditing,
  loading,
  onCancel
}) => {
  const isStudent = formData.primaryRole === 'student';
  const isTeacher = ['teacher', 'tutor', 'ac', 'hod'].includes(formData.primaryRole);

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-semibold text-gray-700">
        {isEditing ? "Update User" : "Create New User"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={onChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={onChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password {isEditing && "(Leave blank to keep current)"}
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            type="password"
            name="password"
            value={formData.password || ''}
            onChange={onChange}
            required={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Primary Role</label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            name="primaryRole"
            value={formData.primaryRole || 'student'}
            onChange={onChange}
            required
          >
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
            name="department"
            value={formData.department || ''}
            onChange={onChange}
            required
          />
        </div>

        {isStudent && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                type="text"
                name="rollNo"
                value={formData.rollNo || ''}
                onChange={onChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                name="semester"
                value={formData.semester || ''}
                onChange={onChange}
                required
              >
                <option value="">Select Semester</option>
                {['1', '2', '3', '4', '5', '6', '7', '8'].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isLeader"
                  className="mr-2 h-4 w-4"
                  checked={formData.isLeader || false}
                  onChange={onChange}
                />
                <span className="text-sm font-medium text-gray-700">Class Leader</span>
              </label>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tutor</label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                name="tutorId"
                value={formData.tutorId || ''}
                onChange={onChange}
              >
                <option value="">Select Tutor</option>
                {tutors.map(tutor => (
                  <option key={tutor._id} value={tutor._id}>
                    {tutor.name} ({tutor.department})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Academic Coordinator</label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                name="acId"
                value={formData.acId || ''}
                onChange={onChange}
              >
                <option value="">Select AC</option>
                {acs.map(ac => (
                  <option key={ac._id} value={ac._id}>
                    {ac.name} ({ac.department})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">HOD</label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                name="hodId"
                value={formData.hodId || ''}
                onChange={onChange}
              >
                <option value="">Select HOD</option>
                {hods.map(hod => (
                  <option key={hod._id} value={hod._id}>
                    {hod.name} ({hod.department})
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {isTeacher && (
          <>
          <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Staff ID</label>
      <input
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        type="text"
        name="staffId"
        value={formData.staffId || ''}
        onChange={onChange}
        required
      />
    </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Secondary Roles</label>
              <select
                multiple
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                name="secondaryRoles"
                value={formData.secondaryRoles || []}
                onChange={onChange}
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

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Processing...' : isEditing ? 'Update User' : 'Create User'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default React.memo(UserForm);