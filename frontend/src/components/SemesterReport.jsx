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
      const response = await api.getStudentSemesterReport(semester);
      console.log('Report data:', response.data);
      setReport(response.data.data);
    } catch (error) {
      console.error('Error generating report:', error);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-3xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">OD Details</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {studentDetails.map(od => (
                  <tr key={od._id}>
                    <td>{od.eventName}</td>
                    <td>{new Date(od.dateFrom).toLocaleDateString()} - {new Date(od.dateTo).toLocaleDateString()}</td>
                    <td>{od.startTime} - {od.endTime}</td>
                    <td>{od.location}</td>
                    <td>{od.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button 
              onClick={() => setStudentDetails(null)}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterReport;
