import React, { useState } from 'react';
import api from '../services/api';

const SemesterReport = () => {
  const [semester, setSemester] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const response = await api.getStudentSemesterReport(semester);
      setReport(response.data.data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Semester OD Report</h2>
      
      <div className="mb-4">
        <select 
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Semester</option>
          {['1', '2', '3', '4', '5', '6', '7', '8'].map(sem => (
            <option key={sem} value={sem}>Semester {sem}</option>
          ))}
        </select>
        
        <button
          onClick={handleGenerateReport}
          disabled={!semester || loading}
          className="ml-4 bg-orange-500 text-white px-4 py-2 rounded"
        >
          Generate Report
        </button>
      </div>

      {loading && <div>Loading...</div>}

      {report && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-orange-100">
                <th className="p-2">Roll No</th>
                <th className="p-2">Name</th>
                <th className="p-2">Total ODs</th>
                <th className="p-2">Approved</th>
                <th className="p-2">Rejected</th>
                <th className="p-2">Pending</th>
                <th className="p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {report.map((student) => (
                <tr key={student._id} className="border-t">
                  <td className="p-2">{student.rollNo}</td>
                  <td className="p-2">{student.studentName}</td>
                  <td className="p-2">{student.totalODs}</td>
                  <td className="p-2">{student.approvedODs}</td>
                  <td className="p-2">{student.rejectedODs}</td>
                  <td className="p-2">{student.pendingODs}</td>
                  <td className="p-2">
                    <button 
                      onClick={() => setExpandedStudent(student._id)}
                      className="text-blue-500 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SemesterReport;
