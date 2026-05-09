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

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: "Too many requests from this IP, please try again in 15 minutes." }
});

app.use('/api/', apiLimiter);

const MONGO_URI = 'mongodb://127.0.0.1:27017/gtec_database';
const BACKEND_URL = process.env.BACKEND_URL;
const nodemailer = require('nodemailer');
const EMAIL_USER=process.env.EMAIL_USER;
const EMAIL_PASSWORD=process.env.EMAIL_PASSWORD;

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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

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
    name: c.name
  }));
  res.json(cities);
});

app.get('/api/districts/:countryCode/:stateCode', (req, res) => {
  const { countryCode, stateCode } = req.params;
  
  // Use the library to get cities based on both country and state for accuracy
  const cities = City.getCitiesOfState(countryCode, stateCode).map(c => ({
    id: c.name, // The library doesn't provide unique IDs for all cities, so we use the name
    name: c.name
  }));
  
  res.json(cities);
});

app.get('/api/subdistricts/:districtId', (req, res) => {
  res.json([]); 
});

app.get('/api/india/pincode/:pin', async (req, res) => {
  try {
    const response = await axios.get(`https://api.postalpincode.in/pincode/${req.params.pin}`);
    const data = response.data[0];
    
    if (data.Status === "Success") {
      const areas = data.PostOffice.map(po => ({
        subDistrict: po.Block,
        district: po.District,
        state: po.State,
        postName: po.Name
      }));
      res.json({ success: true, data: areas });
    } else {
      res.status(404).json({ success: false, message: "Invalid Pincode" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

{/*---------- Course Category verification section ----------*/}

// REPLACE your current POST route with this:
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

{/*------------------ MailSection ---------------*/}

// ✅ 1. TRACKING PIXEL ROUTE (Marks inquiry as 'Read' when email is opened)
app.get('/api/contact-inquiries/:id/track-read', async (req, res) => {
  try {
    // Update the database status to 'Read'
    await ContactInquiry.findByIdAndUpdate(req.params.id, { status: 'Read' });
    
    // Return a 1x1 transparent GIF so the email doesn't show a broken image box
    const transparentGif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': transparentGif.length
    });
    res.end(transparentGif);
  } catch (err) {
    console.error("Tracking Pixel Error:", err);
    res.status(500).send('Error');
  }
});

// ✅ 2. NEW CONTACT POST ROUTE (Saves to DB & Sends Tracked Email)
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, countryCode, phone, message } = req.body;

  try {
    // A. Save to Database first to generate the _id
    const newInquiry = new ContactInquiry({
      firstName,
      lastName,
      email,
      countryCode,
      phone,
      message
    });
    await newInquiry.save();

    // B. Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER, 
        pass: EMAIL_PASSWORD  
      }
    });

    const formattedPhone = `${countryCode} ${phone}`;
    
    // ⚠️ IMPORTANT: Change this to your live server URL once deployed!
    // E.g., 'https://api.yourdomain.com'
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'; 
    const trackingPixelUrl = `${BACKEND_URL}/api/contact-inquiries/${newInquiry._id}/track-read`;

    const mailOptions = {
      from: `"G-TEC Portal" <${EMAIL_USER}>`, 
      replyTo: email, 
      to: EMAIL_USER,
      subject: `🔔 New Lead: ${firstName} ${lastName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 40px 20px; border-radius: 12px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-top: 4px solid #2563eb;">
            
            <h2 style="margin-top: 0; color: #111827; font-size: 24px;">New Student Inquiry</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">You have received a new contact request from the website. The details have been securely logged in your database.</p>
            
            <div style="background-color: #f3f4f6; border-radius: 6px; padding: 20px; margin: 25px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 100px;">Name:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: bold;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email:</td>
                  <td style="padding: 8px 0; font-weight: bold;">
                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Phone:</td>
                  <td style="padding: 8px 0; font-weight: bold;">
                    <a href="tel:${formattedPhone.replace(/\s+/g, '')}" style="color: #111827; text-decoration: none;">${formattedPhone}</a>
                  </td>
                </tr>
              </table>
            </div>

            <h3 style="color: #374151; font-size: 16px; margin-bottom: 10px;">Student's Message:</h3>
            <div style="background-color: #ffffff; border-left: 4px solid #e5e7eb; padding: 15px 20px; margin-bottom: 20px; color: #4b5563; font-style: italic; line-height: 1.6;">
              "${message}"
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Reply to Student</a>
            </div>

          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>This is an automated alert from the G-TEC Database System.</p>
            <p>Logged at: ${new Date().toLocaleString()}</p>
          </div>
        </div>

        <img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" alt="" />
      `
    };

    // C. Send Email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ success: true, message: 'Inquiry securely saved and email dispatched.' });

  } catch (error) {
    console.error('Contact Submission Error:', error);
    res.status(500).json({ success: false, message: 'Failed to process the inquiry.' });
  }
});

