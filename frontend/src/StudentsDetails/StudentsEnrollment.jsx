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
  Download,
  FileText,
  Plus,
  Minus,
  X,
  Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";

const API_BASE_URL = import.meta.env.VITE_API_URI;

export default function StudentsEnrollment() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Notes Modal State
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/students/all`)
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
      const res = await fetch(`${API_BASE_URL}/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: false }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`${name} has been successfully restored!`);
        // Update local state to reflect change
        setStudents(students.map(student => 
          student._id === id ? { ...student, isArchived: false } : student
        ));
      }
    } catch (err) {
      console.error("Restore Error:", err);
    }
  };

  // ✅ NOTES HANDLERS
  const handleOpenNoteModal = (student) => {
    setEditingStudent({ ...student, notes: student.notes || [] });
    setIsNoteModalOpen(true);
  };

  const handleAddNoteField = () => {
    setEditingStudent(prev => ({
      ...prev,
      notes: [...(prev.notes || []), ""]
    }));
  };

  const handleNoteChange = (index, value) => {
    const updatedNotes = [...editingStudent.notes];
    updatedNotes[index] = value;
    setEditingStudent(prev => ({ ...prev, notes: updatedNotes }));
  };

  const handleRemoveNoteField = (index) => {
    const updatedNotes = editingStudent.notes.filter((_, i) => i !== index);
    setEditingStudent(prev => ({ ...prev, notes: updatedNotes }));
  };

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    try {
      const cleanNotes = editingStudent.notes.filter(n => n.trim() !== "");
      
      const res = await fetch(`${API_BASE_URL}/api/students/${editingStudent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: cleanNotes }),
      });

      if (res.ok) {
        setIsNoteModalOpen(false);
        fetchStudents(); // Refresh list to show updated notes
      }
    } catch (err) {
      console.error("Save Notes Error:", err);
    }
  };

  // FORMAT DATA FOR EXCEL EXPORT
  const formatDataForExcel = (dataToExport) => {
    return dataToExport.map(s => ({
      "Enrollment Date": s.enrollmentDate ? new Date(s.enrollmentDate).toLocaleDateString() : "N/A",
      "Name": s.name || "N/A",
      "Email": s.email || "N/A",
      "Phone": s.phone || "N/A",
      "Course": s.course || "N/A",
      "Education Status": s.educationStatus || "N/A",
      "Full Address": `${s.village || ''}, ${s.district || ''}, ${s.state || ''}`,
      "Notes": Array.isArray(s.notes) ? s.notes.join(" | ") : "No Notes", // ✅ Added Notes to Excel
      "Tab Status": s.isArchived ? "Archived" : "Active"
    }));
  };

  const handleExportAll = () => {
    if (students.length === 0) return alert("No data available to export.");
    const ws = XLSX.utils.json_to_sheet(formatDataForExcel(students));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Master Log");
    XLSX.writeFile(wb, "GTEC_Master_Database.xlsx");
  };

  const renderAddress = (student) => {
    const parts = [student.doorNumber, student.village, student.subDistrict, student.district, student.state, student.pincode].filter(Boolean);
    return parts.length === 0 ? "Address not provided" : parts.join(", ");
  };

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <ShieldAlert size={14} /> Master Database
            </div>
            <h1 className="text-3xl font-black text-gray-900">Total Enrollment Log</h1>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleExportAll} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200">
              <Download size={18} /> Export Master Excel
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search by name or phone..."
            className="w-full outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading master records...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div key={student._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative flex flex-col">
                
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-2 py-1 rounded text-[10px] font-bold uppercase ${student.isArchived ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {student.isArchived ? 'Archived' : 'Active'}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">{student.name}</h3>
                
                <div className="space-y-3 flex-grow">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={16} className="text-emerald-500 shrink-0" /> {student.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <BookOpen size={16} className="text-purple-500 shrink-0" /> {student.course}
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" /> 
                    <span className="line-clamp-2">{renderAddress(student)}</span>
                  </div>

                  {/* ✅ PREVIEW NOTES SECTION */}
                  {student.notes && student.notes.length > 0 && (
                    <div className="mt-4 p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                       <p className="text-[10px] font-bold text-amber-600 uppercase mb-1 flex items-center gap-1">
                         <FileText size={12}/> Latest Note
                       </p>
                       <p className="text-xs text-gray-700 italic">"{student.notes[student.notes.length - 1]}"</p>
                       {student.notes.length > 1 && (
                         <p className="text-[10px] text-amber-500 mt-1">+{student.notes.length - 1} more notes</p>
                       )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
                  <button
                    onClick={() => handleOpenNoteModal(student)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 hover:bg-amber-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                  >
                    <FileText size={14} /> Manage Notes
                  </button>

                  {student.isArchived && (
                    <button
                      onClick={() => handleRestore(student._id, student.name)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all"
                    >
                      <RotateCcw size={14} /> Restore to Active
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ DYNAMIC NOTES MODAL */}
      <AnimatePresence>
        {isNoteModalOpen && editingStudent && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="font-bold text-gray-900">Notes for {editingStudent.name}</h3>
                  <p className="text-xs text-gray-500 italic">Internal administrative notes</p>
                </div>
                <button onClick={() => setIsNoteModalOpen(false)} className="text-gray-400 hover:text-red-500">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveNotes} className="p-6">
                <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {editingStudent.notes.map((note, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <textarea
                        value={note}
                        onChange={(e) => handleNoteChange(index, e.target.value)}
                        placeholder="Write a note..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none min-h-[80px]"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveNoteField(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                    </div>
                  ))}

                  {editingStudent.notes.length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-sm italic">
                      No notes found. Click the button below to add one.
                    </div>
                  )}
                </div>

                <button 
                  type="button" 
                  onClick={handleAddNoteField}
                  className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline"
                >
                  <Plus size={16} /> Add New Note
                </button>

                <div className="mt-8">
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200"
                  >
                    <Save size={18} /> Save All Notes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}