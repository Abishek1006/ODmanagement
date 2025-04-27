import React, { useState } from 'react';
import api from '../services/api';

const SemesterReport = () => {
  const [semester, setSemester] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate semester before making API call
      const validSemesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
      if (!validSemesters.includes(semester)) {
        setError('Invalid semester selected');
        setLoading(false);
        return;
      }
      
      const response = await api.getStudentSemesterReport(semester);
      setReport(response.data.data);
    } catch (error) {
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };
  

  const handleDownloadPDF = async () => {
    try {
      const response = await api.downloadSemesterReportPDF(semester);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `semester_${semester}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleViewDetails = async (studentId) => {
    try {
      const response = await api.getStudentODDetails(studentId, semester);
      setStudentDetails(response.data.data);
      setSelectedStudent(studentId);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Semester OD Report</h2>
      
      <div className="mb-4 flex items-center">
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

        {report && report.length > 0 && (
          <button
            onClick={handleDownloadPDF}
            className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Download PDF
          </button>
        )}
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {report && report.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-orange-100">
                <th className="p-2">Roll No</th>
                <th className="p-2">Name</th>
                <th className="p-2">Department</th>
                <th className="p-2">Approved ODs</th>
                <th className="p-2">Total Hours</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {report.map((student) => (
                <tr key={student._id} className="border-t">
                  <td className="p-2">{student.rollNo}</td>
                  <td className="p-2">{student.studentName}</td>
                  <td className="p-2">{student.department}</td>
                  <td className="p-2">{student.approvedODs}</td>
                  <td className="p-2">{student.totalHours}</td>
                  <td className="p-2">
                    <button 
                      onClick={() => handleViewDetails(student._id)}
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
      ) : (        
        <div>No data found for selected semester</div>
      )}

{studentDetails && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-xl">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h3 className="text-2xl font-bold text-orange-600">Student OD Details</h3>
        <button 
          onClick={() => setStudentDetails(null)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {studentDetails.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Event Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentDetails.map(od => (
                <tr key={od._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{od.eventName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {new Date(od.dateFrom).toLocaleDateString()} 
                    </span>
                    {" to "}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {new Date(od.dateTo).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{od.startTime} - {od.endTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{od.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{od.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No OD details found for this student.</div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={() => setStudentDetails(null)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md transition-colors duration-200 flex items-center"
        >
          <span>Close</span>
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default SemesterReport;
