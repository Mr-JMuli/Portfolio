import { useState, useEffect, useRef, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const personal = {
  name: "John Muli",
  tagline: "Securing Systems. Architecting the Future.",
  email: "jmuli866@gmail.com",
  location: "Nairobi, Kenya",
  github: "https://github.com/Mr-JMuli",
  linkedin: "https://www.linkedin.com/in/john-muli/",
  availableForWork: true,
  titles: [
    "Cybersecurity Engineer",
    "Cloud & Infrastructure Engineer",
    "System Administrator",
    "DevOps Enthusiast",
    "AI Practitioner",
    "MERN Stack Developer",
  ],
};

const skills = [
  {
    category: "Cybersecurity",
    icon: "🛡️",
    color: "#00d4ff",
    bg: "rgba(0,212,255,0.08)",
    border: "rgba(0,212,255,0.25)",
    priority: 1,
    items: [
      { name: "Fortinet", level: 85 },
      { name: "Kaspersky EDR", level: 90 },
      { name: "SOC Monitoring", level: 80 },
      { name: "Security Hardening", level: 85 },
      { name: "IAM", level: 80 },
      { name: "SIEM / Splunk", level: 70 },
    ],
  },
  {
    category: "Cloud & Infrastructure",
    icon: "☁️",
    color: "#4f8ef7",
    bg: "rgba(79,142,247,0.08)",
    border: "rgba(79,142,247,0.25)",
    priority: 2,
    items: [
      { name: "AWS EC2 / S3", level: 80 },
      { name: "Microsoft 365", level: 90 },
      { name: "Azure / Entra ID", level: 75 },
      { name: "Cloud Security", level: 78 },
      { name: "IAM Policies", level: 82 },
      { name: "AWS Bedrock", level: 65 },
    ],
  },
  {
    category: "Linux & Systems",
    icon: "🖥️",
    color: "#00e676",
    bg: "rgba(0,230,118,0.08)",
    border: "rgba(0,230,118,0.25)",
    priority: 3,
    items: [
      { name: "Linux Admin", level: 90 },
      { name: "Active Directory", level: 88 },
      { name: "Windows Server", level: 87 },
      { name: "Backup Systems", level: 85 },
      { name: "System Monitoring", level: 82 },
    ],
  },
  {
    category: "Networking",
    icon: "🌐",
    color: "#b57bee",
    bg: "rgba(181,123,238,0.08)",
    border: "rgba(181,123,238,0.25)",
    priority: 4,
    items: [
      { name: "MikroTik", level: 85 },
      { name: "Ubiquiti", level: 80 },
      { name: "CISCO", level: 90 },
      { name: "VPNs", level: 82 },
      { name: "WAN Load Balancing", level: 78 },
    ],
  },
  {
    category: "DevOps & Automation",
    icon: "⚙️",
    color: "#ff9800",
    bg: "rgba(255,152,0,0.08)",
    border: "rgba(255,152,0,0.25)",
    priority: 5,
    items: [
      { name: "Docker", level: 78 },
      { name: "Kubernetes", level: 68 },
      { name: "Terraform", level: 65 },
      { name: "GitHub Actions", level: 72 },
      { name: "Bash Scripting", level: 85 },
    ],
  },
  {
    category: "AI & Machine Learning",
    icon: "🧠",
    color: "#ff4f9a",
    bg: "rgba(255,79,154,0.08)",
    border: "rgba(255,79,154,0.25)",
    priority: 6,
    items: [
      { name: "AI APIs", level: 72 },
      { name: "Prompt Engineering", level: 78 },
      { name: "AI Workflow Auto.", level: 68 },
      { name: "AWS SageMaker", level: 62 },
    ],
  },
  {
    category: "MERN Stack Dev",
    icon: "💻",
    color: "#ffd600",
    bg: "rgba(255,214,0,0.08)",
    border: "rgba(255,214,0,0.25)",
    priority: 7,
    items: [
      { name: "React.js", level: 80 },
      { name: "Node.js / Express", level: 78 },
      { name: "MongoDB", level: 75 },
      { name: "REST APIs", level: 82 },
      { name: "Tailwind CSS", level: 80 },
    ],
  },
];

const projects = [
  {
    id: 1,
    title: "SOC Monitoring Dashboard",
    category: "Cybersecurity",
    description:
      "Real-time SOC dashboard integrating SIEM alerts, threat intelligence feeds, and incident response workflows with live event streaming.",
    tech: ["Node.js", "MongoDB", "Splunk API", "React", "WebSockets", "Docker"],
    featured: true,
    metrics: ["10K+ Alerts Processed", "500+ Incidents Managed", "99.9% Uptime"],
    color: "#00d4ff",
  },
  {
    id: 2,
    title: "Cloud Security Monitoring Platform",
    category: "Cloud Infrastructure",
    description:
      "AWS-based CSPM tool that continuously scans for misconfigurations, unused IAM permissions, and S3 bucket policy violations with auto-remediation.",
    tech: ["AWS Lambda", "Python", "CloudWatch", "SNS", "DynamoDB", "Terraform"],
    featured: true,
    metrics: ["200+ Security Checks", "1K+ Resources Scanned", "Auto-Remediation"],
    color: "#4f8ef7",
  },
  {
    id: 3,
    title: "WISP Authentication & Billing",
    category: "Full Stack",
    description:
      "Enterprise hotspot authentication and billing platform for ISPs with MikroTik RouterOS integration, real-time bandwidth monitoring, and automated invoicing.",
    tech: ["MERN Stack", "MikroTik API", "JWT", "Stripe", "Redis", "Ubuntu"],
    featured: true,
    metrics: ["500+ Active Users", "99.8% Uptime", "Fully Automated Billing"],
    color: "#00e676",
  },
  {
    id: 4,
    title: "MikroTik WAN Load Balancer",
    category: "Networking",
    description:
      "Multi-ISP WAN load balancing and failover using MikroTik RouterOS scripting with PCC-based traffic distribution and automatic health monitoring.",
    tech: ["MikroTik", "RouterOS Script", "Netwatch", "BGP", "OSPF"],
    featured: false,
    metrics: ["4 ISP Links", "<30s Failover", "Optimized Bandwidth"],
    color: "#b57bee",
  },
  {
    id: 5,
    title: "AWS Infrastructure Automation",
    category: "DevOps",
    description:
      "IaC project automating full AWS environment provisioning: VPCs, security groups, EC2 fleets, RDS instances, and CloudFront distributions.",
    tech: ["Terraform", "AWS", "GitHub Actions", "Ansible", "Bash", "Python"],
    featured: true,
    metrics: ["50+ AWS Resources", "< 10min Deployments", "40% Cost Reduction"],
    color: "#ff9800",
  },
  {
    id: 6,
    title: "AI Security Alert Classifier",
    category: "AI/ML",
    description:
      "ML model classifying security alerts from SIEM systems, reducing false positives by 60% using NLP and historical incident correlation via AWS Bedrock.",
    tech: ["AWS Bedrock", "Python", "FastAPI", "React", "MongoDB", "Docker"],
    featured: true,
    metrics: ["94% Accuracy", "60% False Positive Reduction", "Real-time Processing"],
    color: "#ff4f9a",
  },
  {
    id: 7,
    title: "Linux Server Monitoring Dashboard",
    category: "System Administration",
    description:
      "Self-hosted monitoring system for 20+ Linux servers with real-time dashboards, threshold alerting, and automated remediation scripts.",
    tech: ["Prometheus", "Grafana", "Bash", "Python", "Docker", "Ubuntu"],
    featured: false,
    metrics: ["20+ Servers Monitored", "100+ Metrics", "Real-time Alerts"],
    color: "#00e676",
  },
  {
    id: 8,
    title: "Pharmacy Analytics System",
    category: "Full Stack",
    description:
      "Full-featured pharmacy management system with inventory tracking, prescription management, sales analytics, and automated reorder alerts.",
    tech: ["React", "Node.js", "MongoDB", "Express", "Tailwind", "Chart.js"],
    featured: false,
    metrics: ["2K+ Products Tracked", "15 Staff Users", "Automated Reports"],
    color: "#ffd600",
  },
];

const certifications = [
  { name: "AWS AI Practitioner", abbr: "AIF-C01", provider: "AWS", status: "earned", color: "#ff9800", year: "2024" },
  { name: "AWS Cloud Practitioner", abbr: "CLF-C02", provider: "AWS", status: "earned", color: "#ff9800", year: "2024" },
  { name: "Microsoft SC-900", abbr: "SC-900", provider: "Microsoft", status: "earned", color: "#4f8ef7", year: "2023" },
  { name: "Microsoft AZ-900", abbr: "AZ-900", provider: "Microsoft", status: "earned", color: "#4f8ef7", year: "2023" },
  { name: "KCNA", abbr: "KCNA", provider: "Linux Foundation", status: "earned", color: "#00e676", year: "2024" },
  { name: "LFCS", abbr: "LFCS", provider: "Linux Foundation", status: "earned", color: "#00e676", year: "2023" },
  { name: "Kaspersky KES Pro", abbr: "KES", provider: "Kaspersky", status: "earned", color: "#00d4ff", year: "2023" },
  { name: "Kaspersky SD-WAN", abbr: "KSD", provider: "Kaspersky", status: "earned", color: "#00d4ff", year: "2023" },
  { name: "Kaspersky Hybrid Cloud", abbr: "KHCS", provider: "Kaspersky", status: "earned", color: "#00d4ff", year: "2024" },
  { name: "Kaspersky Next EDR", abbr: "KEDR", provider: "Kaspersky", status: "earned", color: "#00d4ff", year: "2024" },
  { name: "AWS Solutions Architect", abbr: "SAA-C03", provider: "AWS", status: "pursuing", color: "#ff9800", year: "2025" },
  { name: "CompTIA Security+", abbr: "SY0-701", provider: "CompTIA", status: "pursuing", color: "#b57bee", year: "2025" },
];

const experience = [
  {
    role: "IT Officer",
    company: "Malibu Pharmacy",
    period: "2024 — Present",
    location: "Nairobi, Kenya",
    highlights: [
      "Managed complete ICT infrastructure for multi-branch pharmacy chain",
      "Deployed Kaspersky EDR across 30+ endpoints — zero security incidents",
      "Implemented Microsoft 365 tenant with Entra ID, Exchange Online and SharePoint",
      "Built MikroTik WAN load balancing with 4-ISP failover — 99.8% uptime",
      "Deployed and maintained CCTV systems across all branches with remote access",
    ],
    tech: ["Microsoft 365", "MikroTik", "Kaspersky", "Linux", "MERN Stack", "CCTV"],
    color: "#00d4ff",
  },
  {
    role: "IT Lead Consultant",
    company: "Techsavvy Experts",
    period: "2021 — 2023",
    location: "Nairobi, Kenya",
    highlights: [
      "Led ICT consulting engagements across SME and enterprise clients in Nairobi",
      "Designed and deployed network infrastructure for 10+ client organizations",
      "Implemented wireless hotspot authentication systems for ISP clients",
      "Delivered cybersecurity assessments and remediation roadmaps",
      "Managed cloud migrations to Microsoft 365 for 5 client organizations",
    ],
    tech: ["Network Design", "Microsoft 365",  "Security Assessment"],
    color: "#4f8ef7",
  },
  {
    role: "IT Administrator",
    company: "FEP Sacco",
    period: "2019 — 2021",
    location: "Nairobi, Kenya",
    highlights: [
      "Administered Active Directory for 150+ users across numerous office locations",
      "Managed Windows Server 2012 R2: DNS, DHCP, File Services",
      "Implemented VLAN network segmentation for financial data security compliance",
      "Deployed endpoint security solution — reduced malware incidents by 80%",
      "Administered Suse enterprise Linux servers for internal applications and services",
      "Administered Orbit R core banking system",
    ],
    tech: ["Active Directory", "Windows Server", "SQL Server", "VLAN", "Endpoint Security"],
    color: "#00e676",
  },
  {
    role: "IT Intern",
    company: "KWFT Bank",
    period: "2017 — 2018",
    location: "Nairobi, Kenya",
    highlights: [
      "Provided technical support for banking operations across branch network",
      "Assisted with hardware maintenance and enterprise software deployments",
      "Supported network operations and troubleshooting",
    ],
    tech: ["IT Support", "Network Troubleshooting", "Hardware Maintenance"],
    color: "#b57bee",
  },
];

const labs = [
  {
    title: "AWS VPC Security Architecture",
    category: "AWS Labs",
    difficulty: "Intermediate",
    duration: "3 hrs",
    description: "Production-grade AWS VPC with public/private subnets, NAT gateways, security groups, NACLs, and VPC Flow Logs for threat detection.",
    tools: ["AWS VPC", "EC2", "NAT Gateway", "Security Groups", "CloudTrail"],
    color: "#ff9800",
  },
  {
    title: "Kubernetes Security Hardening",
    category: "Kubernetes Labs",
    difficulty: "Advanced",
    duration: "4 hrs",
    description: "K8s cluster security hardening: RBAC, Pod Security Standards, Network Policies, Secret encryption, and Falco runtime threat detection.",
    tools: ["Kubernetes", "Falco", "OPA/Gatekeeper", "Trivy", "Helm"],
    color: "#00e676",
  },
  {
    title: "Docker Container Security",
    category: "Docker Labs",
    difficulty: "Beginner",
    duration: "2 hrs",
    description: "Container security fundamentals: image scanning, rootless containers, read-only filesystems, resource limits, and secrets management.",
    tools: ["Docker", "Trivy", "Snyk", "Docker Bench", "Secrets Manager"],
    color: "#4f8ef7",
  },
  {
    title: "Linux Server Hardening",
    category: "Linux Labs",
    difficulty: "Intermediate",
    duration: "3 hrs",
    description: "Ubuntu/RHEL hardening: SSH key management, fail2ban, SELinux/AppArmor, audit logging, firewall rules, and CIS benchmark compliance.",
    tools: ["Ubuntu", "SELinux", "fail2ban", "auditd", "OpenSCAP"],
    color: "#00d4ff",
  },
  {
    title: "SIEM Log Analysis & Threat Hunting",
    category: "SIEM Labs",
    difficulty: "Intermediate",
    duration: "2.5 hrs",
    description: "Real-world Splunk investigation: Windows Event Logs, correlation rules, threat hunting dashboards, and MITRE ATT&CK mapping.",
    tools: ["Splunk", "Windows Event Logs", "Sysmon", "MITRE ATT&CK"],
    color: "#b57bee",
  },
  {
    title: "AI Security Alert Automation",
    category: "AI/ML Labs",
    difficulty: "Advanced",
    duration: "5 hrs",
    description: "AI pipeline using AWS Bedrock to classify security alerts, prioritize threats, and trigger automated incident response playbooks.",
    tools: ["AWS Bedrock", "Lambda", "Python", "PagerDuty API", "Claude API"],
    color: "#ff4f9a",
  },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useTypewriter(texts, speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setIdx((i) => (i + 1) % texts.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed, pause]);

  return display;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Components ──────────────────────────────────────────────────────────────
function GlowDot({ color = "#00d4ff", size = 6, pulse = true }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size,
      borderRadius: "50%", background: color,
      boxShadow: pulse ? `0 0 8px ${color}` : "none",
      animation: pulse ? "pulse 2s ease-in-out infinite" : "none",
    }} />
  );
}

