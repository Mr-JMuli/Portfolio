# John Muli — Cybersecurity & Cloud Engineer Portfolio

A production-ready, full-stack MERN portfolio positioning John Muli as a
Cybersecurity Professional, Cloud & Infrastructure Engineer, and upcoming AI Engineer.

---

## 🏗️ Architecture Overview

```
portfolio/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── sections/    # Hero, About, Skills, Projects, Labs, Certs, Experience, AI, Contact
│   │   │   ├── ui/          # Badge, GlowDot, SectionLabel, Modal, Terminal
│   │   │   └── layout/      # Nav, Footer
│   │   ├── data/
│   │   │   └── portfolio.js # All static content / fallback data
│   │   ├── hooks/           # useTypewriter, useInView, useProjects
│   │   └── utils/           # api.js, seo.js, animations.js
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/               # Node.js + Express backend
│   ├── models/           # Mongoose schemas (Project, Lab, Cert, Message, User, Blog)
│   ├── routes/           # projects, labs, certs, contact, auth, blog, admin
│   ├── middleware/       # auth.js, rateLimit.js, upload.js
│   ├── controllers/      # Business logic separated from routes
│   ├── config/           # db.js, cloudinary.js
│   └── seed/             # seed.js — initial data population
│
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)
- npm or pnpm

### 1. Clone & Install

```bash
git clone https://github.com/johnmuli/portfolio.git
cd portfolio

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Environment Variables

**server/.env**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
# Or use Atlas: mongodb+srv://user:pass@cluster.mongodb.net/portfolio

JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Admin credentials (for initial setup)
ADMIN_EMAIL=admin@yourportfolio.dev
ADMIN_PASSWORD=YourStrongPassword123!

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Optional: Email notifications via SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxx
SENDGRID_FROM=noreply@yourportfolio.dev
CONTACT_TO=john.muli@email.com

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SITE_URL=http://localhost:5173
```

### 3. Run Development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Visit: http://localhost:5173

---

## 🛠️ Tech Stack

| Layer       | Tech                                              |
|-------------|---------------------------------------------------|
| Frontend    | React 18, Vite, Framer Motion, Lucide React       |
| Styling     | Tailwind CSS, Custom CSS Variables                |
| Backend     | Node.js, Express.js                               |
| Database    | MongoDB, Mongoose ODM                             |
| Auth        | JWT (jsonwebtoken, bcryptjs)                      |
| Security    | Helmet, express-rate-limit, CORS                  |
| Fonts       | Syne (headings), JetBrains Mono (code)            |

---

## 🔐 Security Features

- JWT authentication for admin CMS
- Rate limiting on all API endpoints (100 req/15min)
- Helmet security headers
- CORS origin whitelist
- Input validation and sanitization
- bcrypt password hashing (rounds: 12)
- Environment variable configuration
- No secrets in source code

---

## 📊 MongoDB Schemas

### Project
```javascript
{
  title, category, description, longDescription,
  tech: [String], metrics: [String],
  featured, status, github, liveUrl,
  imageUrl, architecture, color, order, tags,
  createdAt, updatedAt
}
```

### Lab
```javascript
{
  title, category, difficulty, duration, description,
  tools: [String],
  steps: [{ title, content, code, image }],
  takeaways: [String], prerequisites: [String],
  github, color, featured, tags
}
```

### Certification
```javascript
{
  name, abbr, provider, status, date,
  verifyUrl, description, color,
  badgeUrl, progress, order
}
```

### Message (Contact Form)
```javascript
{ name, email, subject, message, read, createdAt, ipAddress }
```

### BlogPost
```javascript
{
  title, slug, excerpt, content (Markdown),
  category, tags, published,
  coverImage, readTime, views,
  createdAt, updatedAt
}
```

---

## 🌐 API Endpoints

### Public
| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| GET    | /api/health             | Health check             |
| GET    | /api/projects           | List projects (filterable)|
| GET    | /api/projects/:id       | Get single project       |
| GET    | /api/labs               | List labs                |
| GET    | /api/certifications     | List certifications      |
| GET    | /api/blog               | List published posts     |
| GET    | /api/blog/:slug         | Get blog post            |
| POST   | /api/contact            | Submit contact form      |
| POST   | /api/auth/login         | Admin login              |

### Admin (JWT Required)
| Method | Endpoint                     | Description           |
|--------|------------------------------|-----------------------|
| POST   | /api/projects                | Create project        |
| PUT    | /api/projects/:id            | Update project        |
| DELETE | /api/projects/:id            | Delete project        |
| POST   | /api/labs                    | Create lab            |
| PUT    | /api/labs/:id                | Update lab            |
| DELETE | /api/labs/:id                | Delete lab            |
| POST   | /api/certifications          | Add certification     |
| PUT    | /api/certifications/:id      | Update certification  |
| GET    | /api/admin/messages          | View contact messages |
| PUT    | /api/admin/messages/:id/read | Mark message as read  |
| GET    | /api/stats                   | Dashboard stats       |

---

## 🚢 Deployment

### Option A — Vercel (Frontend) + Railway (Backend + MongoDB)

**Frontend (Vercel)**
```bash
cd client
npm run build
# Deploy dist/ to Vercel
# Set env: VITE_API_URL=https://your-api.railway.app/api
```

**Backend (Railway)**
```bash
# Connect GitHub repo
# Set all server/.env variables in Railway dashboard
# Railway auto-detects Node.js and runs npm start
```

### Option B — Single VPS (Ubuntu 22.04)

```bash
# Install dependencies
sudo apt update && sudo apt install -y nodejs npm nginx certbot

