const fs = require("fs");
const path = require("path");

const projectData = {
  name: "Node-API Mastery Hub",
  tagline: "A Modular, Multi-Service API Ecosystem & Backend Framework",
  mission:
    "This project serves as a centralized hub for independent API services, built with a focus on clean architecture, modular documentation, and robust automation.",

  // Core Architecture
  corePrinciples: [
    {
      title: "🧩 Modular Documentation",
      description:
        "Each API module has its own dedicated Swagger endpoint, allowing for isolated testing and clear separation of concerns.",
    },
    {
      title: "🛡️ Strict Validation",
      description:
        "Request and response integrity is enforced via Zod schemas, which also serve as the source of truth for the OpenAPI documentation.",
    },
    {
      title: "🤖 Automated Workflows",
      description:
        "A centralized Cron Service handles background tasks like financial automation, ensuring data consistency without manual intervention.",
    },
  ],

  // API Systems with Swagger Links
  activeSystems: [
    {
      icon: "👤",
      name: "User Management System",
      docsPath: "/api-docs/users",
      description:
        "Handles identity, user profiles, and foundational security logic.",
      features: [
        "User CRUD operations",
        "Schema-based validation",
        "Modular route protection",
      ],
    },
    {
      icon: "💰",
      name: "Finance & Automation System",
      docsPath: "/api-docs/finances",
      description:
        "A high-performance engine for personal finance tracking and subscription automation.",
      features: [
        "Real-time Balance & Projection logic",
        "Automated Recurring Transaction Engine",
        "Advanced Pagination & Normalized Filtering",
      ],
    },
  ],

  structure: `
node-api-mastery
├── src
│   ├── modules       # 🚀 Feature-specific API systems
│   ├── core          # 🏗️ Framework backbone (Middlewares, Cron, Libs)
│   └── server.ts     # Main Entry Point & Swagger Routing
└── prisma            # Multi-model Database Management
    `.trim(),
};

const generateContent = () => {
  return `
# ${projectData.name}
> **${projectData.tagline}**



## 🎯 Project Vision
${projectData.mission}

---

## 🏗️ Core Architectural Principles
${projectData.corePrinciples.map((p) => `### ${p.title}\n${p.description}`).join("\n\n")}

---

## 📂 Integrated API Systems
Explore our specialized API modules through their dedicated interactive documentation:

${projectData.activeSystems
  .map(
    (sys) => `
### ${sys.icon} ${sys.name}
* **Description:** ${sys.description}
* **Interactive Docs:** [\`${sys.docsPath}\`](http://localhost:5000${sys.docsPath})
* **Key Features:**
${sys.features.map((f) => `  - ${f}`).join("\n")}
`,
  )
  .join("\n")}

---

## 🗺️ Future Expansion
- [ ] **E-Commerce Module** (\`/api-docs/shop\`)
- [ ] **Auth & OAuth Provider** (\`/api-docs/auth\`)
- [ ] **Notification Center** (\`/api-docs/notifications\`)

---

## 📂 Directory Structure
\`\`\`text
${projectData.structure}
\`\`\`

---

## 🚀 Quick Start
1. **Install:** \`npm install\`
2. **Database:** Update \`.env\` and run \`npx prisma migrate dev\`
3. **Launch:** \`npm run dev\`
4. **Test:** Navigate to any of the documentation links listed above.

---
**Developed by Özenç** | *Building scalable, document-first backend environments.*
    `.trim();
};

const readmePath = path.join(__dirname, "../README.md");

try {
  fs.writeFileSync(readmePath, generateContent());
  console.log("✅ [SUCCESS] README generated with Multi-Swagger support!");
} catch (error) {
  console.error("❌ [ERROR] Failed to generate README:", error);
}
