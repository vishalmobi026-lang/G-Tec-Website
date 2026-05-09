import React, { useState, useEffect } from "react";
import { Plus, Trash2, Tag, FileText, Check, X, IndianRupee, Save, Star, Link as LinkIcon, Edit, Loader2, List, AlignLeft } from "lucide-react";

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "", description: "", priceOff: "", priceOn: "", features: [""], highlighted: false, linkedCategory: "", linkedCourseTitle: ""
  });

  const fetchData = async () => {
    try {
      const [offersRes, coursesRes] = await Promise.all([
        fetch("http://localhost:5000/api/offers"),
        fetch("http://localhost:5000/api/courses")
      ]);
      const offersData = await offersRes.json();
      const coursesData = await coursesRes.json();
      setOffers(offersData);
      setAllCourses(coursesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => setFormData({ ...formData, features: [...formData.features, ""] });
  const removeFeature = (index) => setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });

  const handleEditClick = (offer) => {
    setEditingId(offer._id);
    setFormData({
      name: offer.name,
      description: offer.description,
      priceOff: offer.priceOff,
      priceOn: offer.priceOn,
      features: offer.features,
      highlighted: offer.highlighted,
      linkedCategory: offer.linkedCategory || "",
      linkedCourseTitle: offer.linkedCourseTitle || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId ? `http://localhost:5000/api/offers/${editingId}` : "http://localhost:5000/api/offers";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setEditingId(null);
        setFormData({ name: "", description: "", priceOff: "", priceOn: "", features: [""], highlighted: false, linkedCategory: "", linkedCourseTitle: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    try {
      await fetch(`http://localhost:5000/api/offers/${id}`, { method: "DELETE" });
      setOffers(offers.filter((o) => o._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const inputClass = "w-full border border-gray-200 bg-gray-50/50 p-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all";

  return (
    <div className="w-full font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: FORM (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              {editingId ? <><Edit size={18} className="text-amber-500"/> Edit Offer</> : <><Tag size={18} className="text-blue-500"/> Create Offer</>}
            </h2>
            {editingId && (
              <button onClick={() => { setEditingId(null); setFormData({name: "", description: "", priceOff: "", priceOn: "", features: [""], highlighted: false, linkedCategory: "", linkedCourseTitle: ""}); }} className="text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded">Cancel</button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
               <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Offer Title</label>
                  <input name="name" type="text" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="Summer Special..." />
               </div>
               <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><IndianRupee size={10}/> Discount Price</label>
                  <input name="priceOn" type="number" required value={formData.priceOn} onChange={handleChange} className={inputClass} placeholder="999" />
               </div>
               <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><IndianRupee size={10}/> Original Price</label>
                  <input name="priceOff" type="number" required value={formData.priceOff} onChange={handleChange} className={inputClass} placeholder="1999" />
               </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><AlignLeft size={12}/> Short Description</label>
              <textarea name="description" rows="2" value={formData.description} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Briefly describe the deal..." />
            </div>

            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
               <label className="block text-xs font-bold text-blue-800 mb-2 flex items-center gap-1"><LinkIcon size={12}/> Linking (Optional)</label>
               <div className="grid grid-cols-2 gap-2">
                  <select name="linkedCategory" value={formData.linkedCategory} onChange={handleChange} className={inputClass}>
                    <option value="">No Category</option>
                    <option value="it-technical">IT Technical</option>
                    <option value="it-non-technical">IT Non-Technical</option>
                    <option value="designing">Designing</option>
                    <option value="accounting">Accounting</option>
                    <option value="civil">Civil</option>
                  </select>
                  <select name="linkedCourseTitle" value={formData.linkedCourseTitle} onChange={handleChange} className={inputClass}>
                    <option value="">No Course</option>
                    {allCourses.map(c => <option key={c._id} value={c.title}>{c.title}</option>)}
                  </select>
               </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 flex justify-between items-center">
                <span>Offer Features</span>
                <button type="button" onClick={addFeature} className="text-blue-600 hover:text-blue-700 font-bold text-[10px] uppercase">+ Add</button>
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {formData.features.map((feat, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={feat} onChange={(e) => handleFeatureChange(i, e.target.value)} className={inputClass} placeholder="Benefit..." />
                    <button type="button" onClick={() => removeFeature(i)} className="text-gray-400 hover:text-red-500"><X size={16}/></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
               <input type="checkbox" id="highlighted" name="highlighted" checked={formData.highlighted} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
               <label htmlFor="highlighted" className="text-xs font-bold text-gray-700 flex items-center gap-1 cursor-pointer"><Star size={12} className="text-amber-500 fill-amber-500"/> Feature this Offer</label>
            </div>

            <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 text-sm ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16} /> {editingId ? "Update Offer" : "Launch Offer"}</>}
            </button>
          </form>
        </div>

        {/* RIGHT: LIST (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <List size={16} className="text-gray-400"/> Live Offers ({offers.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[700px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="col-span-2 flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : offers.length === 0 ? (
              <p className="text-sm text-gray-500 col-span-2 text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">No active offers.</p>
            ) : (
              offers.map(offer => (
                <div key={offer._id} className="bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group relative pr-10">
                  {offer.highlighted && <div className="absolute -top-2 -left-2 bg-amber-400 text-white p-1 rounded-full shadow-sm z-10"><Star size={12} className="fill-white"/></div>}
                  
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">{offer.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black text-blue-600">₹{offer.priceOn}</span>
                        <span className="text-[10px] text-gray-400 line-through font-medium">₹{offer.priceOff}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-2 line-clamp-2">{offer.description}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-1">
                      {offer.linkedCategory && <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">{offer.linkedCategory.replace(/-/g, ' ')}</span>}
                      {offer.linkedCourseTitle && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded italic">Linked Course</span>}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(offer)} className="text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors p-1.5 rounded-lg border border-transparent hover:border-amber-100">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(offer._id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors p-1.5 rounded-lg border border-transparent hover:border-red-100">
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