// ✅ 3. GET ROUTE (Fetch all inquiries for Admin Dashboard)
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

{/* 
  app.put('/api/students/:id', async (req, res) => {
  try {
    // 1. Save the student to MongoDB
    const newStudent = new Student(req.body);
    await newStudent.save();

    // 2. Prepare the personalized SMS message
    const messageText = `Welcome to G-TEC Nagercoil, ${newStudent.name}! Your enrollment for the ${newStudent.course} course is successfully registered. We will contact you shortly.`;

    // 3. Send the SMS using Fast2SMS API
    if (newStudent.phone) {
      try {
        await axios({
          method: 'POST',
          url: 'https://www.fast2sms.com/dev/bulkV2',
          headers: {
            'authorization': process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          },
          data: {
            route: 'q', // Quick transactional route
            message: messageText,
            language: 'english',
            flash: 0,
            numbers: newStudent.phone // Ensure phone is a 10-digit Indian number
          }
        });
        console.log(`✅ SMS sent successfully to ${newStudent.phone}`);
      } catch (smsError) {
        console.error("❌ Failed to send SMS:", smsError.response ? smsError.response.data : smsError.message);
        // We don't return an error to the frontend here, because the enrollment was still successful
      }
    }

    res.json({ success: true, message: "Student enrolled & SMS sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});*/
}

