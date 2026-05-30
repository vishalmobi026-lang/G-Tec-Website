import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Phone,
  Calendar,
  User,
  Edit,
  Trash2,
  X,
  Save,
  BookOpen,
  GraduationCap,
  Plus,
  Minus,
  FileText
} from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_URI;

export default function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [allCourses, setAllCourses] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchData = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URI;

      const [studentsRes, coursesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/students`),
        fetch(`${API_BASE_URL}/api/courses`), 
      ]);

      const studentsData = await studentsRes.json();
      const coursesData = await coursesRes.json();

      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setAllCourses(Array.isArray(coursesData) ? coursesData : []);

    } catch (err) {
      console.error("Fetch Error:", err);
      setStudents([]); 
      setAllCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this student record?",
      )
    )
      return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { _id, ...dataToUpdate } = editingStudent;
      
      // Clean up empty notes before saving
      if (dataToUpdate.notes) {
        dataToUpdate.notes = dataToUpdate.notes.filter(note => note.trim() !== "");
      }

      const response = await fetch(`${API_BASE_URL}/api/students/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate) 
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        fetchData(); 
      } else {
        const errorData = await response.json();
        console.error("Backend Error:", errorData);
        alert("Failed to update student: " + (errorData.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Network Error:", err);
    }
  };

  // ✅ Notes Feature Handlers
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

  const safeStudents = Array.isArray(students) ? students : [];

  const filteredStudents = safeStudents.filter((student) =>
    student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student?.phone?.includes(searchTerm)
  );

  const categories = [...new Set(allCourses.map((c) => c.category))];

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-50 pb-60 font-sans">
      <div className="max-w-[1400px] mx-auto">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <User className="text-blue-600" size={32} /> Enrolled Students
            </h1>
            <p className="text-gray-500 mt-1">Manage enrollments and student records.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* The Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Full Address</th>
                  <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="5" className="p-10 text-center text-gray-500">Loading...</td></tr>
                ) : (
                  filteredStudents.map((student) => (
                    <motion.tr key={student._id} layout className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-5">
                        <div className="text-xs font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded w-fit">
                          {new Date(student.enrollmentDate).toLocaleDateString("en-GB")}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-gray-900">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.phone}</div>
                        {student.email && <div className="text-xs text-gray-500 truncate max-w-[150px]">{student.email}</div>}
                      </td>
                      <td className="p-5">
                        <div className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">{student.courseCategory}</div>
                        <div className="text-sm font-semibold text-gray-800">{student.course}</div>
                      </td>
                      <td className="p-5 text-sm text-gray-600">
                         <div className="flex items-start gap-1 font-medium text-gray-800 text-xs">
                            <MapPin size={14} className="text-red-500 mt-0.5" />
                            <span>{student.village}, {student.district}</span>
                         </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => { 
                              // Initialize notes array if it doesn't exist
                              setEditingStudent({ ...student, notes: student.notes || [] }); 
                              setIsEditModalOpen(true); 
                            }} 
                            className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(student._id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ ADVANCED EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && editingStudent && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 shrink-0">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit className="text-amber-500" /> Edit Student Record
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-red-500">
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form
                onSubmit={handleUpdate}
                className="p-6 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
                {/* 1. PERSONAL DETAILS */}
                <div>
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                    <User size={16} /> Personal Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Full Name</label>
                      <input
                        type="text"
                        value={editingStudent.name || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Phone Number</label>
                      <input
                        type="text"
                        value={editingStudent.phone || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Email Address</label>
                      <input
                        type="email"
                        value={editingStudent.email || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Date of Birth</label>
                      <input
                        type="date"
                        value={editingStudent.dob || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, dob: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. COURSE DETAILS */}
                <div>
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                    <BookOpen size={16} /> Course Selection
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Course Category</label>
                      <select
                        value={editingStudent.courseCategory || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, courseCategory: e.target.value, course: "" })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 uppercase">
                        <option value="">Select Category...</option>
                        {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Specific Course</label>
                      <select
                        value={editingStudent.course || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                        disabled={!editingStudent.courseCategory}>
                        <option value="">Select Course...</option>
                        {allCourses
                          .filter((c) => c.category === editingStudent.courseCategory)
                          .map((c) => <option key={c._id} value={c.title}>{c.title}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. ADDRESS DETAILS */}
                <div>
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                    <MapPin size={16} /> Address Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Door No. / Street</label>
                      <input
                        type="text"
                        value={editingStudent.doorNumber || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, doorNumber: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Village / Area</label>
                      <input
                        type="text"
                        value={editingStudent.village || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, village: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Pincode</label>
                      <input
                        type="text"
                        value={editingStudent.pincode || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, pincode: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 font-mono tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">State</label>
                      <input
                        type="text"
                        value={editingStudent.state || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, state: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">District</label>
                      <input
                        type="text"
                        value={editingStudent.district || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, district: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Taluk / Sub-District</label>
                      <input
                        type="text"
                        value={editingStudent.subDistrict || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, subDistrict: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. EDUCATIONAL DETAILS (Fixed mapping bug) */}
                <div>
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                    <GraduationCap size={16} /> Educational Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Institution Name</label>
                      <input
                        type="text"
                        value={editingStudent.institutionName || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, institutionName: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Education Type</label>
                      <select
                        value={editingStudent.educationType || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, educationType: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500">
                        <option value="">Select...</option>
                        <option value="school">School</option>
                        <option value="college">College</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Department / Major</label>
                      <input
                        type="text"
                        value={editingStudent.department || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, department: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Current Status</label>
                      <select
                        value={editingStudent.educationStatus || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, educationStatus: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500">
                        <option value="">Select...</option>
                        {/* Fixed Case Mapping to match Database accurately */}
                        <option value="Pursuing">Pursuing</option>
                        <option value="Passed Out">Passed Out</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">Pass Out Year</label>
                      <input
                        type="text"
                        value={editingStudent.passOutYear || ""}
                        onChange={(e) => setEditingStudent({ ...editingStudent, passOutYear: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. ✅ NEW: DYNAMIC NOTES FEATURE */}
                <div>
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                      <FileText size={16} /> Admin Notes
                    </h4>
                    <button 
                      type="button" 
                      onClick={handleAddNoteField}
                      className="text-xs flex items-center gap-1 font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                    >
                      <Plus size={14}/> Add Note
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {editingStudent.notes && editingStudent.notes.length > 0 ? (
                      editingStudent.notes.map((note, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <textarea
                            value={note}
                            onChange={(e) => handleNoteChange(index, e.target.value)}
                            placeholder="Type a note about the student..."
                            rows="2"
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-y"
                          />
                          <button 
                            type="button"
                            onClick={() => handleRemoveNoteField(index)}
                            className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors mt-1"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">No notes added yet. Click 'Add Note' to start.</p>
                    )}
                  </div>
                </div>

                {/* Footer Save Button */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20">
                    <Save size={20} /> Update Student Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}