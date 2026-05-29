const express = require('express');
const cors = require('cors');
const { Country, State, City } = require('country-state-city');
const axios = require('axios'); 
const mongoose = require('mongoose');
const adminAuthRoutes = require('./adminAuth');

require('dotenv').config();

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());


app.set('trust proxy', true);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: "Too many requests from this IP, please try again in 15 minutes." }
});

app.use('/api/', apiLimiter);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gtec_database';
const BACKEND_URL = process.env.BACKEND_URL;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB successfully connected!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });

app.use('/api/admin', adminAuthRoutes);

const studentSchema = new mongoose.Schema({
  name: String,
  dob: String,
  phone:String,
  email:String,
  doorNumber: String,
  village: String,
  courseCategory: String,
  course: String,
  educationType: String, // school or college
  institutionName: String,
  classGrade: String,
  department: String,
  degreeLevel: String,
  educationStatus: String,
  passOutYear: String,
  currentYear: String,
  country: Object,
  state: String,
  district: String,
  subDistrict: String,
  pincode: String,
  isArchived: { type: Boolean, default: false },
  enrollmentDate: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

const courseSchema = new mongoose.Schema({
  title: String,
  category: String, 
  shortDesc: String,
  fullDesc: String,
  duration: String,
  tags: [String], 
  image: String, 
  syllabus: [String], 
  certifications: [String],
  createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', courseSchema);

const offerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  priceOff: { type: String, required: true }, 
  priceOn: { type: String, required: true }, 
  features: [{ type: String }],              
  highlighted: { type: Boolean, default: false }, 
  linkedCategory: { type: String, default: "" },
  linkedCourseTitle: { type: String, default: "" }
});

const Offer = mongoose.model('Offer', offerSchema);

const inquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: { type: Date, default: Date.now }
});
const Inquiry = mongoose.model('Inquiry', inquirySchema);

const gameScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  score: { type: Number, required: true },
  couponCode: { type: String, required: true },
}, { timestamps: true });

const GameScore = mongoose.model('GameScore', gameScoreSchema);

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  countryCode: { type: String },
  phone: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'Unread' }
});

const ContactInquiry = mongoose.model('ContactInquiry', contactSchema);

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String }, 
  explorerDescription: { type: String }, 
  headline: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);

// 1. Get All Countries
app.get('/api/countries', (req, res) => {
  const countries = Country.getAllCountries().map(c => ({
    id: c.isoCode,
    name: c.name,
    phonecode: c.phonecode,
    flag: c.isoCode.toLowerCase()
  }));
  res.json(countries);
});

// 2. Get States by Country
app.get('/api/states/:countryCode', (req, res) => {
  const states = State.getStatesOfCountry(req.params.countryCode).map(s => ({
    id: s.isoCode,
    name: s.name
  }));
  res.json(states);
});

// 3. Get Districts (Cities) by State
app.get('/api/cities/:countryCode/:stateCode', (req, res) => {
  const cities = City.getCitiesOfState(req.params.countryCode, req.params.stateCode).map(c => ({
    id: c.name,
    name: c.name
  }));
  res.json(cities);
});

app.get('/api/districts/:countryCode/:stateCode', (req, res) => {
  const { countryCode, stateCode } = req.params;
  
  // Use the library to get cities based on both country and state for accuracy
  const cities = City.getCitiesOfState(countryCode, stateCode).map(c => ({
    id: c.name, 
    name: c.name
  }));
  
  res.json(cities);
});

app.get('/api/subdistricts/:districtId', (req, res) => {
  res.json([]); 
});

app.get('/api/india/pincode/:pin', async (req, res) => {
  try {
    const response = await axios.get(`http://www.postalpincode.in/api/pincode/${req.params.pin}`);
    const data = response.data;

    if (data.Status === "Success") {
      const areas = data.PostOffice.map(po => ({
        subDistrict: po.Taluk || po.Block,
        district: po.District,
        state: po.State,
        postName: po.Name
      }));
      res.json({ success: true, data: areas });
    } else {
      res.status(404).json({ success: false, message: "Invalid Pincode" });
    }
  } catch (error) {
    console.error('Pincode lookup failed:', error.message || error);
    res.status(500).json({ success: false, message: `Postal lookup service error: ${error.message || 'Unavailable'}` });
  }
});

{/*---------- Course Category verification section ----------*/}

app.post('/api/categories', async (req, res) => {
  try {
    const { name, slug, description, explorerDescription, headline, image } = req.body; 
    const newCategory = new Category({ name, slug, description, explorerDescription, headline, image });
    await newCategory.save();
    res.json({ success: true, message: "Category created!", data: newCategory });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Fetch all Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

//3. Update Category

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { name, slug, description, explorerDescription, headline, image } = req.body;
    await Category.findByIdAndUpdate(
      req.params.id, 
      { name, slug, description, explorerDescription, headline, image }, 
      { new: true }
    );
    res.json({ success: true, message: "Category updated successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update category" });
  }
});