function Badge({ children, color = "#00d4ff" }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
      padding: "3px 10px", borderRadius: 20,
      background: color + "18", border: `1px solid ${color}40`,
      color: color, textTransform: "uppercase",
    }}>{children}</span>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
      <div style={{ width: 32, height: 2, background: "linear-gradient(90deg,#00d4ff,transparent)" }} />
      <span style={{ fontSize: 11, letterSpacing: "0.15em", color: "#00d4ff", textTransform: "uppercase", fontWeight: 700 }}>{children}</span>
    </div>
  );
}

function Nav({ active, setActive }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = ["About", "Skills", "Projects", "Labs", "Certifications", "Experience", "AI Vision", "Contact"];

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase().replace(" ", "-"))?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
    setMobileOpen(false);
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(5,8,20,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,212,255,0.1)" : "none",
      transition: "all 0.3s ease",
      padding: "0 32px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => scrollTo("hero")}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #00d4ff, #4f8ef7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#000",
          }}>JM</div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#fff", fontSize: 15 }}>john.muli</span>
        </div>

        <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="nav-desktop">
          {links.map((l) => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "6px 12px",
              fontSize: 13, fontWeight: 500, borderRadius: 6,
              color: active === l ? "#00d4ff" : "rgba(255,255,255,0.65)",
              transition: "color 0.2s",
            }}>{l}</button>
          ))}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} style={{
          display: "none", background: "none", border: "none", color: "#fff",
          fontSize: 22, cursor: "pointer",
        }} className="nav-mobile-btn">☰</button>
      </div>

      {mobileOpen && (
        <div style={{
          background: "rgba(5,8,20,0.98)", borderBottom: "1px solid rgba(0,212,255,0.15)",
          padding: "16px 32px",
        }}>
          {links.map((l) => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              display: "block", width: "100%", textAlign: "left",
              background: "none", border: "none", cursor: "pointer",
              padding: "10px 0", fontSize: 15, color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>{l}</button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

function HeroSection() {
  const typed = useTypewriter(personal.titles);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      o: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${p.o})`;
        ctx.fill();
      });
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,212,255,${0.08 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section id="hero" style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 32px", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <GlowDot color="#00e676" size={8} />
              <span style={{ fontSize: 12, letterSpacing: "0.15em", color: "#00e676", fontFamily: "'JetBrains Mono', monospace" }}>
                AVAILABLE FOR HIRE · NAIROBI, KENYA
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 800, lineHeight: 1.05, margin: "0 0 12px",
              fontFamily: "'Space Grotesk', sans-serif",
              background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {personal.name}
            </h1>

            <div style={{ height: 52, display: "flex", alignItems: "center", marginBottom: 24 }}>
              <span style={{
                fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 600,
                color: "#00d4ff", fontFamily: "'JetBrains Mono', monospace",
              }}>
                {typed}<span style={{ animation: "blink 1s step-end infinite", color: "#00d4ff" }}>|</span>
              </span>
            </div>

            <p style={{
              fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.6)",
              maxWidth: 540, marginBottom: 40,
            }}>
              Cybersecurity professional and cloud infrastructure engineer with 6+ years of enterprise ICT experience.
              Building secure, scalable systems across Linux, Microsoft 365, AWS, and MikroTik — while growing into
              AI engineering and cloud security.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Explore Projects", href: "projects", primary: true },
                { label: "View Labs", href: "labs", primary: false },
                { label: "Download Resume", href: "#resume", primary: false },
                { label: "Contact Me", href: "contact", primary: false },
              ].map((btn) => (
                <button key={btn.label} onClick={() => document.getElementById(btn.href)?.scrollIntoView({ behavior: "smooth" })} style={{
                  padding: "12px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  background: btn.primary ? "linear-gradient(135deg, #00d4ff, #4f8ef7)" : "transparent",
                  border: btn.primary ? "none" : "1px solid rgba(0,212,255,0.35)",
                  color: btn.primary ? "#000" : "#00d4ff",
                }}>
                  {btn.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
              {[
                { num: "6+", label: "Years Experience" },
                { num: "10", label: "Certifications" },
                { num: "20+", label: "Projects Delivered" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#00d4ff", fontFamily: "'Space Grotesk', sans-serif" }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Avatar / Visual */}
          <div style={{ position: "relative" }} className="hero-visual">
            <div style={{
              width: 280, height: 280, borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(79,142,247,0.15))",
              border: "1px solid rgba(0,212,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <div style={{
                width: 220, height: 220, borderRadius: "50%",
                background: "linear-gradient(135deg, #1a2a4a, #0d1a35)",
                border: "2px solid rgba(0,212,255,0.4)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                fontSize: 72, color: "#00d4ff",
              }}>
                <span>🛡️</span>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 8, letterSpacing: "0.1em", fontFamily: "monospace" }}>
                  CYBER · CLOUD · AI
                </div>
              </div>

              {/* Orbiting badges */}
              {["AWS", "K8s", "Linux", "M365"].map((t, i) => {
                const angle = (i / 4) * 360;
                const x = 140 + 148 * Math.cos((angle * Math.PI) / 180);
                const y = 140 + 148 * Math.sin((angle * Math.PI) / 180);
                return (
                  <div key={t} style={{
                    position: "absolute",
                    left: x - 22, top: y - 14,
                    background: "rgba(5,8,20,0.85)", border: "1px solid rgba(0,212,255,0.4)",
                    borderRadius: 6, padding: "4px 10px",
                    fontSize: 11, fontWeight: 700, color: "#00d4ff",
                    fontFamily: "monospace",
                  }}>{t}</div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}>
        <div style={{ width: 24, height: 40, border: "2px solid rgba(0,212,255,0.3)", borderRadius: 12, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 4 }}>
          <div style={{ width: 4, height: 8, background: "#00d4ff", borderRadius: 2, animation: "scrollDot 1.5s ease-in-out infinite" }} />
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
        @keyframes scrollDot { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(16px);opacity:0} }
        @media (max-width: 768px) { .hero-visual { display: none !important; } }
      `}</style>
    </section>
  );
}

function AboutSection() {
  const [ref, inView] = useInView();
  const timeline = [
    { year: "2017", event: "IT Internship at KWFT Bank", type: "start" },
    { year: "2018", event: "ICT Administrator, FEP Sacco", type: "work" },
    { year: "2020", event: "ICT Lead Consultant, Techsavvy Experts", type: "work" },
    { year: "2022", event: "ICT Officer, Malibu Pharmacy", type: "work" },
    { year: "2023", event: "MERN Stack Development Bootcamp", type: "education" },
    { year: "2024", event: "AWS & Kubernetes Certifications", type: "cert" },
    { year: "2025", event: "AI Engineering & Cloud Security", type: "future" },
  ];

  return (
    <section id="about" style={{ padding: "120px 32px", maxWidth: 1200, margin: "0 auto" }} ref={ref}>
      <SectionLabel>About</SectionLabel>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", margin: "12px 0 48px", color: "#fff" }}>
        The Engineer Behind the Systems
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-30px)", transition: "all 0.7s ease" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontSize: 15, marginBottom: 20 }}>
            I'm John Muli — a Nairobi-based Cybersecurity and Cloud Infrastructure engineer with over 6 years of hands-on enterprise ICT experience. My career has been defined by a relentless drive to secure, optimize, and modernize complex systems across diverse industries.
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontSize: 15, marginBottom: 20 }}>
            From deploying Kaspersky EDR solutions and designing MikroTik WAN load balancers to building Microsoft 365 environments and Linux server infrastructure — I've consistently worked at the intersection of <span style={{ color: "#00d4ff" }}>security, reliability, and performance</span>.
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontSize: 15, marginBottom: 32 }}>
            I expanded my toolkit through a MERN stack development bootcamp, and I'm now combining those software engineering skills with my infrastructure experience. My current focus is on <span style={{ color: "#4f8ef7" }}>cloud security, AI-powered automation</span>, and building platforms that make security operations more intelligent and efficient.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["Security-First Mindset", "Infrastructure at Scale", "Continuous Learning", "AI-Curious"].map((t) => (
              <Badge key={t} color="#00d4ff">{t}</Badge>
            ))}
          </div>
        </div>

        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(30px)", transition: "all 0.7s 0.2s ease" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 24, letterSpacing: "0.05em" }}>Career Timeline</h3>
          <div style={{ position: "relative", paddingLeft: 24 }}>
            <div style={{ position: "absolute", left: 7, top: 0, bottom: 0, width: 1, background: "rgba(0,212,255,0.2)" }} />
            {timeline.map((item, i) => {
              const c = item.type === "future" ? "#ff4f9a" : item.type === "cert" ? "#ffd600" : item.type === "education" ? "#b57bee" : "#00d4ff";
              return (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20, position: "relative" }}>
                  <div style={{
                    position: "absolute", left: -17, top: 4,
                    width: 10, height: 10, borderRadius: "50%",
                    background: c, boxShadow: `0 0 8px ${c}`,
                  }} />
                  <div style={{ fontSize: 11, color: c, fontFamily: "monospace", minWidth: 36, marginTop: 2 }}>{item.year}</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{item.event}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { #about > div:last-child { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function SkillsSection() {
  const [ref, inView] = useInView();
  const [activeSkill, setActiveSkill] = useState(null);

  return (
    <section id="skills" style={{ padding: "120px 32px", background: "rgba(255,255,255,0.02)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }} ref={ref}>
        <SectionLabel>Core Expertise</SectionLabel>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", margin: "12px 0 48px", color: "#fff" }}>
          Technical Stack & Skills
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {skills.map((skill, si) => (
            <div key={skill.category}
              onClick={() => setActiveSkill(activeSkill === si ? null : si)}
              style={{
                background: activeSkill === si ? skill.bg : "rgba(255,255,255,0.03)",
                border: `1px solid ${activeSkill === si ? skill.border : "rgba(255,255,255,0.08)"}`,
                borderRadius: 16, padding: 24, cursor: "pointer",
                transition: "all 0.3s ease",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${si * 0.08}s`,
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{skill.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: activeSkill === si ? skill.color : "rgba(255,255,255,0.85)" }}>
                    {skill.category}
                  </span>
                </div>
                <span style={{ fontSize: 10, color: skill.color, fontFamily: "monospace" }}>P{skill.priority}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {skill.items.slice(0, activeSkill === si ? undefined : 3).map((item) => (
                  <div key={item.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{item.name}</span>
                      <span style={{ fontSize: 11, color: skill.color, fontFamily: "monospace" }}>{item.level}%</span>
                    </div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 2,
                        background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
                        width: inView ? `${item.level}%` : "0%",
                        transition: "width 1s ease",
                        transitionDelay: `${si * 0.1 + 0.3}s`,
                      }} />
                    </div>
                  </div>
                ))}
                {skill.items.length > 3 && activeSkill !== si && (
                  <span style={{ fontSize: 11, color: skill.color, marginTop: 4 }}>+{skill.items.length - 3} more · click to expand</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const categories = ["All", ...new Set(projects.map((p) => p.category))];

  const filtered = projects.filter((p) => {
    const matchCat = filter === "All" || p.category === filter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tech.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <section id="projects" style={{ padding: "120px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>Featured Work</SectionLabel>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", margin: "12px 0 32px", color: "#fff" }}>
          Projects & Deployments
        </h2>

        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or tech..."
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8, padding: "10px 16px", color: "#fff", fontSize: 13, minWidth: 220,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
                background: filter === c ? "#00d4ff" : "rgba(0,212,255,0.08)",
                border: `1px solid ${filter === c ? "#00d4ff" : "rgba(0,212,255,0.2)"}`,
                color: filter === c ? "#000" : "#00d4ff",
              }}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {filtered.map((p) => (
            <div key={p.id} onClick={() => setSelected(p)} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: 28, cursor: "pointer",
              transition: "all 0.3s ease",
              borderLeft: `3px solid ${p.color}`,
              position: "relative", overflow: "hidden",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {p.featured && (
                <div style={{ position: "absolute", top: 16, right: 16 }}>
                  <Badge color="#ffd600">Featured</Badge>
                </div>
              )}
              <Badge color={p.color}>{p.category}</Badge>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: "12px 0 10px", lineHeight: 1.3 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 16 }}>{p.description}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {p.tech.map((t) => (
                  <span key={t} style={{
                    fontSize: 11, padding: "3px 8px", borderRadius: 4,
                    background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)", fontFamily: "monospace",
                  }}>{t}</span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {p.metrics.map((m) => (
                  <span key={m} style={{ fontSize: 11, color: p.color }}>✓ {m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selected && (
          <div onClick={() => setSelected(null)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
            zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 32,
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: "#0a0f1e", border: `1px solid ${selected.color}40`,
              borderRadius: 20, padding: 40, maxWidth: 560, width: "100%",
              borderLeft: `4px solid ${selected.color}`,
            }}>
              <Badge color={selected.color}>{selected.category}</Badge>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "12px 0 16px" }}>{selected.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 20 }}>{selected.description}</p>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: "0.1em" }}>TECHNOLOGIES</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selected.tech.map((t) => (
                    <span key={t} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: `${selected.color}15`, color: selected.color, border: `1px solid ${selected.color}30` }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: "0.1em" }}>KEY METRICS</div>
                {selected.metrics.map((m) => (
                  <div key={m} style={{ fontSize: 13, color: selected.color, marginBottom: 4 }}>→ {m}</div>
                ))}
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8, padding: "10px 20px", color: "#fff", cursor: "pointer", fontSize: 13,
              }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function LabsSection() {
  const diffColor = { Beginner: "#00e676", Intermediate: "#ffd600", Advanced: "#ff4f9a" };

  return (
    <section id="labs" style={{ padding: "120px 32px", background: "rgba(0,0,0,0.3)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>Hands-On Practice</SectionLabel>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", margin: "12px 0 16px", color: "#fff" }}>
          Interactive Labs
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 48, maxWidth: 540 }}>
          Real-world cybersecurity and cloud engineering labs with step-by-step walkthroughs, command references, and architecture diagrams.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {labs.map((lab, i) => (
            <div key={i} style={{
              background: "rgba(5,8,20,0.8)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, overflow: "hidden",
              transition: "border-color 0.3s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = `${lab.color}50`}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            >
              {/* Terminal header */}
              <div style={{
                background: "rgba(0,0,0,0.5)", padding: "10px 16px",
                display: "flex", alignItems: "center", gap: 8,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28ca41" }} />
                <span style={{ marginLeft: 8, fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                  {lab.category.toLowerCase().replace(" ", "_")}.sh
                </span>
              </div>

              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <Badge color={lab.color}>{lab.category}</Badge>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: diffColor[lab.difficulty] || "#fff" }}>● {lab.difficulty}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{lab.duration}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.4 }}>{lab.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 16 }}>{lab.description}</p>

                <div style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
                  $ tools: <span style={{ color: lab.color }}>{lab.tools.join(" · ")}</span>
                </div>

                <button style={{
                  background: `${lab.color}12`, border: `1px solid ${lab.color}30`,
                  borderRadius: 8, padding: "8px 16px", color: lab.color, fontSize: 12,
                  fontWeight: 600, cursor: "pointer",
                }}>
                  View Walkthrough →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificationsSection() {
  const earned = certifications.filter((c) => c.status === "earned");
  const pursuing = certifications.filter((c) => c.status === "pursuing");
  const providerColors = { AWS: "#ff9800", Microsoft: "#4f8ef7", "Linux Foundation": "#00e676", Kaspersky: "#00d4ff", CompTIA: "#b57bee" };

  return (
    <section id="certifications" style={{ padding: "120px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>Credentials</SectionLabel>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", margin: "12px 0 48px", color: "#fff" }}>
          Certifications & Badges
        </h2>

        <div style={{ display: "flex", gap: 16, marginBottom: 48, flexWrap: "wrap" }}>
          {[
            { num: earned.length, label: "Earned", color: "#00e676" },
            { num: pursuing.length, label: "In Progress", color: "#ffd600" },
            { num: [...new Set(certifications.map((c) => c.provider))].length, label: "Providers", color: "#00d4ff" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "20px 28px", textAlign: "center",
            }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.num}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>EARNED CERTIFICATIONS</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginBottom: 48 }}>
          {earned.map((cert) => {
            const c = providerColors[cert.provider] || "#00d4ff";
            return (
              <div key={cert.id} style={{
                background: "rgba(255,255,255,0.03)", border: `1px solid ${c}25`,
                borderRadius: 12, padding: 20, transition: "all 0.3s",
                cursor: "pointer",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${c}08`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${c}15`, border: `1px solid ${c}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: c, fontFamily: "monospace",
                  }}>{cert.abbr.slice(0, 3)}</div>
                  <span style={{ fontSize: 10, color: c, fontFamily: "monospace" }}>{cert.year}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.4, marginBottom: 4 }}>{cert.name}</div>
                <div style={{ fontSize: 11, color: c }}>{cert.provider}</div>
              </div>
            );
          })}
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>CURRENTLY PURSUING</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {pursuing.map((cert) => {
            const c = providerColors[cert.provider] || "#00d4ff";
            return (
              <div key={cert.id} style={{
                background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.15)",
                borderRadius: 12, padding: 20,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.35)", fontFamily: "monospace",
                  }}>{cert.abbr.slice(0, 3)}</div>
                  <Badge color="#ffd600">Pursuing</Badge>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", lineHeight: 1.4, marginBottom: 4 }}>{cert.name}</div>
                <div style={{ fontSize: 11, color: c }}>{cert.provider} · Target {cert.year}</div>
                <div style={{ marginTop: 12, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                  <div style={{ width: "35%", height: "100%", background: `linear-gradient(90deg, ${c}, ${c}66)`, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const [active, setActive] = useState(0);
  const curr = experience[active];

  return (
    <section id="experience" style={{ padding: "120px 32px", background: "rgba(255,255,255,0.02)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>Career History</SectionLabel>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", margin: "12px 0 48px", color: "#fff" }}>
          Professional Experience
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 40 }}>
          <div>
            {experience.map((exp, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                display: "block", width: "100%", textAlign: "left",
                background: active === i ? `${exp.color}10` : "transparent",
                border: "none", borderLeft: `3px solid ${active === i ? exp.color : "rgba(255,255,255,0.1)"}`,
                padding: "16px 20px", cursor: "pointer",
                transition: "all 0.2s", marginBottom: 4, borderRadius: "0 8px 8px 0",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: active === i ? "#fff" : "rgba(255,255,255,0.6)" }}>{exp.company}</div>
                <div style={{ fontSize: 12, color: active === i ? exp.color : "rgba(255,255,255,0.35)", marginTop: 2 }}>{exp.period}</div>
              </button>
            ))}
          </div>

          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, padding: 36,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>{curr.role}</h3>
                <div style={{ fontSize: 16, color: curr.color, marginTop: 4 }}>{curr.company}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{curr.period}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{curr.location}</div>
              </div>
            </div>

            <div style={{ height: 1, background: `linear-gradient(90deg, ${curr.color}40, transparent)`, margin: "20px 0" }} />

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
              {curr.highlights.map((h, i) => (
                <li key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <span style={{ color: curr.color, fontSize: 14, marginTop: 1 }}>→</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{h}</span>
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {curr.tech.map((t) => (
                <span key={t} style={{
                  fontSize: 12, padding: "4px 10px", borderRadius: 6,
                  background: `${curr.color}12`, color: curr.color, border: `1px solid ${curr.color}25`,
                }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { #experience > div > div:last-child { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function AIVisionSection() {
  const phases = [
    { phase: "Foundation ✓", status: "completed", color: "#00e676", items: ["AWS AI Practitioner", "Prompt Engineering", "AI APIs Integration", "LLM Fundamentals"] },
    { phase: "Application →", status: "current", color: "#ffd600", items: ["AWS Bedrock Projects", "Security AI Automation", "AI Workflow Integration", "RAG Systems"] },
    { phase: "Advanced ◎", status: "upcoming", color: "#ff4f9a", items: ["MLOps on AWS", "AI Security Research", "Custom Model Fine-tuning", "AI Red Teaming"] },
  ];

  const aiInterests = [
    { icon: "🔒", title: "AI Security", desc: "Using AI to detect threats, analyze logs, and automate incident response at scale." },
    { icon: "🤖", title: "LLM Integration", desc: "Building AI-powered internal tools and security automation workflows." },
    { icon: "☁️", title: "Cloud AI Services", desc: "AWS Bedrock, SageMaker, and Azure AI for enterprise-grade AI deployments." },
    { icon: "🧪", title: "Prompt Engineering", desc: "Designing effective prompts for security analysis, log parsing, and alert classification." },
  ];

  return (
    <section id="ai-vision" style={{ padding: "120px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>Future-Focused</SectionLabel>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", margin: "12px 0 16px", color: "#fff" }}>
          AI & Future Technologies
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 560, marginBottom: 60 }}>
          Actively learning AI engineering with a focus on AI-powered security operations, cloud AI services, and intelligent automation workflows.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 60 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 24 }}>Learning Roadmap</h3>
            <div style={{ position: "relative" }}>
              {phases.map((p, i) => (
                <div key={i} style={{
                  background: p.status === "current" ? `${p.color}08` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${p.status === "current" ? p.color + "40" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 12, padding: 20, marginBottom: 16,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: p.color, marginBottom: 12 }}>{p.phase}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {p.items.map((item) => (
                      <span key={item} style={{
                        fontSize: 12, padding: "4px 10px", borderRadius: 6,
                        background: `${p.color}10`, color: p.status === "current" ? p.color : "rgba(255,255,255,0.5)",
                        border: `1px solid ${p.color}20`,
                      }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 24 }}>AI Interests & Focus Areas</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {aiInterests.map((item) => (
                <div key={item.title} style={{
                  display: "flex", gap: 16,
                  background: "rgba(255,79,154,0.05)", border: "1px solid rgba(255,79,154,0.15)",
                  borderRadius: 12, padding: 16,
                }}>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#ff4f9a", marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terminal block */}
        <div style={{
          background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,212,255,0.2)",
          borderRadius: 16, overflow: "hidden", fontFamily: "monospace",
        }}>
          <div style={{ background: "rgba(0,0,0,0.4)", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28ca41" }} />
            <span style={{ marginLeft: 8, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>ai_journey.sh</span>
          </div>
          <div style={{ padding: 24, fontSize: 13, lineHeight: 2 }}>
            <div><span style={{ color: "#00e676" }}>$</span> <span style={{ color: "#4f8ef7" }}>aws bedrock</span> <span style={{ color: "rgba(255,255,255,0.4)" }}>invoke-model --model-id</span> <span style={{ color: "#ffd600" }}>anthropic.claude-3</span></div>
            <div><span style={{ color: "rgba(255,255,255,0.35)" }}># Classify security alert using AI...</span></div>
            <div><span style={{ color: "#00d4ff" }}>→ Threat Detected: </span><span style={{ color: "#ff4f9a" }}>Lateral Movement (MITRE T1021)</span></div>
            <div><span style={{ color: "#00d4ff" }}>→ Confidence: </span><span style={{ color: "#00e676" }}>94.2%</span></div>
            <div><span style={{ color: "#00d4ff" }}>→ Action: </span><span style={{ color: "#ffd600" }}>Isolating endpoint · Notifying SOC</span></div>
            <div style={{ marginTop: 8, color: "rgba(255,255,255,0.25)" }}>Process complete. AI-powered security response executed in 1.2s.</div>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { #ai-vision > div > div:first-of-type { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  return (
    <section id="contact" style={{ padding: "120px 32px", background: "rgba(0,0,0,0.3)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>Get In Touch</SectionLabel>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", margin: "12px 0 16px", color: "#fff" }}>
          Let's Build Something Secure
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 500, marginBottom: 60 }}>
          Open to cybersecurity roles, cloud infrastructure positions, and interesting consulting engagements. Based in Nairobi, available globally.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <div>
            <div style={{
              background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)",
              borderRadius: 16, padding: 32, marginBottom: 24,
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
                <GlowDot color="#00e676" size={8} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#00e676" }}>Available for new opportunities</span>
              </div>

              {[
                { icon: "📧", label: "Email", value: personal.email, href: `mailto:${personal.email}` },
                { icon: "📍", label: "Location", value: personal.location, href: "#" },
                { icon: "💻", label: "GitHub", value: "github.com/johnmuli", href: personal.github },
                { icon: "🔗", label: "LinkedIn", value: "linkedin.com/in/johnmuli", href: personal.linkedin },
              ].map((c) => (
                <a key={c.label} href={c.href} style={{
                  display: "flex", gap: 12, alignItems: "center", marginBottom: 16,
                  textDecoration: "none",
                }}>
                  <span style={{ fontSize: 18 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>{c.label}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{c.value}</div>
                  </div>
                </a>
              ))}
            </div>

            <button style={{
              width: "100%", background: "linear-gradient(135deg, #00d4ff, #4f8ef7)",
              border: "none", borderRadius: 10, padding: "14px 24px",
              color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>
              ⬇ Download Resume
            </button>
          </div>

          <div>
            {sent ? (
              <div style={{
                background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.3)",
                borderRadius: 16, padding: 40, textAlign: "center",
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: "#00e676", marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: "rgba(255,255,255,0.6)" }}>Thanks for reaching out. I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: 32,
              }}>
                {["name", "email"].map((field) => (
                  <div key={field} style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>{field}</label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
                        padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
                      padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none",
                      resize: "vertical", boxSizing: "border-box",
                    }}
                  />
                </div>
                <button onClick={handleSubmit} style={{
                  width: "100%", background: "linear-gradient(135deg, #00d4ff, #4f8ef7)",
                  border: "none", borderRadius: 10, padding: "14px 24px",
                  color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}>
                  Send Message →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { #contact > div > div:last-child { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      padding: "40px 32px",
      borderTop: "1px solid rgba(0,212,255,0.1)",
      textAlign: "center",
    }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
        © 2025 John Muli · Cybersecurity & Cloud Engineer · Nairobi, Kenya
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
        Built with React · MERN Stack · Designed for Security
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeNav, setActiveNav] = useState("Hero");

  useEffect(() => {
    document.title = "John Muli — Cybersecurity & Cloud Engineer | Nairobi";

    // Load fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{
      background: "#050814",
      color: "#fff",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, sans-serif",
      overflowX: "hidden",
    }}>
      {/* SEO-friendly meta description */}
      <div style={{ display: "none" }}>
        Cybersecurity Engineer, Cloud Infrastructure Engineer, ICT Systems Administrator, DevOps Engineer,
        AWS Cloud Engineer, Linux Administrator, SOC Analyst, Microsoft 365 Administrator, MERN Stack Developer,
        Nairobi Kenya Cloud Engineer, AI Engineer, Kubernetes Engineer
      </div>

      <Nav active={activeNav} setActive={setActiveNav} />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <LabsSection />
      <CertificationsSection />
      <ExperienceSection />
      <AIVisionSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
