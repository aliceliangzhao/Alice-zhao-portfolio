export const intro = {
  lead: "Currently leading the UX of AWS S3 and exploring the future of AWS agentic experience.",
  muted: "Previously built design systems and enterprise applications at Morgan Stanley, Siemens, and the National Science Foundation.",
};

export const bio = {
  heading: "I'm Alice (Liang) Zhao, a UX Lead at AWS, where I work on the storage agentic experiences. I enjoy turning complex products and technologies into intuitive and customer-focused experience.",
  personal: "Outside of work, I love to explore nature and capture everyday moments through photography.",
  image: "/img/aboutMe/alice-liang.jpg",
};

export const workExperience = [
  {
    time: "Sep 2020 — present",
    title: "Lead UX Designer",
    company: "Amazon Web Services",
    description: "Designing AI-native experiences for AWS storage services. Launched 40+ features in 4 years, including 4 products from concept to launch.",
    selectedWork: [
      { name: "AWS S3 Tables", href: "/projects/s3-tables" },
      { name: "Simplifying data access", href: "/projects/simplifying-data-access" },
      { name: "AWS agentic experience", href: "#" },
      { name: "Multi-Region Access Point failover control", href: "https://aws.amazon.com/blogs/aws/new-failover-controls-for-amazon-s3-multi-region-access-points/", thumb: "/img/external/mrap-failover.png" },
      { name: "Support 1 million buckets per account", href: "https://aws.amazon.com/about-aws/whats-new/2024/11/amazon-s3-up-1-million-buckets-per-aws-account/"},
    ],
  },
  {
    time: "Jan 2020 — Sep 2020",
    title: "Sr. UX Designer",
    company: "Morgan Stanley",
    description: " Led design across 20+ wealth management projects, unifying complex financial workflows into a cohesive experience. Reimagined the wealth management product ecosystem serving ~300,000 users and $1.3T in assets under management. Built design systems used by 50+ designers across four global orgs, contributing to a 14% adoption increase in three months.",
    selectedWork: [
      { name: "E*Trade integration", href: "https://www.morganstanley.com/press-releases/morgan-stanley-closes-acquisition-of-e-trade" },
      { name: "Wealth management toolkit", href: "https://www.morganstanley.com/press-releases/morgan-stanley-wealth-management-launches-racial-equity-investin" },
    ],
  },
  {
    time: "Feb 2017 — Dec 2019",
    title: "UX Designer",
    company: "Insperity",
    description: "Established the Axure Pattern Library for the IT & Application department and launched 5 major products in the HR Suite in 3 years, generating ~$15M in revenue and ~140% increase in product adoption. Optimized a 600+ page marketing ecosystem using data-informed insights, driving a 253% increase in customer engagement and a unified design system that reduced cross-functional development effort by three months.",
    selectedWork: [
      { name: "Insperity HR 360 Suite", href: "https://www.insperity.com/our-products/hr360/" },
    ],
  },
  {
    time: "Aug 2016 — Jan 2017",
    title: "UX Designer",
    company: "Siemens",
    description: "Established the design language for Active Workspace, creating centralized UX standards and templates that unified the experience across multidisciplinary teams.",
    selectedWork: [
      { name: "PLM softward-Active Workspace", href: "#" },
    ],
  },
  {
    time: "Sep 2014 — May 2016",
    title: "UX Designer",
    company: "Purdue University",
    description: "Partnered with the National Science Foundation to design and prototype a nationwide research portal, translating complex academic workflows into intuitive digital experiences.",
    selectedWork: [
      { name: "National Science Foundation research portal", href: "https://www.researchgate.net/publication/304360109_Designing_for_STEM_Faculty_The_Use_of_Personas_for_Evaluating_and_Improving_Design" },
    ],
  },
];

export const designPhilosophy = {
  heading: "My design philosophy is rooted in simplifying complexity into intuitive and meaningful experiences. Since 2024, I've fully integrated AI into my workflow to rapidly explore, prototype, test, and validate ideas with exceptional speed and efficiency.",
};

