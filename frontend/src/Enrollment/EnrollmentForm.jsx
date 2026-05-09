import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useLottie } from "lottie-react";
import studentAnimation from "../assets/Student.json";
import { MapPin, Phone, Hash, Globe, ChevronRight, User, Calendar, GraduationCap, BookOpen, Building2, LibraryBig, Mail } from "lucide-react"; // <-- Added Mail
import successAnimation from "../assets/Success.json"; 
import errorAnimation from "../assets/error.json";

const PopupAnimation = ({ type }) => {
  const { View } = useLottie({
    // It dynamically picks the right JSON based on the modal state
    animationData: type === "success" ? successAnimation : errorAnimation,
    loop: false,
    autoplay: true, // Forces it to play the second it appears
  });
  
  return <>{View}</>;
};

export default function EnrollmentForm() {
  const [modalState, setModalState] = useState({
  isOpen: false,
  type: "success",
  message: "",
});
  const location = useLocation();

  const { View: LottieAnimation } = useLottie({
    animationData: studentAnimation,
    loop: true,
  });


  const [allCourses, setAllCourses] = useState([]);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);

  const [selection, setSelection] = useState({
    name: "",
    dob: "",
    doorNumber: "",
    village: "",
    course: location.state?.specificCourse || "",
    phone: "",
    email : "",
    courseCategory: location.state?.courseCategory || "",
    educationType: "",
    institutionName: "",
    classGrade: "",
    department: "",
    degreeLevel: "",
    educationStatus: "",
    passOutYear: "",
    currentYear: "",
    country: null,
    stateId: "",
    districtId: "",
    subDistrictId: "",
    pincode: "",
  });

  const API_BASE = "http://localhost:5000/api";

  // --- API UseEffects ---
  useEffect(() => {
    fetch(`${API_BASE}/countries`)
      .then((res) => res.json())
      .then((data) => setCountries(data));
    fetch(`${API_BASE}/courses`)
      .then((res) => res.json())
      .then((data) => setAllCourses(data));
  }, []);

  useEffect(() => {
    if (selection.country) {
      fetch(`${API_BASE}/states/${selection.country.id}`)
        .then((res) => res.json())
        .then((data) => setStates(data));
    }
  }, [selection.country]);

  useEffect(() => {
    if (selection.stateId && selection.country) {
      fetch(`${API_BASE}/cities/${selection.country.id}/${selection.stateId}`)
        .then((res) => res.json())
        .then((data) => {
          if (
            selection.pincode.length === 6 &&
            selection.country?.id === "IN" &&
            selection.districtId
          ) {
            const postalDistrict = selection.districtId.toLowerCase();
            let match = data.find(
              (d) =>
                d.name.toLowerCase() === postalDistrict ||
                d.name.toLowerCase().substring(0, 5) ===
                  postalDistrict.substring(0, 5),
            );
            if (match) {
              setSelection((prev) => ({ ...prev, districtId: match.id }));
              setDistricts(data);
            } else {
              setDistricts([
                { id: selection.districtId, name: selection.districtId },
                ...data,
              ]);
            }
          } else {
            setDistricts(data);
          }
        })
        .catch((err) => console.error("Error:", err));
    }
  }, [selection.stateId, selection.country]);

  // --- Logic Handlers ---
  const handlePincodeEntry = async (e) => {
    const pin = e.target.value;
    setSelection((prev) => ({ ...prev, pincode: pin }));

    if (selection.country?.id === "IN" && pin.length === 6) {
      try {
        const res = await fetch(`${API_BASE}/india/pincode/${pin}`);
        const result = await res.json();
        if (result.success && result.data.length > 0) {
          const info = result.data[0];
          const uniqueSubDistricts = Array.from(
            new Set(result.data.map((item) => item.subDistrict)),
          )
            .filter(Boolean)
            .map((name) => ({ id: name, name: name }));

          setSubDistricts(uniqueSubDistricts);
          const matchedState = states.find(
            (s) =>
              s.name.toLowerCase() === info.state.toLowerCase() ||
              s.name.toLowerCase().includes(info.state.toLowerCase()),
          );

          setSelection((prev) => ({
            ...prev,
            stateId: matchedState ? matchedState.id : "",
            stateName: info.state,
            districtId: info.district,
            districtName: info.district,
            subDistrictId: uniqueSubDistricts[0]?.id || "",
            pincode: pin,
          }));
        }
      } catch (err) {
        console.error("Pincode error", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "name",
      "dob",
      "doorNumber",
      "village",
      "phone",
      "email",
      "course",
      "educationType",
      "institutionName",
      "stateId",
      "districtId",
      "pincode",
    ];
    
    const emptyFields = requiredFields.filter((field) => !selection[field]);

    if (emptyFields.length > 0) {
      // INSTEAD OF alert()
      setModalState({
        isOpen: true,
        type: "error",
        message: `Required fields missing: ${emptyFields.join(", ").toUpperCase()}`
      });
      return;
    }

    const fullPhone = selection.country
      ? `${selection.country.phonecode} ${selection.phone}`
      : selection.phone;

    const submissionData = {
      ...selection,
      phone: fullPhone,
      state:
        selection.stateName ||
        states.find((s) => s.id === selection.stateId)?.name ||
        "",
      district: selection.districtName || selection.districtId || "",
      subDistrict: selection.subDistrictId || "",
    };

    try {
      const response = await fetch(`${API_BASE}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      const result = await response.json();

      if (result.success) {
        // INSTEAD OF alert("Registration Successful!")
        setModalState({
          isOpen: true,
          type: "success",
          message: "Registration Successful! Please check your email for confirmation."
        });
        
        // Reset the form
        setSelection({
          name: "",
          dob: "",
          doorNumber: "",
          village: "",
          phone: "",
          email: "",
          course: "",
          educationType: "",
          institutionName: "",
          classGrade: "",
          department: "",
          degreeLevel: "",
          educationStatus: "",
          passOutYear: "",
          currentYear: "",
          country: null,
          stateId: "",
          districtId: "",
          subDistrictId: "",
          pincode: "",
        });
      } else {
        // INSTEAD OF alert("Submission failed...")
        setModalState({
          isOpen: true,
          type: "error",
          message: "Submission failed: " + (result.message || "Please try again.")
        });
      }
    } catch (error) {
      // INSTEAD OF alert("Connection error...")
      setModalState({
        isOpen: true,
        type: "error",
        message: "Connection error: Is your backend running?"
      });
    }
  };

  // --- Compact Styling Classes ---
  const inputClass =
    "w-full px-3 py-2 bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400";
  const labelClass =
    "text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-1 tracking-wider";
  const availableSubCourses = allCourses.filter(
    (c) => c.category === selection.courseCategory,
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 pb-70 pt-50">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row h-[70vh]">
        {/* LEFT SIDE: Animation */}
        <div className="hidden lg:flex lg:w-[45%] bg-blue-50/50 p-8 flex-col items-center justify-center relative overflow-hidden border-r border-gray-100">
          <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-200/50 rounded-full blur-3xl mix-blend-multiply"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-purple-200/50 rounded-full blur-3xl mix-blend-multiply"></div>
          <div className="relative z-10 w-full max-w-sm scale-110 drop-shadow-xl">
            {LottieAnimation}
          </div>
          <div className="relative z-10 mt-8 text-center">
            <h2 className="text-3xl font-extrabold text-blue-950 mb-2">
              Start Your Journey
            </h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Join thousands of students building their tech future with G-TEC
              today.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Compact Form */}
        <div className="w-full lg:w-[55%] p-6 lg:p-8 overflow-y-auto custom-scrollbar relative bg-white">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900">
              Student Enrollment
            </h1>
            <p className="text-gray-500 text-xs mt-1">
              Please fill in your details to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <User size={12} /> Full Name
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="John Doe"
                  value={selection.name}
                  onChange={(e) =>
                    setSelection({ ...selection, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>
                  <Calendar size={12} /> Date of Birth
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={selection.dob}
                  onChange={(e) =>
                    setSelection({ ...selection, dob: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelClass}>
                  <MapPin size={12} /> Door No. / Street
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="12/34A, Main Street"
                  value={selection.doorNumber}
                  onChange={(e) =>
                    setSelection({ ...selection, doorNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>
                  <MapPin size={12} /> Village / Area
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Parvathipuram"
                  value={selection.village}
                  onChange={(e) =>
                    setSelection({ ...selection, village: e.target.value })
                  }
                />
              </div>
            </div>

            {/* 2. Education Type Toggle */}
            <div className="flex gap-3">
              <label
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl cursor-pointer border transition-all text-sm font-semibold ${selection.educationType === "school" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 bg-gray-50/50 text-gray-500 hover:bg-gray-100"}`}>
                <input
                  type="radio"
                  name="eduType"
                  value="school"
                  className="hidden"
                  onChange={(e) =>
                    setSelection({
                      ...selection,
                      educationType: e.target.value,
                      institutionName: "",
                      department: "",
                      degreeLevel: "",
                      educationStatus: "",
                    })
                  }
                />
                <LibraryBig size={16} /> School Student
              </label>
              <label
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl cursor-pointer border transition-all text-sm font-semibold ${selection.educationType === "college" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 bg-gray-50/50 text-gray-500 hover:bg-gray-100"}`}>
                <input
                  type="radio"
                  name="eduType"
                  value="college"
                  className="hidden"
                  onChange={(e) =>
                    setSelection({
                      ...selection,
                      educationType: e.target.value,
                      institutionName: "",
                      classGrade: "",
                    })
                  }
                />
                <Building2 size={16} /> College / Uni
              </label>
            </div>

            {/* 3. Dynamic Education Fields */}
            <AnimatePresence mode="wait">
              {selection.educationType === "school" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                  <div>
                    <label className={labelClass}>School Name</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="St. John's High"
                      value={selection.institutionName}
                      onChange={(e) =>
                        setSelection({
                          ...selection,
                          institutionName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Class / Grade</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. 10th Standard"
                      value={selection.classGrade}
                      onChange={(e) =>
                        setSelection({
                          ...selection,
                          classGrade: e.target.value,
                        })
                      }
                    />
                  </div>
                </motion.div>
              )}

              {selection.educationType === "college" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Institution Name</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="College Name"
                        value={selection.institutionName}
                        onChange={(e) =>
                          setSelection({
                            ...selection,
                            institutionName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Department</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. B.Sc CS"
                        value={selection.department}
                        onChange={(e) =>
                          setSelection({
                            ...selection,
                            department: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Level</label>
                      <select
                        className={inputClass}
                        value={selection.degreeLevel}
                        onChange={(e) =>
                          setSelection({
                            ...selection,
                            degreeLevel: e.target.value,
                          })
                        }>
                        <option value="">Select</option>
                        <option value="UG">UG</option>
                        <option value="PG">PG</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Status</label>
                      <select
                        className={inputClass}
                        value={selection.educationStatus}
                        onChange={(e) =>
                          setSelection({
                            ...selection,
                            educationStatus: e.target.value,
                            passOutYear: "",
                            currentYear: "",
                          })
                        }>
                        <option value="">Select</option>
                        <option value="Pursuing">Pursuing</option>
                        <option value="Passed Out">Passed Out</option>
                      </select>
                    </div>
                    {selection.educationStatus === "Passed Out" && (
                      <div>
                        <label className={labelClass}>Pass Year</label>
                        <input
                          type="number"
                          className={inputClass}
                          placeholder="2023"
                          value={selection.passOutYear}
                          onChange={(e) =>
                            setSelection({
                              ...selection,
                              passOutYear: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                    {selection.educationStatus === "Pursuing" && (
                      <div>
                        <label className={labelClass}>Current Year</label>
                        <select
                          className={inputClass}
                          value={selection.currentYear}
                          onChange={(e) =>
                            setSelection({
                              ...selection,
                              currentYear: e.target.value,
                            })
                          }>
                          <option value="">Select</option>
                          <option value="First Year">1st Year</option>
                          <option value="Second Year">2nd Year</option>
                          <option value="Third Year">3rd Year</option>
                          <option value="Fourth Year">4th Year</option>
                        </select>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* --- 4. Target Course Selection --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dropdown 1: The Filter (Doesn't affect DB) */}
              <div>
                <label className={labelClass}>
                  <BookOpen size={12} /> Course Category
                </label>
                <select
                  className={`${inputClass} bg-blue-50/50 border-blue-100 text-blue-800`}
                  value={selection.courseCategory}
                  onChange={(e) =>
                    setSelection({
                      ...selection,
                      courseCategory: e.target.value,
                      course: "",
                    })
                  } // Resets specific course when category changes
                >
                  <option value="">Select a category</option>
                  <option value="it-technical">IT / Technical</option>
                  <option value="it-non-technical">IT / Non-Technical</option>
                  <option value="designing">Designing</option>
                  <option value="accounting">Accounting</option>
                  <option value="civil">Civil / Architecture</option>
                </select>
              </div>

              {/* Dropdown 2: The Actual Course (Saves to DB 'course' field) */}
              <div>
                <label className={labelClass}>
                  <BookOpen size={12} /> Specific Course
                </label>
                <select
                  className={`${inputClass} bg-blue-50/50 border-blue-100 text-blue-800`}
                  value={selection.course}
                  onChange={(e) =>
                    setSelection({ ...selection, course: e.target.value })
                  }
                  disabled={!selection.courseCategory} // Locked until a category is chosen
                >
                  <option value="">Select a specific course</option>
                  {availableSubCourses.map((c) => (
                    <option key={c._id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* 5. Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <Globe size={12} /> Country
                </label>
                <select
                  className={inputClass}
                  value={selection.country?.id || ""}
                  onChange={(e) => {
                    const countryObj = countries.find(
                      (c) => c.id === e.target.value,
                    );
                    setSelection((prev) => ({
                      ...prev,
                      country: countryObj,
                      stateId: "",
                      districtId: "",
                      subDistrictId: "",
                      pincode: "",
                    }));
                    setStates([]);
                    setDistricts([]);
                    setSubDistricts([]);
                  }}>
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  <Phone size={12} /> Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1.5 border-r pr-2 border-gray-300">
                    {selection.country ? (
                      <>
                        <img
                          src={`https://flagcdn.com/w20/${selection.country.flag}.png`}
                          alt="flag"
                          className="w-4"
                        />
                        <span className="text-gray-700 font-bold text-xs">
                          {selection.country.phonecode.startsWith("+")
                            ? ""
                            : "+"}
                          {selection.country.phonecode}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs">--</span>
                    )}
                  </div>
                  <input
                    disabled={!selection.country}
                    type="tel"
                    className={`${inputClass} pl-[4.5rem]`}
                    placeholder="Phone number"
                    value={selection.phone}
                    onChange={(e) =>
                      setSelection((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="col-span-1">
      <label className={labelClass}><Mail size={12}/> Email Address</label>
      <input type="email" required className={inputClass} placeholder="student@gmail.com" value={selection.email} onChange={(e) => setSelection({...selection, email: e.target.value})} />
    </div>
            </div>

            {/* 6. Location Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="col-span-1">
                <label className={labelClass}>State</label>
                <select
                  disabled={!states.length}
                  className={inputClass}
                  value={selection.stateId}
                  onChange={(e) => {
                    setSelection((prev) => ({
                      ...prev,
                      stateId: e.target.value,
                      districtId: "",
                      subDistrictId: "",
                      pincode: "",
                    }));
                    setDistricts([]);
                    setSubDistricts([]);
                  }}>
                  <option value="">State</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className={labelClass}>District</label>
                <select
                  disabled={!districts.length}
                  className={inputClass}
                  value={selection.districtId}
                  onChange={(e) => {
                    setSelection((prev) => ({
                      ...prev,
                      districtId: e.target.value,
                      subDistrictId: "",
                      pincode: "",
                    }));
                    setSubDistricts([]);
                  }}>
                  <option value="">District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className={labelClass}>Sub-District</label>
                <select
                  disabled={!subDistricts.length}
                  className={inputClass}
                  value={selection.subDistrictId}
                  onChange={(e) =>
                    setSelection((prev) => ({
                      ...prev,
                      subDistrictId: e.target.value,
                    }))
                  }>
                  <option value="">Taluk</option>
                  {subDistricts.map((sd) => (
                    <option key={sd.id} value={sd.id}>
                      {sd.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className={labelClass}>
                  <Hash size={12} /> Pincode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={selection.pincode}
                  onChange={handlePincodeEntry}
                  className={`${inputClass} text-blue-700 font-bold tracking-wider`}
                  placeholder="123456"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 group">
              Complete Enrollment{" "}
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>
        </div>
      </div>
      {/* --- SUCCESS/ERROR POPUP MODAL --- */}
      <AnimatePresence>
        {modalState.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl border border-white/20"
            >
              {/* Lottie Animation Container */}
             <div className="w-32 h-32 mb-2 flex justify-center items-center">
    <PopupAnimation type={modalState.type} />
  </div>

              {/* Dynamic Title */}
              <h3 className={`text-2xl font-black mb-3 ${
                modalState.type === "success" ? "text-emerald-600" : "text-red-600"
              }`}>
                {modalState.type === "success" ? "Enrollment Successful!" : "Action Failed"}
              </h3>

              {/* Dynamic Message */}
              <p className="text-gray-500 mb-8 text-sm leading-relaxed px-2">
                {modalState.message}
              </p>

              {/* Action Button */}
              <button
                onClick={() => {
                  setModalState({ ...modalState, isOpen: false });
                  if (modalState.type === "success") {
                    // Redirect to home or courses page after success
                    window.location.href = "/courses"; 
                  }
                }}
                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] shadow-lg ${
                  modalState.type === "success"
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                    : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                }`}
              >
                {modalState.type === "success" ? "Continue to Dashboard" : "Try Again"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