# Install PM2
sudo npm install -g pm2

# Clone and setup
git clone https://github.com/johnmuli/portfolio.git /var/www/portfolio
cd /var/www/portfolio

# Backend
cd server && npm install --production
pm2 start index.js --name portfolio-api
pm2 save && pm2 startup

# Frontend build
cd ../client
npm install && npm run build
# Copy dist/ to /var/www/html/

# Nginx config
sudo nano /etc/nginx/sites-available/portfolio
# (see nginx.conf below)

# SSL
sudo certbot --nginx -d yourdomain.com
```

**nginx.conf**
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/html;
    index index.html;

    # Frontend — React SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

### Option C — Docker Compose

```yaml
# docker-compose.yml
version: "3.8"
services:
  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  api:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/portfolio
      - JWT_SECRET=${JWT_SECRET}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
    depends_on:
      - mongo
    restart: unless-stopped

  client:
    build: ./client
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://api:5000/api
    depends_on:
      - api
    restart: unless-stopped

volumes:
  mongo_data:
```

```bash
docker-compose up -d
```

---

## 🔍 SEO Configuration

The portfolio includes:
- `<title>` and `<meta description>` per section
- Open Graph tags (og:title, og:description, og:image)
- Twitter Card metadata
- JSON-LD Schema.org Person markup
- Sitemap generation (add `vite-plugin-sitemap`)
- robots.txt
- Semantic HTML5 structure
- Aria labels for accessibility

**Target Keywords (naturally distributed):**
Cybersecurity Engineer, Cloud Engineer, ICT Administrator, Systems Administrator,
DevOps Engineer, AWS Cloud Engineer, Linux Administrator, Security Analyst, SOC Analyst,
Infrastructure Engineer, Microsoft 365 Administrator, Kubernetes Engineer, AI Engineer,
MERN Stack Developer, Nairobi Cybersecurity Engineer, Kenya Cloud Engineer

---

## 📱 Performance Optimizations

- Vite code splitting & lazy loading
- Image optimization with WebP
- React.memo on static sections
- Intersection Observer for animations
- Canvas particle system with RAF cleanup
- CSS-only animations where possible
- MongoDB indexing on category, featured, createdAt

---

## 🎨 Design System

| Token          | Value                        |
|----------------|------------------------------|
| Primary Color  | #00d4ff (Cyber Cyan)         |
| Secondary      | #4f8ef7 (Cloud Blue)         |
| Success        | #00e676 (Terminal Green)     |
| Warning        | #ffd600 (Gold)               |
| Danger         | #ff4f9a (Alert Pink)         |
| Background     | #050814 (Deep Space)         |
| Heading Font   | Syne (800 weight)            |
| Code Font      | JetBrains Mono               |
| Body Font      | Inter / System Sans          |

---

## 📄 License

MIT — John Muli Portfolio 2025
