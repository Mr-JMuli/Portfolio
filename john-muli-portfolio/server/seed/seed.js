// server/seed/seed.js — Run with: node seed/seed.js
require('dotenv').config({ path: '../.env' })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'

// ─── Inline Models (to run standalone) ───────────────────────────────────────
const projectSchema = new mongoose.Schema({
  title: String, category: String, description: String, longDescription: String,
  tech: [String], metrics: [String], featured: Boolean, status: String,
  github: String, liveUrl: String, imageUrl: String, color: String, order: Number,
  tags: [String], createdAt: { type: Date, default: Date.now },
})

const certSchema = new mongoose.Schema({
  name: String, abbr: String, provider: String, status: String,
  date: String, verifyUrl: String, description: String, color: String,
  badgeUrl: String, progress: Number, order: Number,
})

const labSchema = new mongoose.Schema({
  title: String, category: String, difficulty: String, duration: String,
  description: String, tools: [String], steps: [{ title: String, content: String, code: String }],
  takeaways: [String], github: String, color: String, featured: Boolean, tags: [String],
  createdAt: { type: Date, default: Date.now },
})

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
})

const Project = mongoose.model('Project', projectSchema)
const Certification = mongoose.model('Certification', certSchema)
const Lab = mongoose.model('Lab', labSchema)
const User = mongoose.model('User', userSchema)

// ─── Seed Data ────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    title: 'SOC Monitoring Dashboard',
    category: 'Cybersecurity',
    description: 'Real-time SOC dashboard integrating SIEM alerts, threat intelligence feeds, and incident response workflows with live event streaming.',
    longDescription: 'A production-ready Security Operations Center dashboard built with Node.js and React. Integrates with Splunk SIEM for real-time alert ingestion, processes 10K+ security events daily, and provides analysts with a unified view of the security posture.',
    tech: ['Node.js', 'MongoDB', 'Splunk API', 'React', 'WebSockets', 'Docker'],
    metrics: ['10K+ Alerts Processed', '500+ Incidents Managed', '99.9% Uptime'],
    featured: true, status: 'completed', color: '#00d4ff', order: 1, github: '#',
  },
  {
    title: 'Cloud Security Monitoring Platform',
    category: 'Cloud Infrastructure',
    description: 'AWS-based CSPM tool that continuously scans for misconfigurations, unused IAM permissions, and S3 bucket policy violations with auto-remediation.',
    tech: ['AWS Lambda', 'Python', 'CloudWatch', 'SNS', 'DynamoDB', 'Terraform'],
    metrics: ['200+ Security Checks', '1K+ Resources Scanned', 'Auto-Remediation'],
    featured: true, status: 'completed', color: '#4f8ef7', order: 2, github: '#',
  },
  {
    title: 'WISP Authentication & Billing System',
    category: 'Full Stack',
    description: 'Enterprise hotspot authentication and billing platform for ISPs with MikroTik RouterOS integration, real-time bandwidth monitoring, and automated invoicing.',
    tech: ['MERN Stack', 'MikroTik API', 'JWT', 'Stripe', 'Redis', 'Ubuntu'],
    metrics: ['500+ Active Users', '99.8% Uptime', 'Fully Automated Billing'],
    featured: true, status: 'completed', color: '#00e676', order: 3, github: '#',
  },
  {
    title: 'MikroTik WAN Load Balancer',
    category: 'Networking',
    description: 'Multi-ISP WAN load balancing and failover using MikroTik RouterOS scripting with PCC-based traffic distribution.',
    tech: ['MikroTik', 'RouterOS Script', 'Netwatch', 'BGP', 'OSPF'],
    metrics: ['4 ISP Links', '<30s Failover', 'Optimized Bandwidth'],
    featured: false, status: 'completed', color: '#b57bee', order: 4, github: '#',
  },
  {
    title: 'AWS Infrastructure Automation',
    category: 'DevOps',
    description: 'IaC project automating full AWS environment: VPCs, security groups, EC2 fleets, RDS instances, and CloudFront distributions.',
    tech: ['Terraform', 'AWS', 'GitHub Actions', 'Ansible', 'Bash', 'Python'],
    metrics: ['50+ AWS Resources', '< 10min Deployments', '40% Cost Reduction'],
    featured: true, status: 'completed', color: '#ff9800', order: 5, github: '#',
  },
  {
    title: 'AI Security Alert Classifier',
    category: 'AI/ML',
    description: 'ML model classifying SIEM alerts, reducing false positives by 60% using NLP and AWS Bedrock.',
    tech: ['AWS Bedrock', 'Python', 'FastAPI', 'React', 'MongoDB', 'Docker'],
    metrics: ['94% Accuracy', '60% FP Reduction', 'Real-time Processing'],
    featured: true, status: 'in-progress', color: '#ff4f9a', order: 6, github: '#',
  },
  {
    title: 'Linux Server Monitoring Dashboard',
    category: 'System Administration',
    description: 'Self-hosted monitoring for 20+ Linux servers with Prometheus, Grafana, and automated remediation.',
    tech: ['Prometheus', 'Grafana', 'Bash', 'Python', 'Docker', 'Ubuntu'],
    metrics: ['20+ Servers Monitored', '100+ Metrics', 'Real-time Alerts'],
    featured: false, status: 'completed', color: '#00e676', order: 7, github: '#',
  },
  {
    title: 'Pharmacy Analytics System',
    category: 'Full Stack',
    description: 'Complete pharmacy management: inventory, POS, prescriptions, analytics on MERN stack.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind', 'Chart.js'],
    metrics: ['2K+ Products Tracked', '15 Staff Users', 'Automated Reports'],
    featured: false, status: 'completed', color: '#ffd600', order: 8, github: '#',
  },
]