// 4. Delete Category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete" });
  }
});

{/* ---------- Chatbot Section ---------- */}

app.post('/api/chatbot', async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();
    res.json({ success: true, message: "Our team will contact you as soon as possible!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/inquiries', async (req, res) => {
  try {
    // Fetches all inquiries and sorts them by newest first
    const inquiries = await Inquiry.find().sort({ date: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 2. Delete an inquiry
app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Inquiry deleted!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

{/* ---------- Offers Section ---------- */}

app.get('/api/offers', async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/offers', async (req, res) => {
  try {
    const newOffer = new Offer(req.body);
    await newOffer.save();
    res.json({ success: true, message: "Offer added successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/offers/:id', async (req, res) => {
  try {
    await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "Offer updated successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/offers/:id', async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Offer deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

{/*------------------ Game Logic Section ---------------*/}

app.post('/api/gamescores/add', async (req, res) => {
  try {
    const newScore = new GameScore(req.body);
    await newScore.save();
    res.status(201).json({ success: true, message: "Game score saved!" });
  } catch (error) {
    console.error("Error saving game score:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get('/api/gamescores/all', async (req, res) => {
  try {
    const scores = await GameScore.find().sort({ createdAt: -1 }); 
    res.status(200).json(scores);
  } catch (error) {
    console.error("Error fetching game scores:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


{/*------------------ Contact Section ---------------*/}

// ✅ NEW CONTACT POST ROUTE (Saves to DB ONLY)
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, countryCode, phone, message } = req.body;

  try {
    // 🛡️ DUPLICATE PREVENTION: Check if this exact message was sent recently
    const duplicate = await ContactInquiry.findOne({ email, message });
    if (duplicate) {
      return res.status(200).json({ success: true, message: 'We already received this message. We will contact you soon!' });
    }

    // Save to Database
    const newInquiry = new ContactInquiry({
      firstName,
      lastName,
      email,
      countryCode,
      phone,
      message
    });
    
    await newInquiry.save();

    res.status(200).json({ success: true, message: 'Inquiry securely saved.' });

  } catch (error) {
    console.error('Contact Submission Error:', error);
    res.status(500).json({ success: false, message: 'Failed to process the inquiry.' });
  }
});

// ✅ GET ROUTE (Fetch all inquiries for Admin Dashboard)
app.get('/api/contact-inquiries', async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries });
  } catch (err) {
    console.error("Fetch Inquiries Error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch inquiries." });
  }
});

{/* -------- Course Section -------- */}

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.json({ success: true, message: "Course added successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "Course updated successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Course deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


{/* ------ students Detail section ----- */}

app.get('/api/students', async (req, res) => {
  try {
    const activeStudents = await Student.find({ isArchived: { $ne: true } }).sort({ createdAt: -1 });
    res.json(activeStudents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/students/all', async (req, res) => {
  try {
    const allStudents = await Student.find().sort({ createdAt: -1 });
    res.json(allStudents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/enroll', async (req, res) => {
  try {
    const { phone, course } = req.body;

    // 🛡️ DUPLICATE SHIELD: Check if student exists in this course and is not archived
    const checkDuplicate = await Student.findOne({ 
      phone, 
      course,
      isArchived: { $ne: true } 
    });

    if (checkDuplicate) {
      return res.status(400).json({ 
        success: false, 
        error: "You are already enrolled in this course!" 
      });
    }

    const newStudent = new Student(req.body);
    await newStudent.save();

    res.json({ success: true, message: "Student enrolled successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Dummy endpoint so frontend doesn't crash if buttons are pressed
app.post('/api/students/bulk-email', async (req, res) => {
  res.json({ success: true, message: "Mail service is disabled. No action taken." });
});

// Dummy endpoint so frontend doesn't crash if buttons are pressed
app.post('/api/students/:id/send-email', async (req, res) => {
  res.json({ success: true, message: "Mail service is disabled. No action taken." });
});

// ✅ API to UPDATE an existing student
app.put('/api/students/:id', async (req, res) => {
  try {
    // ⚠️ CRITICAL: We use findByIdAndUpdate, NOT "new Student()"
    await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    res.json({ success: true, message: "Student updated successfully!" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    // Instead of findByIdAndDelete, we just UPDATE the isArchived flag to true!
    await Student.findByIdAndUpdate(req.params.id, { isArchived: true });
    res.json({ success: true, message: "Student removed from active tab successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Professional Geo-Server running on ${PORT}`));