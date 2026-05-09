import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, BookOpen, Layers, ImageIcon, FileText, Clock, Tag, AlignLeft, Edit, X, Award, Search } from "lucide-react";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all"); 
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "", category: "", shortDesc: "", fullDesc: "", duration: "", image: ""
  });

  const [tags, setTags] = useState([""]);
  const [syllabus, setSyllabus] = useState([""]);
  const [certifications, setCertifications] = useState([""]);
  const [dynamicCategories, setDynamicCategories] = useState([]);

  const API_BASE = "http://localhost:5000/api";

  const fetchCourses = () => {
    fetch(`${API_BASE}/courses`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  };

  useEffect(() => { 
    fetchCourses(); 
    fetch(`${API_BASE}/categories`)
      .then(res => res.json())
      .then(data => setDynamicCategories(data))
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  const handleArrayChange = (index, value, setter, array) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
  };
  const addArrayItem = (setter, array) => setter([...array, ""]);
  const removeArrayItem = (index, setter, array) => setter(array.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API_BASE}/courses/${editingId}` : `${API_BASE}/courses`;
    const method = editingId ? "PUT" : "POST";

    const payload = {
      ...formData,
      tags: tags.filter(t => t.trim() !== ""),
      syllabus: syllabus.filter(s => s.trim() !== ""),
      certifications: certifications.filter(c => c.trim() !== "")
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEditingId(null);
        setFormData({ title: "", category: "", shortDesc: "", fullDesc: "", duration: "", image: "" });
        setTags([""]); setSyllabus([""]); setCertifications([""]);
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (course) => {
    setEditingId(course._id);
    setFormData({
      title: course.title, category: course.category || course.categorySlug, 
      shortDesc: course.shortDesc || "", fullDesc: course.fullDesc || "", 
      duration: course.duration || "", image: course.image || ""
    });
    setTags(course.tags?.length ? course.tags : [""]);
    setSyllabus(course.syllabus?.length ? course.syllabus : [""]);
    setCertifications(course.certifications?.length ? course.certifications : [""]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`${API_BASE}/courses/${id}`, { method: "DELETE" });
      if (res.ok) setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCourses = activeFilter === "all" ? courses : courses.filter(c => (c.category || c.categorySlug) === activeFilter);

  // Reusable compact input class
  const inputClass = "w-full border border-gray-200 bg-gray-50/50 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all";

  return (
    <div className="w-full font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COMPACT FORM (Takes up 5 columns out of 12) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              {editingId ? <><Edit size={18} className="text-amber-500"/> Edit Course</> : <><Plus size={18} className="text-blue-500"/> Add New Course</>}
            </h2>
            {editingId && (
              <button onClick={() => { setEditingId(null); setFormData({title:"", category:"", shortDesc:"", fullDesc:"", duration:"", image:""}); }} className="text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded">Cancel</button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 2-Column Grid for basics */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><BookOpen size={12}/> Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="Course Title" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><Layers size={12}/> Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputClass}>
                  <option value="" disabled>Select...</option>
                  {dynamicCategories.map(cat => <option key={cat._id} value={cat.slug}>{cat.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><Clock size={12}/> Duration</label>
                <input type="text" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className={inputClass} placeholder="e.g. 3 Months" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><ImageIcon size={12}/> Image URL</label>
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className={inputClass} placeholder="https://..." />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><AlignLeft size={12}/> Short Description</label>
              <input type="text" required value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} className={inputClass} placeholder="Brief summary..." />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><FileText size={12}/> Full Description</label>
              <textarea rows="2" value={formData.fullDesc} onChange={e => setFormData({...formData, fullDesc: e.target.value})} className={`${inputClass} resize-none`} placeholder="Detailed overview..."></textarea>
            </div>

            {/* Dynamic Arrays in Compact Grid */}
            <div className="grid grid-cols-1 gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              
              {/* Syllabus */}
              <div>
                <label className="text-xs font-bold text-gray-700 flex justify-between items-center mb-1">
                  <span className="flex items-center gap-1"><BookOpen size={12}/> Syllabus</span>
                  <button type="button" onClick={() => addArrayItem(setSyllabus, syllabus)} className="text-blue-500 hover:text-blue-700"><Plus size={14}/></button>
                </label>
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {syllabus.map((item, i) => (
                    <div key={i} className="flex gap-1">
                      <input type="text" value={item} onChange={e => handleArrayChange(i, e.target.value, setSyllabus, syllabus)} className="flex-1 border border-gray-200 bg-white p-1 text-xs rounded focus:outline-none" placeholder={`Topic ${i+1}`} />
                      <button type="button" onClick={() => removeArrayItem(i, setSyllabus, syllabus)} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid for Tags & Certifications */}
              <div className="grid grid-cols-2 gap-3">
                {/* Tags */}
                <div>
                  <label className="text-xs font-bold text-gray-700 flex justify-between items-center mb-1">
                    <span className="flex items-center gap-1"><Tag size={12}/> Tags</span>
                    <button type="button" onClick={() => addArrayItem(setTags, tags)} className="text-blue-500 hover:text-blue-700"><Plus size={14}/></button>
                  </label>
                  <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                    {tags.map((item, i) => (
                      <div key={i} className="flex gap-1">
                        <input type="text" value={item} onChange={e => handleArrayChange(i, e.target.value, setTags, tags)} className="flex-1 border border-gray-200 bg-white p-1 text-xs rounded focus:outline-none" placeholder="e.g. Bestseller" />
                        <button type="button" onClick={() => removeArrayItem(i, setTags, tags)} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label className="text-xs font-bold text-gray-700 flex justify-between items-center mb-1">
                    <span className="flex items-center gap-1"><Award size={12}/> Certs</span>
                    <button type="button" onClick={() => addArrayItem(setCertifications, certifications)} className="text-blue-500 hover:text-blue-700"><Plus size={14}/></button>
                  </label>
                  <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                    {certifications.map((item, i) => (
                      <div key={i} className="flex gap-1">
                        <input type="text" value={item} onChange={e => handleArrayChange(i, e.target.value, setCertifications, certifications)} className="flex-1 border border-gray-200 bg-white p-1 text-xs rounded focus:outline-none" placeholder="e.g. ISO 9001" />
                        <button type="button" onClick={() => removeArrayItem(i, setCertifications, certifications)} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <button type="submit" className={`w-full text-white font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 text-sm ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              <Save size={16} /> {editingId ? "Update Course" : "Save Course"}
            </button>
          </form>
        </div>

        {/* RIGHT SLEEK LIST (Takes up 7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Header & Filter Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Search size={16} className="text-gray-400"/> Course Inventory ({courses.length})
            </h2>
            <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-5 sm:pb-1 scrollbar-hide">
              <button onClick={() => setActiveFilter("all")} className={`px-3 py-3 text-xs font-bold rounded-md whitespace-nowrap transition-colors ${activeFilter === "all" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All</button>
              {dynamicCategories.map(cat => (
                <button key={cat._id} onClick={() => setActiveFilter(cat.slug)} className={`px-3 py-1 text-xs font-bold rounded-md whitespace-nowrap transition-colors ${activeFilter === cat.slug ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredCourses.length === 0 ? (
              <p className="text-sm text-gray-500 col-span-2 text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">No courses found in this category.</p>
            ) : (
              filteredCourses.map(course => (
                <div key={course._id} className="bg-white p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group relative pr-10 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase mb-1.5 inline-block">
                      {(course.category || course.categorySlug || "UNCATEGORIZED").replace('-', ' ')}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{course.title}</h3>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{course.shortDesc}</p>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
                      <Clock size={10}/> {course.duration}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {course.syllabus?.length || 0} Topics
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(course)} className="text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors p-1.5 rounded-lg border border-transparent hover:border-amber-100">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(course._id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors p-1.5 rounded-lg border border-transparent hover:border-red-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}