const CERTS = [
  { name: 'AWS AI Practitioner', abbr: 'AIF-C01', provider: 'AWS', status: 'earned', date: '2024', color: '#ff9800', order: 1 },
  { name: 'AWS Cloud Practitioner', abbr: 'CLF-C02', provider: 'AWS', status: 'earned', date: '2024', color: '#ff9800', order: 2 },
  { name: 'Microsoft SC-900', abbr: 'SC-900', provider: 'Microsoft', status: 'earned', date: '2023', color: '#4f8ef7', order: 3 },
  { name: 'Microsoft AZ-900', abbr: 'AZ-900', provider: 'Microsoft', status: 'earned', date: '2023', color: '#4f8ef7', order: 4 },
  { name: 'Kubernetes & Cloud Native Associate', abbr: 'KCNA', provider: 'Linux Foundation', status: 'earned', date: '2024', color: '#00e676', order: 5 },
  { name: 'Linux Foundation Certified Sysadmin', abbr: 'LFCS', provider: 'Linux Foundation', status: 'earned', date: '2023', color: '#00e676', order: 6 },
  { name: 'Kaspersky Endpoint Security Pro', abbr: 'KES', provider: 'Kaspersky', status: 'earned', date: '2023', color: '#00d4ff', order: 7 },
  { name: 'Kaspersky SD-WAN (004.2.1)', abbr: 'KSD', provider: 'Kaspersky', status: 'earned', date: '2023', color: '#00d4ff', order: 8 },
  { name: 'Kaspersky Hybrid Cloud Security', abbr: 'KHCS', provider: 'Kaspersky', status: 'earned', date: '2024', color: '#00d4ff', order: 9 },
  { name: 'Kaspersky Next EDR Foundations', abbr: 'KEDR', provider: 'Kaspersky', status: 'earned', date: '2024', color: '#00d4ff', order: 10 },
  { name: 'AWS Solutions Architect Associate', abbr: 'SAA-C03', provider: 'AWS', status: 'pursuing', date: '2025', color: '#ff9800', progress: 35, order: 11 },
  { name: 'CompTIA Security+', abbr: 'SY0-701', provider: 'CompTIA', status: 'pursuing', date: '2025', color: '#b57bee', progress: 20, order: 12 },
]