export const processSteps = [
  {
    id: "01",
    title: "Discover",
    description: "Research agents collect and cross-reference competitive analysis, user feedback, and internal data from multiple sources, cutting weeks of manual synthesis to hours. Findings are distilled into a structured one-pager covering problem, opportunity, and success metrics.",
    tools: [
      { name: "Internal research agent", icon: "Bedrock" },
      { name: "AWS Quick Suite", icon: "Nova" },
      { name: "AWS Builder MCP", icon: "MCP" },
      { name: "Claude", icon: "Claude" },
    ],
  },
  {
    id: "02",
    title: "Define",
    description: "Working with stakeholders to distill the problem, align on scope, and lock success metrics. Meeting agents surface key decision points across feedback channels and draft problem framings, so alignment conversations start from evidence, not assumptions.",
    tools: [
      { name: "AWS Quick Suite", icon: "Nova" },
      { name: "Figjam", icon: "Figma" },
      { name: "Internal meeting agent", icon: "Bedrock" },
    ],
  },
  {
    id: "03",
    title: "Prototype",
    description: "Use AI tools like Claude Code to build working prototypes with real data. Agents pull from existing Figma designs via Figma MCP and ensure consistency with the AWS design system via its MCP. Use skills like Impeccable to refine visual.",
    tools: [
      { name: "Claude Code", icon: "ClaudeCode" },
      { name: "Kiro-cli", icon: "Kiro" },
      { name: "Impeccable skill", icon: "MCP" },
      { name: "Figma MCP", icon: "MCP" },
      { name: "Lobehub", icon: "LobeHub" },
    ],
  },
  {
    id: "04",
    title: "Test",
    description: "Work with researchers and research agents to generate test plans and run moderated and unmoderated usability sessions. Capture findings, tag severity, and feed insights directly back into Claude Code for iteration.",
    tools: [
      { name: "Internal testing agent", icon: "MCP" },
      { name: "Claude Code", icon: "ClaudeCode" },
    ],
  },
  {
    id: "05",
    title: "Ship",
    description: "Hand off to engineers with documented specs, or push production-ready code directly. Code review agents catch bugs and accessibility issues before merge, and documentation is auto-generated from the working prototype.",
    tools: [
      { name: "Claude Code", icon: "MCP" },
      { name: "Kiro-cli", icon: "Kiro" },
      { name: "GitHub", icon: "Github" },
    ],
  },
];

export const toolsHeading = "My design toolkit";

export const tools = [
  { name: "Claude Code", description: "I use Claude Code to build and iterate on working prototypes, turning design decisions and feedback into real product efficiently." },
  { name: "Codex", description: "I use Codex to make targeted comments on the working prototype then fine tune the design details in real time." },
  { name: "Github", description: "I use GitHub to manage branches, review code, and ship through CI/CD." },
  { name: "Impeccable skill", description: "I use Impeccable to catch design anti-patterns and refine spacing, typography, and visual polish across prototypes, so AI-generated UI reaches production quality faster." },
  { name: "Bedrock", description: "I design for Bedrock-powered experiences at AWS, shaping how customers build and deploy generative AI applications." },
  { name: "Figma/Figjam", description: "My primary design tool for user flows, wireframes, and design systems. Figjam is where most of my thinking starts." },
  { name: "OpenRouter", description: "A unified API I use to access multiple LLMs through one interface, making it easy to compare model outputs." },
  { name: "LobeHub", description: "I use LobeHub to organize and coordinate multiple AI agents into a unified workflow, so I can manage research, prototyping, and testing agents from a single platform."},
  { name: "ZenMux", description: "I don't use it, I just think the logo is cute, so why not put it here ;)" },
  { name: "AWS Service Suite", description: "I use AWS S3, Lambda, DynamoDB, IAM, and other services to build a complete product system." },
  { name: "Adobe", description: "I sometimes use Illustrator and After Effect for visual asset creation, motion editing, and detailed illustration work." },
  { name: "And so much more..", description: "Never stop learning." },
];
