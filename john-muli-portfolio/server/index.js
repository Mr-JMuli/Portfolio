// server/index.js - Main Express Server
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: "Too many requests" }));

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => { console.error("❌ MongoDB error:", err); process.exit(1); });

// ─── Schemas & Models ─────────────────────────────────────────────────────────

// Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ["Cybersecurity", "Cloud Infrastructure", "DevOps", "Networking", "AI/ML", "Full Stack", "System Administration"] },
  description: { type: String, required: true },
  longDescription: { type: String },
  tech: [{ type: String }],
  metrics: [{ type: String }],
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ["completed", "in-progress", "planned"], default: "completed" },
  github: { type: String },
  liveUrl: { type: String },
  imageUrl: { type: String },
  architecture: { type: String }, // markdown/diagram description
  color: { type: String, default: "#00d4ff" },
  order: { type: Number, default: 0 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Lab Schema
const labSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  tools: [{ type: String }],
  steps: [{ title: String, content: String, code: String, image: String }],
  takeaways: [{ type: String }],
  prerequisites: [{ type: String }],
  github: { type: String },
  color: { type: String, default: "#00d4ff" },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

// Certification Schema
const certSchema = new mongoose.Schema({
  name: { type: String, required: true },
  abbr: { type: String, required: true },
  provider: { type: String, required: true },
  status: { type: String, enum: ["earned", "pursuing", "planned"], default: "earned" },
  date: { type: String },
  verifyUrl: { type: String },
  description: { type: String },
  color: { type: String, default: "#00d4ff" },
  badgeUrl: { type: String },
  progress: { type: Number, min: 0, max: 100, default: 0 }, // for pursuing
  order: { type: Number, default: 0 },
});

// Contact/Message Schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
});

// Admin User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin"], default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

// Blog Post Schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true }, // Markdown
  category: { type: String },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  coverImage: { type: String },
  readTime: { type: Number }, // minutes
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);
const Lab = mongoose.model("Lab", labSchema);
const Certification = mongoose.model("Certification", certSchema);
const Message = mongoose.model("Message", messageSchema);
const User = mongoose.model("User", userSchema);
const BlogPost = mongoose.model("BlogPost", blogSchema);

// ─── Auth Middleware ───────────────────────────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Authentication required" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "changeme-in-production");
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// --- Auth ---
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "changeme-in-production", { expiresIn: "7d" });

    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- Projects ---
app.get("/api/projects", async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    let query = {};
    if (category && category !== "All") query.category = category;
    if (featured === "true") query.featured = true;
    if (search) query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tech: { $in: [new RegExp(search, "i")] } },
    ];
    const projects = await Project.find(query).sort({ featured: -1, order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

app.post("/api/projects", auth, async (req, res) => {
  try {
    const project = new Project({ ...req.body, updatedAt: new Date() });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/projects/:id", auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id, { ...req.body, updatedAt: new Date() }, { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/projects/:id", auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// --- Labs ---
app.get("/api/labs", async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    let query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    const labs = await Lab.find(query).sort({ featured: -1, createdAt: -1 });
    res.json(labs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch labs" });
  }
});

app.post("/api/labs", auth, async (req, res) => {
  try {
    const lab = new Lab(req.body);
    await lab.save();
    res.status(201).json(lab);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/labs/:id", auth, async (req, res) => {
  try {
    const lab = await Lab.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lab) return res.status(404).json({ error: "Lab not found" });
    res.json(lab);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/labs/:id", auth, async (req, res) => {
  try {
    await Lab.findByIdAndDelete(req.params.id);
    res.json({ message: "Lab deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete lab" });
  }
});

// --- Certifications ---
app.get("/api/certifications", async (req, res) => {
  try {
    const certs = await Certification.find().sort({ order: 1, date: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch certifications" });
  }
});

app.post("/api/certifications", auth, async (req, res) => {
  try {
    const cert = new Certification(req.body);
    await cert.save();
    res.status(201).json(cert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/certifications/:id", auth, async (req, res) => {
  try {
    const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cert) return res.status(404).json({ error: "Certification not found" });
    res.json(cert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Contact ---
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: "Name, email and message required" });

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email address" });

    const msg = new Message({ name, email, subject, message, ipAddress: req.ip });
    await msg.save();

    // TODO: Add email notification (e.g. via SendGrid or Nodemailer)

    res.json({ success: true, message: "Message received. I'll get back to you within 24 hours." });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.get("/api/admin/messages", auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.put("/api/admin/messages/:id/read", auth, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: "Failed to update message" });
  }
});

// --- Blog ---
app.get("/api/blog", async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true }).select("-content").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.get("/api/blog/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

app.post("/api/blog", auth, async (req, res) => {
  try {
    const post = new BlogPost({ ...req.body, updatedAt: new Date() });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Analytics / Stats ---
app.get("/api/stats", async (req, res) => {
  try {
    const [projects, labs, certs, messages] = await Promise.all([
      Project.countDocuments(),
      Lab.countDocuments(),
      Certification.countDocuments({ status: "earned" }),
      Message.countDocuments({ read: false }),
    ]);
    res.json({ projects, labs, certifications: certs, unreadMessages: messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// --- Health Check ---
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ─── Seed Data ────────────────────────────────────────────────────────────────
async function seedDatabase() {
  const count = await Project.countDocuments();
  if (count > 0) return;

  console.log("🌱 Seeding database...");

  const seedProjects = [
    {
      title: "SOC Monitoring Dashboard",
      category: "Cybersecurity",
      description: "Real-time SOC dashboard integrating SIEM alerts, threat intelligence feeds, and incident response workflows.",
      longDescription: "A production-ready Security Operations Center dashboard built with Node.js and React. Integrates with Splunk SIEM for real-time alert ingestion, processes 10K+ security events daily, and provides analysts with a unified view of the security posture.",
      tech: ["Node.js", "MongoDB", "Splunk API", "React", "WebSockets", "Docker"],
      metrics: ["10K+ Alerts Processed", "500+ Incidents Managed", "99.9% Uptime"],
      featured: true,
      color: "#00d4ff",
      order: 1,
    },
    {
      title: "Cloud Security Monitoring Platform",
      category: "Cloud Infrastructure",
      description: "AWS-based CSPM tool that continuously scans for misconfigurations and IAM policy violations with auto-remediation.",
      tech: ["AWS Lambda", "Python", "CloudWatch", "SNS", "DynamoDB", "Terraform"],
      metrics: ["200+ Security Checks", "1K+ Resources Scanned", "Auto-Remediation"],
      featured: true,
      color: "#4f8ef7",
      order: 2,
    },
    {
      title: "WISP Authentication & Billing",
      category: "Full Stack",
      description: "Enterprise hotspot authentication and billing platform for ISPs with MikroTik RouterOS integration.",
      tech: ["MERN Stack", "MikroTik API", "JWT", "Stripe", "Redis", "Ubuntu"],
      metrics: ["500+ Active Users", "99.8% Uptime", "Fully Automated Billing"],
      featured: true,
      color: "#00e676",
      order: 3,
    },
  ];

  await Project.insertMany(seedProjects);

  // Create admin user if not exists
  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL || "admin@johnmuli.dev" });
  if (!adminExists) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || "ChangeThisPassword!", 12);
    await User.create({
      email: process.env.ADMIN_EMAIL || "admin@johnmuli.dev",
      password: hashed,
      role: "admin",
    });
    console.log("✅ Admin user created");
  }

  console.log("✅ Database seeded");
}

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await seedDatabase();
});
