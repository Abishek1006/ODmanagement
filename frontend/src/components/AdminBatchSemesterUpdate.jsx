import React, { useState } from 'react';
import api from '../services/api';

const AdminBatchSemesterUpdate = () => {
  const [fromSemester, setFromSemester] = useState('');
  const [toSemester, setToSemester] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setResult(null);

      try {
        console.log('Sending batch update request:', {
          fromSemester,
          toSemester,
          department: department || undefined
        });
      
        const response = await api.post('/admin/batch-update-semester', {
          fromSemester,
          toSemester,
          department: department || undefined
        });
      
        console.log('Batch update response:', response.data);
        setResult(response.data);
      } catch (err) {
        console.error('Error updating semesters:', err);
      
        // More detailed error handling
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(err.response.data?.message || `Server error: ${err.response.status}`);
          console.error('Error response data:', err.response.data);
        } else if (err.request) {
          // The request was made but no response was received
          setError('No response received from server. Please check your connection.');
          console.error('Error request:', err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Request error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Batch Semester Update</h2>
      <p className="text-gray-600">
        This tool allows you to update all students from one semester to another in a single operation.
        Use with caution as this will affect multiple student records.
      </p>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
      
      {result && (
        <div className="p-4 bg-green-100 text-green-700 rounded-md">
          <p className="font-semibold">Update Successful!</p>
          <p>Updated {result.count} student(s) from semester {fromSemester} to semester {toSemester}.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">From Semester</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={fromSemester}
              onChange={(e) => setFromSemester(e.target.value)}
              required
            >
              <option value="">Select Current Semester</option>
              {semesters.map(sem => (
                <option key={`from-${sem}`} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">To Semester</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={toSemester}
              onChange={(e) => setToSemester(e.target.value)}
              required
            >
              <option value="">Select Target Semester</option>
              {semesters.map(sem => (
                <option key={`to-${sem}`} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Department (Optional)</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Leave blank for all departments"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !fromSemester || !toSemester}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Processing...' : 'Update Semesters'}
          </button>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 text-yellow-700 rounded-md">
          <p className="font-semibold">⚠️ Warning</p>
          <p>This operation will update all students currently in semester {fromSemester || '[select]'} to semester {toSemester || '[select]'}.</p>
          {department && <p>Only students in the {department} department will be affected.</p>}
          <p className="mt-2">This action cannot be undone. Please verify your selection before proceeding.</p>
        </div>
      </form>

      {result && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Update Summary</h3>
          <div className="space-y-2">
            <p><span className="font-medium">From Semester:</span> {result.fromSemester}</p>
            <p><span className="font-medium">To Semester:</span> {result.toSemester}</p>
            {result.department && <p><span className="font-medium">Department:</span> {result.department}</p>}
            <p><span className="font-medium">Students Updated:</span> {result.count}</p>
            <p><span className="font-medium">Timestamp:</span> {new Date().toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBatchSemesterUpdate;
