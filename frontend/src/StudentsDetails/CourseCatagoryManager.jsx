import React, { useState, useEffect } from 'react';
import { Plus, List, Loader2, Trash2, Edit, Save, FolderPlus, AlignLeft, Link as LinkIcon, Type, ImageIcon } from 'lucide-react';

export default function CourseCatagoryManager() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  
  const [editingId, setEditingId] = useState(null);
  
  // ✅ Added explorerDescription to the initial state
  const [formData, setFormData] = useState({ 
    name: "", 
    description: "", 
    explorerDescription: "", // NEW FIELD
    headline: "", 
    image: "" 
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Failed to load categories");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg("");

    const generatedSlug = formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    try {
      const url = editingId ? `http://localhost:5000/api/categories/${editingId}` : "http://localhost:5000/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        // ✅ Included explorerDescription in the payload sent to backend
        body: JSON.stringify({
          name: formData.name,
          slug: generatedSlug,
          description: formData.description,
          explorerDescription: formData.explorerDescription, // NEW FIELD
          headline: formData.headline,
          image: formData.image
        })
      });

      const result = await res.json();

      if (result.success || res.ok) {
        setStatusMsg(`✅ Category ${editingId ? 'updated' : 'added'}!`);
        // Reset form
        setFormData({ name: "", description: "", explorerDescription: "", headline: "", image: "" }); 
        setEditingId(null);
        fetchCategories();
      } else {
        setStatusMsg("❌ " + (result.error || "Operation failed"));
      }
    } catch (err) {
      setStatusMsg("❌ Server Error.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleEditClick = (cat) => {
    setEditingId(cat._id);
    // ✅ Populate all fields when editing, including explorerDescription
    setFormData({ 
      name: cat.name || "", 
      description: cat.description || "",
      explorerDescription: cat.explorerDescription || "", // NEW FIELD
      headline: cat.headline || "",
      image: cat.image || ""
    });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}" category?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success || res.ok) {
        setCategories(categories.filter(cat => cat._id !== id));
      }
    } catch (err) {
      alert("Error deleting category.");
    }
  };

  const inputClass = "w-full border border-gray-200 bg-gray-50/50 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all";

  return (
    <div className="w-full font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COMPACT FORM (5 columns) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              {editingId ? <><Edit size={18} className="text-amber-500"/> Edit Category</> : <><Plus size={18} className="text-blue-500"/> Add Category</>}
            </h2>
            {editingId && (
              <button onClick={() => { setEditingId(null); setFormData({name: "", description: "", explorerDescription: "", headline: "", image: ""}); }} className="text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded">Cancel</button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><FolderPlus size={12}/> Category Name</label>
              <input type="text" required placeholder="e.g., IT / Technical" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputClass} />
              {formData.name && (
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                  <LinkIcon size={10} className="text-blue-400"/> /courses/{formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><Type size={12}/> Explorer Headline</label>
              <input type="text" required placeholder="e.g., Engineering the Digital Future" value={formData.headline} onChange={(e) => setFormData({...formData, headline: e.target.value})} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><ImageIcon size={12}/> Cover Image URL</label>
              <input type="text" required placeholder="https://images.unsplash.com/..." value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><AlignLeft size={12}/> Short Admin Description</label>
              <textarea required rows="2" placeholder="Brief summary for admin panel..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className={`${inputClass} resize-none`} />
            </div>

            {/* ✅ NEW: Explorer Long Description Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><AlignLeft size={12}/> Explorer Long Description</label>
              <textarea required rows="4" placeholder="Master Software Development, Web Technologies... (Displays in Course Explorer)" value={formData.explorerDescription} onChange={(e) => setFormData({...formData, explorerDescription: e.target.value})} className={`${inputClass} resize-none`} />
            </div>

            <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 text-sm ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16} /> {editingId ? "Update Category" : "Save Category"}</>}
            </button>

            {statusMsg && <p className={`text-xs font-medium text-center ${statusMsg.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{statusMsg}</p>}
          </form>
        </div>

        {/* RIGHT SLEEK LIST (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <List size={16} className="text-gray-400"/> Active Categories ({categories.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="col-span-2 flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-500 col-span-2 text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">No categories found.</p>
            ) : (
              categories.map(cat => (
                <div key={cat._id} className="bg-white p-3.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group relative pr-10 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                    <p className="text-[10px] font-bold text-blue-600 mt-0.5 line-clamp-1">{cat.headline || 'No Headline'}</p>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-[9px] font-mono bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded inline-block">/{cat.slug}</span>
                    {cat.image && <ImageIcon size={12} className="text-gray-300" />}
                  </div>
                  
                  <div className="absolute top-3 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(cat)} className="text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors p-1.5 rounded-lg border border-transparent hover:border-amber-100"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(cat._id, cat.name)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors p-1.5 rounded-lg border border-transparent hover:border-red-100"><Trash2 size={14} /></button>
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