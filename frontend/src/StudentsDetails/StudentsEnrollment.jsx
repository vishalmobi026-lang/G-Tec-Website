import React, { useState, useEffect } from "react";
import { 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  BookOpen, 
  ShieldAlert, 
  MapPin, 
  RotateCcw,
  FileSpreadsheet,
  Download
} from "lucide-react";
import * as XLSX from "xlsx"; // Import the Excel library

export default function StudentsEnrollment() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all students
  const fetchStudents = () => {
    fetch("http://localhost:5000/api/students/all")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching all students:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // RESTORE FUNCTION
  const handleRestore = async (id, name) => {
    const confirmRestore = window.confirm(`Are you sure you want to restore ${name} to the Active Students tab?`);
    if (!confirmRestore) return;

    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: false }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`${name} has been successfully restored!`);
        setStudents(students.map(student => 
          student._id === id ? { ...student, isArchived: false } : student
        ));
      } else {
        alert("Failed to restore student.");
      }
    } catch (err) {
      console.error("Restore Error:", err);
      alert("An error occurred while restoring.");
    }
  };

  // FORMAT DATA FOR EXCEL EXPORT (Including ALL Database fields)
  const formatDataForExcel = (dataToExport) => {
    return dataToExport.map(s => ({
      "Enrollment Date": s.enrollmentDate ? new Date(s.enrollmentDate).toLocaleDateString() : "N/A",
      "Name": s.name || "N/A",
      "Email": s.email || "N/A",
      "Phone": s.phone || "N/A",
      "DOB": s.dob || "N/A",
      "Course Category": s.courseCategory || "N/A",
      "Course": s.course || "N/A",
      "Education Type": s.educationType || "N/A",
      "Institution Name": s.institutionName || "N/A",
      "Class/Grade": s.classGrade || "N/A",
      "Department": s.department || "N/A",
      "Degree Level": s.degreeLevel || "N/A",
      "Education Status": s.educationStatus || "N/A",
      "Pass Out Year": s.passOutYear || "N/A",
      "Current Year": s.currentYear || "N/A",
      "Door Number": s.doorNumber || "N/A",
      "Village": s.village || "N/A",
      "Sub-District": s.subDistrict || "N/A",
      "District": s.district || "N/A",
      "State": s.state || "N/A",
      "Country": s.country?.name || s.country || "N/A",
      "Pincode": s.pincode || "N/A",
      "Tab Status": s.isArchived ? "Removed from Active" : "Active"
    }));
  };

  // EXPORT ALL STUDENTS TO EXCEL
  const handleExportAll = () => {
    if (students.length === 0) return alert("No data available to export.");
    const ws = XLSX.utils.json_to_sheet(formatDataForExcel(students));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Enrollments");
    XLSX.writeFile(wb, "GTEC_All_Students_Enrollment.xlsx");
  };

  // EXPORT ONLY TODAY'S STUDENTS TO EXCEL
  const handleExportToday = () => {
    const todayStr = new Date().toDateString();
    const todaysStudents = students.filter(s => 
      s.enrollmentDate && new Date(s.enrollmentDate).toDateString() === todayStr
    );
    
    if (todaysStudents.length === 0) {
      alert("No students have enrolled today.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(formatDataForExcel(todaysStudents));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Today Enrollments");
    XLSX.writeFile(wb, `GTEC_Daily_Enrollment_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
  };

  // HELPER: Format Address strictly based on backend Schema
  const renderAddress = (student) => {
    const parts = [
      student.doorNumber,
      student.village,
      student.subDistrict,
      student.district,
      student.state,
      student.pincode
    ].filter(Boolean); // This removes any empty, null, or undefined values
    
    if (parts.length === 0) return "Address not provided";
    return parts.join(", ");
  };

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <ShieldAlert size={14} /> Master Database
            </div>
            <h1 className="text-3xl font-black text-gray-900">Total Enrollment Log</h1>
            <p className="text-gray-500 mt-2 max-w-2xl">
              This is the master list of all enrolled students. Review all records, restore removed students, or export data for administrative use.
            </p>
          </div>

          {/* EXCEL EXPORT BUTTONS */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportToday}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-sm"
            >
              <FileSpreadsheet size={18} /> Daily Export
            </button>
            <button 
              onClick={handleExportAll}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-200"
            >
              <Download size={18} /> Export All
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search master records by name or email..."
            className="w-full outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Students List */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">Loading Master Records...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div key={student._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col">
                  
                  {student.isArchived ? (
                    <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
                      Removed from Active
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
                      Active
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-1 pr-24">{student.name}</h3>
                  
                  <div className="space-y-3 mt-6 flex-grow">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail size={16} className="text-blue-500 shrink-0" /> 
                      <span className="truncate">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone size={16} className="text-emerald-500 shrink-0" /> 
                      {student.phone}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <BookOpen size={16} className="text-purple-500 shrink-0" /> 
                      <span className="truncate">{student.course || 'No Course Assigned'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar size={16} className="text-orange-500 shrink-0" /> 
                      {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}
                    </div>

                    {/* FIXED: Address Field strictly based on Mongoose Schema */}
                    <div className="flex items-start gap-3 text-sm text-gray-600 pt-2 border-t border-gray-50">
                      <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" /> 
                      <span className="leading-relaxed">
                        {renderAddress(student)}
                      </span>
                    </div>
                  </div>

                  {student.isArchived && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleRestore(student._id, student.name)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-sm font-bold transition-all duration-300"
                      >
                        <RotateCcw size={16} /> Restore to Active
                      </button>
                    </div>
                  )}

                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
                No matching student records found.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}