app.post('/api/enroll', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();

    // Send the "Celebratory" Welcome Email
    if (newStudent.email) {
      const mailOptions = {
        from: `"G-TEC Education Nagercoil" <${process.env.EMAIL_USER}>`,
        to: newStudent.email,
        subject: '🎉 Enrollment Confirmed! Welcome to G-TEC Nagercoil',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 40px 20px; text-align: center; color: white;">
              <img src="https://www.gteceducation.com/assets/img/favicon/favicon-32x32.png" alt="G-TEC Education" style="max-height: 60px; margin-bottom: 20px; border-radius: 4px;" />
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">Welcome to the Family!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your tech journey starts right here.</p>
            </div>

            <div style="padding: 35px 30px;">
              <p style="font-size: 18px; color: #1f2937; margin-top: 0;">Hi <strong>${newStudent.name}</strong>,</p>
              
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
                Congratulations! You have successfully secured your spot in the <strong style="color: #2563eb;">${newStudent.course}</strong> program at G-TEC Education. We are absolutely thrilled to help you build your future.
              </p>

              <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 18px 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="margin: 0 0 12px 0; color: #1e3a8a; font-size: 16px;">📌 What happens next?</h3>
                <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.6;">
                  <li style="margin-bottom: 6px;">Our academic counselor will review your profile.</li>
                  <li style="margin-bottom: 6px;">We will call you shortly to finalize your batch timings.</li>
                  <li>You will receive your schedule and get ready to learn!</li>
                </ul>
              </div>

              <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
                If you are eager to start or have any immediate questions, don't hesitate to reach out to our team right away.
              </p>

              <div style="text-align: center; margin: 35px 0;">
                <a href="tel:+919486188648" style="background-color: #ffffff; color: #2563eb; border: 2px solid #2563eb; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
                  📞 Call Support
                </a>
              </div>
              
              <p style="font-size: 16px; color: #374151; margin-bottom: 0;">
                Warmly,<br/>
                <strong style="color: #1e3a8a; font-size: 18px;">The G-TEC Team</strong>
              </p>
            </div>

            <div style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 15px;">G-TEC Education Nagercoil</h4>
              <p style="margin: 5px 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                Upstair, Tower Jn, Sivaraj Building 2nd Floor, Rose Centre<br/>
                Nagercoil, Tamil Nadu 629001
              </p>
              
              <div style="margin: 15px 0; border-top: 1px dashed #d1d5db; width: 50%; margin-left: auto; margin-right: auto;"></div>
              
              <p style="margin: 5px 0; color: #6b7280; font-size: 13px;">
                <a href="tel:+919486188648" style="color: #2563eb; text-decoration: none; font-weight: 500;">+91 94861 88648</a> <span style="color: #d1d5db; margin: 0 5px;">|</span> 
                <a href="tel:+917200286091" style="color: #2563eb; text-decoration: none; font-weight: 500;">+91 72002 86091</a>
              </p>
              <p style="margin: 5px 0; color: #6b7280; font-size: 13px;">
                <a href="mailto:infozenxit@gmail.com" style="color: #2563eb; text-decoration: none; font-weight: 500;">infozenxit@gmail.com</a>
              </p>
            </div>

          </div>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error("❌ Email Error:", error);
        else console.log("✅ Welcome Email sent to:", newStudent.email);
      });
    }

    res.json({ success: true, message: "Student enrolled & Email sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/students/bulk-email', async (req, res) => {
  const { studentIds } = req.body;
  
  try {
    // 1. Fetch all selected students from DB
    const students = await Student.find({ _id: { $in: studentIds } });
    const studentsWithEmail = students.filter(s => s.email && s.email.trim() !== "");

    if (studentsWithEmail.length === 0) {
      return res.status(400).json({ success: false, error: "None of the selected students have a valid email address." });
    }

    // 2. Prepare and send emails in parallel
    const emailPromises = studentsWithEmail.map(student => {
      const mailOptions = {
        from: `"G-TEC Education Nagercoil" <${process.env.EMAIL_USER}>`,
        to: student.email,
        subject: '⚠️ Important Update: G-TEC Nagercoil',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
          
          <div style="text-align: center; padding-bottom: 20px;">
            <img src="https://www.gteceducation.com/assets/img/favicon/favicon-32x32.png" alt="G-TEC Education" style="max-height: 60px; margin-bottom: 10px;" />
            <h2 style="color: #1e3a8a; margin: 0; font-size: 24px; letter-spacing: 0.5px;">G-TEC Education Nagercoil</h2>
          </div>

          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-top: 4px solid #2563eb;">
            <p style="font-size: 16px; color: #374151; margin-top: 0;">Hello <strong style="color: #111827;">${student.name}</strong>,</p>
            
            <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
              This is a quick reminder from G-TEC Nagercoil regarding your <strong style="color: #2563eb;">${student.course}</strong> course.
            </p>
            
            <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
              Please contact the office at your earliest convenience to discuss your course progress, batch timings, or any pending updates.
            </p>

            <div style="text-align: center; margin: 35px 0;">
              <a href="tel:+919486188648" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                Contact Office Now
              </a>
            </div>
            
            <p style="font-size: 16px; color: #374151; margin-bottom: 0;">
              Best Regards,<br/>
              <strong style="color: #1e3a8a; font-size: 18px;">G-TEC Team</strong>
            </p>
          </div>

          <div style="text-align: center; margin-top: 25px; color: #6b7280; font-size: 13px; line-height: 1.6;">
            <p style="margin: 0; font-weight: bold; color: #4b5563;">G-TEC Education Nagercoil</p>
            <p style="margin: 5px 0;">Upstair, Tower Jn, Sivaraj Building 2nd Floor, Rose Centre, Nagercoil, Tamil Nadu 629001</p>
            <p style="margin: 5px 0;">
              <strong>Phone:</strong> +91 94861 88648, +91 72002 86091<br/>
              <strong>Email:</strong> infozenxit@gmail.com
            </p>
            <p style="margin: 15px 0 0 0; font-size: 12px; color: #9ca3af;">
              © ${new Date().getFullYear()} G-TEC Education. All rights reserved.
            </p>
          </div>

        </div>
        `
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
    
    console.log(`[BULK EMAIL] Successfully sent ${studentsWithEmail.length} emails.`);
    res.json({ 
      success: true, 
      message: `Successfully sent emails to ${studentsWithEmail.length} students.` 
    });

  } catch (err) {
    console.error("Bulk Email Error:", err);
    res.status(500).json({ success: false, error: "Server error while sending bulk emails." });
  }
});

// ✅ API to MANUALLY SEND SMS (Triggered by Admin Panel Button)
app.post('/api/students/:id/send-email', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if(!student) return res.status(404).json({ error: "Student not found" });
    if(!student.email) return res.status(400).json({ error: "Student has no email address" });

    const mailOptions = {
      from: `"G-TEC Education" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: 'Update regarding your G-TEC Course',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
          
          <div style="text-align: center; padding-bottom: 20px;">
            <img src="https://www.gteceducation.com/assets/img/favicon/favicon-32x32.png" alt="G-TEC Education" style="max-height: 60px; margin-bottom: 10px;" />
            <h2 style="color: #1e3a8a; margin: 0; font-size: 24px; letter-spacing: 0.5px;">G-TEC Education Nagercoil</h2>
          </div>

          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-top: 4px solid #2563eb;">
            <p style="font-size: 16px; color: #374151; margin-top: 0;">Hello <strong style="color: #111827;">${student.name}</strong>,</p>
            
            <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
              This is a quick reminder from G-TEC Nagercoil regarding your <strong style="color: #2563eb;">${student.course}</strong> course.
            </p>
            
            <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
              Please contact the office at your earliest convenience to discuss your course progress, batch timings, or any pending updates.
            </p>

            <div style="text-align: center; margin: 35px 0;">
              <a href="tel:+919486188648" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                Contact Office Now
              </a>
            </div>
            
            <p style="font-size: 16px; color: #374151; margin-bottom: 0;">
              Best Regards,<br/>
              <strong style="color: #1e3a8a; font-size: 18px;">G-TEC Team</strong>
            </p>
          </div>

          <div style="text-align: center; margin-top: 25px; color: #6b7280; font-size: 13px; line-height: 1.6;">
            <p style="margin: 0; font-weight: bold; color: #4b5563;">G-TEC Education Nagercoil</p>
            <p style="margin: 5px 0;">Upstair, Tower Jn, Sivaraj Building 2nd Floor, Rose Centre, Nagercoil, Tamil Nadu 629001</p>
            <p style="margin: 5px 0;">
              <strong>Phone:</strong> +91 94861 88648, +91 72002 86091<br/>
              <strong>Email:</strong> infozenxit@gmail.com
            </p>
            <p style="margin: 15px 0 0 0; font-size: 12px; color: #9ca3af;">
              © ${new Date().getFullYear()} G-TEC Education. All rights reserved.
            </p>
          </div>

        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SYSTEM] Sent to ${student.email}`);
    res.json({ success: true, message: "Email sent successfully!" });

  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ success: false, error: "Failed to send Email" });
  }
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

app.listen(5000, () => console.log('Professional Geo-Server running on 5000'));