const LABS = [
  {
    title: 'AWS VPC Security Architecture Lab',
    category: 'AWS Labs', difficulty: 'Intermediate', duration: '3 hours',
    description: 'Production-grade AWS VPC with public/private subnets, NAT gateways, security groups, NACLs, and VPC Flow Logs.',
    tools: ['AWS VPC', 'EC2', 'NAT Gateway', 'Security Groups', 'CloudTrail'],
    takeaways: ['Defense-in-depth network segmentation', 'Least-privilege IAM configuration', 'Flow log analysis'],
    color: '#ff9800', featured: true, github: '#',
  },
  {
    title: 'Kubernetes Security Hardening Lab',
    category: 'Kubernetes Labs', difficulty: 'Advanced', duration: '4 hours',
    description: 'K8s cluster hardening: RBAC, Pod Security Standards, Network Policies, Secret encryption, Falco runtime detection.',
    tools: ['Kubernetes', 'Falco', 'OPA/Gatekeeper', 'Trivy', 'Helm'],
    takeaways: ['RBAC least-privilege design', 'Network policy segmentation', 'Runtime threat detection'],
    color: '#00e676', featured: true, github: '#',
  },
  {
    title: 'Docker Container Security Lab',
    category: 'Docker Labs', difficulty: 'Beginner', duration: '2 hours',
    description: 'Container security: image scanning, rootless containers, read-only filesystems, resource limits, secrets management.',
    tools: ['Docker', 'Trivy', 'Snyk', 'Docker Bench', 'Secrets Manager'],
    takeaways: ['Image vulnerability scanning', 'Rootless container config', 'Secrets management patterns'],
    color: '#4f8ef7', featured: false, github: '#',
  },
  {
    title: 'Linux Server Hardening Lab',
    category: 'Linux Labs', difficulty: 'Intermediate', duration: '3 hours',
    description: 'Ubuntu/RHEL hardening: SSH key management, fail2ban, SELinux/AppArmor, audit logging, CIS benchmark compliance.',
    tools: ['Ubuntu', 'SELinux', 'fail2ban', 'auditd', 'OpenSCAP'],
    takeaways: ['CIS benchmark implementation', 'Intrusion detection config', 'Compliance scanning'],
    color: '#00d4ff', featured: true, github: '#',
  },
  {
    title: 'SIEM Log Analysis & Threat Hunting',
    category: 'SIEM Labs', difficulty: 'Intermediate', duration: '2.5 hours',
    description: 'Splunk investigation: Windows Event Logs, correlation rules, threat hunting dashboards, MITRE ATT&CK mapping.',
    tools: ['Splunk', 'Windows Event Logs', 'Sysmon', 'MITRE ATT&CK'],
    takeaways: ['Threat hunting queries', 'Correlation rule creation', 'ATT&CK mapping'],
    color: '#b57bee', featured: true, github: '#',
  },
  {
    title: 'AI Security Alert Automation Lab',
    category: 'AI/ML Labs', difficulty: 'Advanced', duration: '5 hours',
    description: 'AI pipeline using AWS Bedrock to classify security alerts, prioritize threats, and trigger automated response playbooks.',
    tools: ['AWS Bedrock', 'Lambda', 'Python', 'PagerDuty API', 'Claude API'],
    takeaways: ['LLM-based threat classification', 'Automated remediation', 'Security orchestration'],
    color: '#ff4f9a', featured: true, github: '#',
  },
]

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing
    await Promise.all([
      Project.deleteMany({}),
      Certification.deleteMany({}),
      Lab.deleteMany({}),
    ])
    console.log('🗑️  Cleared existing data')

    // Insert new data
    await Project.insertMany(PROJECTS)
    console.log(`✅ Seeded ${PROJECTS.length} projects`)

    await Certification.insertMany(CERTS)
    console.log(`✅ Seeded ${CERTS.length} certifications`)

    await Lab.insertMany(LABS)
    console.log(`✅ Seeded ${LABS.length} labs`)

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@johnmuli.dev'
    const adminPass = process.env.ADMIN_PASSWORD || 'ChangeThisPassword!'
    const existingAdmin = await User.findOne({ email: adminEmail })

    if (!existingAdmin) {
      const hashed = await bcrypt.hash(adminPass, 12)
      await User.create({ email: adminEmail, password: hashed, role: 'admin' })
      console.log(`✅ Admin user created: ${adminEmail}`)
    } else {
      console.log(`ℹ️  Admin user already exists: ${adminEmail}`)
    }

    console.log('\n🎉 Database seeded successfully!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err)
    process.exit(1)
  }
}

seed()
