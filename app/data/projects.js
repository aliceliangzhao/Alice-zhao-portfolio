export const projects = {
  "simplifying-data-access": {
    slug: "simplifying-data-access",
    heroImage: "/img/sda/thumbnail.jpg",
    projectTitle: { main: "Simplifying data\naccess", sub: "Unifying 3 products into 1" },
    navTitle: "Simplifying data access: Unifying 3 endpoint products into 1",
    heroProblem: "Customers were managing storage infrastructure across three separate consoles by repeating the same setup tasks, with no unified way to access data stored in different storages. I led a cross-functional team of 10 to design a cohesive console experience that unified setup and access across all three services.",
    heroSolution: "Launched at {link:AWS re:Invent 2025}, the unified console experience cuts cross-service infrastructure setup to a single guided flow, allowing customers to scale access for large datasets in seconds.",
    externalLink: {
      url: "https://www.youtube.com/watch?v=NVZV0gfV-jA",
    },
    impact: "A unified console experience for infrastructure setup and data access across 3 storage services",
    type: "AWS",
    year: "2024",
    tags: ["Cloud infrastructure", "0 → 1"],
    metricsImage: "/img/sda/final-visual/createap.png",
    metrics: [
      { value: 34, suffix: "%", label: "Customers adoption" },
      { value: 90, suffix: "%", label: "Customer satisfaction rate" },
      { value: 194, suffix: "%", label: "MoM growth in 6 months" },
      { value: 79, suffix: "%", label: "Success rate" },
    ],
    sections: [
      {
        id: "problem",
        navLabel: "01  Who and why",
        heading: "01  Who and why.",
        content: {
          lead: "Two personas, three separate consoles, and constant context-switching revealed the need for a unified data access experience.",
          subsections: [
            { label: "Research", text: "I synthesized 6 customer calls, 3 sales calls, and 30+ survey responses to map two personas, their journeys, and their core pain points.", images: [{ src: "/img/sda/problem/research.jpg", alt: "Research synthesis" }] },
            { label: "Target personas", text: "Storage admins spend too much on third-party integrations and duplicate data just to connect services. Developers repeat identical tasks across consoles because there is no unified way to access data.", images: [{ src: "/img/sda/problem/userjourneymap.jpg", alt: "Target personas" }] },
            { label: "Pain points", text: "No unified view of access points across storage services, no way to create access points connecting to file systems from the console, and constant page-hopping to view and manage resources.", images: [{ src: "/img/sda/problem/painpoint.jpg", alt: "Pain points analysis" }] },
          ],
        },
      },
      {
        id: "scoping",
        navLabel: "02 Product scoping",
        heading: "02 Product scoping.",
        content: {
          lead: "I mapped the user journey into prioritized stories that drove a scope decision: what ships at launch vs. what waits. This aligned the team on the three flows that mattered most.",
          subsections: [
            { label: "User stories", text: "The full story map exposed 20+ user needs across three services. This gave the team a shared view of the full scope and allow us to draw launch boundary.", images: [{ src: "/img/sda/product-scoping/userstories.jpg", alt: "User stories" }] },
            { label: "User flows", text: "I mapped each priority flow end-to-end, illustrating how each flow fits into the overall experience.", images: [{ src: "/img/sda/product-scoping/userflow.jpg", alt: "User flows" }] },
          ],
        },
      },
      {
        id: "design-iteration",
        navLabel: "03 Design iteration",
        heading: "03 Design iteration.",
        content: {
          lead: "Internal testing exposed a critical flaw: stringing multiple API calls caused partial failures with no clear recovery path. I advocated for a UX pattern that surfaces all required steps during creation, resolving both the usability and durability issues. Follow-up testing validated the pattern.",
          subsections: [
            { label: "Exploration", text: "During internal testing, the creation flow broke mid-way when one API in the chain failed. Customers found it frustrating that they lost their input and had no way to tell what succeeded and what didn't.", images: [{ src: "/img/sda/design-iteration/exploration.jpg", alt: "Exploration" }] },
            { label: "Trade-offs", text: "The original sequential flow was simpler to build but fragile. Surfacing all steps upfront added complexity to the UI, but gave customers a clear picture of what was required and let the service call one API at a time.", images: [{ src: "/img/sda/design-iteration/tradeoff.jpg", alt: "Trade-offs" }] },
            { label: "Decision", text: "I pushed for a pattern that displays the full list of required steps during creation. Each API call runs independently, so a single failure doesn't cascade. Follow-up testing proved the pattern was clear and robust.", images: [{ src: "/img/sda/design-iteration/decision.jpg", alt: "Decision" }] },
          ],
        },
      },
      {
        id: "outcome",
        navLabel: "04 Outcome",
        heading: "04 Outcome",
        headingAlign: "center",
        summary: "A unified console for customers to set up and manage cloud infrastructure across three storage services.",
        content: [
          {
            subheading: "Streamlined infrastructure setup",
            text: "Storage admins can now set up their infrastructure directly within the AWS console. No more third-party applications needed.",
            images: [
              { src: "/img/sda/final-visual/createap.png", alt: "Infrastructure setup console" },
              { src: "/img/sda/final-visual/createreviewap.png", alt: "Storage service configuration" },
            ],
          },
          {
            subheading: "Unified data operations",
            text: "Developers can now view and manage all the data operations and security-related tasks in a single console. No more switching among storage services.",
            images: [
              { src: "/img/sda/final-visual/fsxlist.png", alt: "Data operations dashboard" },
              { src: "/img/sda/final-visual/fsxdetails.png", alt: "Security management console" },
              { src: "/img/sda/final-visual/outcome2.png", alt: "Security management console" },
            ],
          },
        ],
      },
    ],
    nextProject: "agent-opportunities",
  },

  "s3-tables": {
    slug: "s3-tables",
    heroImage: "/img/s3tables/thumbnail.jpg",
    detailImage: "/img/s3tables/top.jpg",
    projectTitle: { main: "AWS S3 Tables", sub: "0→1 in 8 weeks" },
    navTitle: "AWS S3 Tables: 0 → 1 in 8 weeks",
    heroProblem: "Customers were spending millions building and maintaining complex infrastructure for AI/ML workloads. I led a 20-person team to design S3 Tables, a new product {img:/img/s3tables/customers-inline-img/hero-text/000.jpg,/img/s3tables/customers-inline-img/hero-text/101.jpg,/img/s3tables/customers-inline-img/hero-text/102.jpg} to eliminate that complexity, from concept to launch in 8 weeks.",
    heroSolution: "S3 Tables, featured in {link:the 2024 AWS CEO keynote}, handles infrastructure automatically, providing a seamless console experience that lets teams turn big data into insights in seconds.",
    impact: "I led the UX of S3 Tables, a seamless console experience that turns big data into insights in seconds.",
    type: "AWS",
    year: "2024",
    tags: ["Design lead", "From concept to launch", "Cloud infrastructure"],
    metricsImage: "/img/s3tables/final-visual/newUI/tb-list.png",
    externalLink: {
      url: "https://www.youtube.com/watch?v=eztA5VYH2nM",
      cursor: "BIGGGGG launch of the year",
    },
    metrics: [
      { value: 500, suffix: "+ TB", label: "Data stored in 6 months" },
      { value: 20, suffix: "%", label: "Adoption rate WoW growth" },
      { value: 97, suffix: "%", label: "Integration opt-in rate" },
      { value: 85, suffix: "%", label: "Console CSAT" },
    ],
    sections: [
      {
        id: "problem",
        navLabel: "01  Who and why",
        heading: "01  Who and why.",
        content: {
          lead: "20+ interviews revealed that customers {img:/img/s3tables/customers-inline-img/netflix.jpg,/img/s3tables/customers-inline-img/bmw.jpg,/img/s3tables/customers-inline-img/mcdonlad.jpg,/img/s3tables/customers-inline-img/nasdaq.jpg,/img/s3tables/customers-inline-img/siemens.jpg,/img/s3tables/customers-inline-img/3m.jpg} don't want to store structured data in unstructured storage while maintaining custom infrastructure. They need a solution to streamline storage operations so teams can focus on data querying.",
          subsections: [
            { label: "Research", text: "I used internal AI tools to synthesize transcripts from 20+ enterprise customer interviews, and the outcome revealed who we are designing for and their respective pain points.", images:[{ src: "/img/s3tables/problem/research-process.png", alt: "Research", noBorder: true}]},
            { label: "Target personas", text: "Data engineers maintain storage systems daily. Strategic leads evaluate infrastructure costs and reliability.", images: [{ src: "/img/s3tables/problem/p-data-engineer.png", alt: "Data engineer persona", noBorder: true }, { src: "/img/s3tables/problem/p-strategic-lead.png", alt: "Strategic lead persona", noBorder: true }] },
            { label: "Pain points", text: "Millions wasted on custom infrastructure and integration with query engines, while no native way to keep structured data up-to-date.", images: [{ src: "/img/s3tables/problem/problem-1.png", alt: "Problem 1", noBorder: true }, { src: "/img/s3tables/problem/problem-2.png", alt: "Problem 2", noBorder: true }] },
            { label: "User journey", text: "I mapped the user journey into phases to surface the highest-friction tasks, guiding the team to align on priorities to act on.", images: [{ src: "/img/s3tables/problem/user-journey.png", alt: "User journey", noBorder: true }] },
          ],
        },
      },
      {
        id: "scoping",
        navLabel: "02 Product scoping",
        heading: "02 Product scoping.",
        content: {
          lead: "I adapted the AWS JTBD framework to give the team a shared language for strategic scope trade-offs. We categorized every user action and API details into 6 workflows and aligned on a launch plan in one week.",
          subsections: [
            { label: "JTBD Framework", text: "I first worked with the team to identify all user stories based on the JTBD framework, then mapped each story with its console steps, preconditions, and APIs to six groups: Create, List, View, Manage, Audit, and Delete.", images: [{ src: "/img/s3tables/scoping/JTBDframework.jpg", alt: "JTBD framework", noBorder: true }] },
            { label: "Action plan", text: "The framework allowed the team to align on a prioritized action plan with defined APIs, known limitations, and console impact, turning an ambiguous product space into a concrete roadmap.", images: [{ src: "/img/s3tables/scoping/scoping-graph.jpg", alt: "Action plan", noBorder: true }] },
          ],
        },
      },
      {
        id: "design-iteration",
        navLabel: "03 Design Iteration",
        heading: "03 Design Iteration.",
        content: {
          lead: "Integration across multiple services needs to be seamless. After testing three options, I persuaded the team to combine integration with table bucket creation as a default-on setting. 97% of customers never turned it off.",
          subsections: [
            { label: "Exploration", text: "I tested three integration models: a multi-step wizard that walked through each service, a fragmented approach with separate configuration pages, and a single-page create flow with integration built in.", images: [{ src: "/img/s3tables/design-iteration/s3table-iteration.jpg", alt: "Exploration" }] },
            { label: "Trade-offs", text: "The wizard added friction to what should feel instant. The fragmented model scattered a single decision across multiple pages. Customer research showed most users' end goal was querying, so bundling integration into table bucket creation matched their mental model.", images: [{ src: "/img/s3tables/design-iteration/s3table-iteration-tradeoffs.jpg", alt: "Trade-offs" }] },
            { label: "Decision", text: "I proposed combining integration into the create flow as a default-on checkbox. One click replaces what used to require configuring multiple services independently. The team aligned quickly once the testing data backed it up.", images: [{ src: "/img/s3tables/design-iteration/decision-new.png", alt: "Decision", noBorder: true }] },
          ],
        },
      },
      {
        id: "outcome",
        navLabel: "04 Outcome",
        heading: "04 Outcome",
        headingAlign: "center",
        summary: "S3 Tables, launched as the top announcement at AWS re:Invent 2024, gives customers structured data storage with built-in query support, eliminating million-dollar custom infrastructure.",
        content: [
          {
            subheading: "Unified data storage for AI/ML workloads",
            text: "The S3 Tables console enables customers to create, manage, and query structured data for analytics and AI/ML workloads in a few clicks, drastically simplifies the way customers manage their storage.",
            images: [
              { src: "/img/s3tables/final-visual/newUI/tb-list.png", alt: "S3 Tables bucket overview" },
              { src: "/img/s3tables/final-visual/newUI/tb-detail-l.png", alt: "S3 Table bucket detail page" },
            ],
          },
          {
            subheading: "Seamless Integration",
            text: "What previously required custom-built infrastructure is now handled automatically. Integration across multiple AWS services is reduced to a single click during table bucket creation.",
            images: [
              { src: "/img/s3tables/final-visual/newUI/create-l.png", alt: "Integration configuration" },
              { src: "/img/s3tables/final-visual/newUI/enable-l.png", alt: "Single-click integration" },
            ],
          },
          {
            subheading: "One click from data to insights",
            text: "Once created, customers manage their tables from a single console. Table bucket details, permission controls, and storage settings are all accessible without switching between services.",
            images: [
              { src: "/img/s3tables/final-visual/newUI/t-detail-l.png", alt: "Table management console" },
              { src: "/img/s3tables/final-visual/newUI/athena.png", alt: "Athena console" },
            ],
          },
          {
            subheading: "Biggest launch for S3",
            text: "S3 Tables launched at AWS re:Invent 2024, featured as the top announcement in AWS CEO's keynote.",
            images: [
              { src: "/img/s3tables/final-visual/ceo.png", alt: "re:Invent 2024 keynote" },
              { src: "/img/s3tables/final-visual/newUI/s3t-glam-shot.png", alt: "S3 Tables glam shot" },
            ],
          },
        ],
      },
    ],
    nextProject: "simplifying-data-access",
  },

  "agent-opportunities": {
    slug: "agent-opportunities",
    heroImage: "/img/ai-assistant/thumbnail.jpg",
    detailImage: "/img/ai-assistant/AWS Assistant.jpg",
    projectTitle: { main: "AWS agentic\nexperience", sub: "Purpose over services" },
    navTitle: "AWS agentic experience",
    // NOTE: content is real (from the user's raw thinking, structured like
    // s3-tables). Still PLACEHOLDER / pending review:
    //  - title / value statement (navTitle, projectTitle)
    //  - metrics: left empty on purpose (no real numbers yet -> bento hidden)
    //  - product name (Amazon Q vs. generic), timeline, team size
    //  - most subsections have no image yet; real screenshots to be added.
    //    Available: /img/ai-assistant/AWS Assistant-*.{png,jpg} (names have spaces).
    heroProblem: "The launched Amazon Q console needed to be more agentic and streamlined. Working from customer feedback, I partnered with product to find the workflows that would benefit most from an agentic flow, then designed an experience for two very different customers: new users exploring AWS, and power users who live in the terminal.",
    heroSolution: "The result is an agentic app layered on the existing console. A three-panel experience lets new customers work by purpose instead of by service, while power users keep their native terminal and gain a conversational layer that speeds up their workflows.",
    impact: "Transforming AWS console interactions from manual, service-driven workflows to purpose-driven, agent-driven experiences.",
    type: "AWS",
    year: "2025 - present",
    role: "Lead UX Designer",
    tags: ["AI", "0 → 1"],
    // metrics intentionally empty until real numbers are available.
    metrics: [],
    sections: [
      {
        id: "problem",
        navLabel: "01  Who and why",
        heading: "01  Who and why.",
        content: {
          lead: "Customer feedback on the launched Amazon Q console pointed to one gap: the experience was service-driven and manual when customers wanted it to be agentic and streamlined. I partnered with product to consolidate usage data and find the workflows that would benefit most from an agentic flow.",
          subsections: [
            { label: "Research", text: "I built a research knowledge base and used a research agent to pull from it alongside trustworthy external sources and internal persona reports. The agent generated a product requirement document that I reviewed and refined with the product team." },
            { label: "Target personas", text: "Two customer types shaped every decision. New and casual users want to state a purpose and explore AWS services through conversation. Power users live in the terminal and want conversational help layered on top, not a replacement." },
            { label: "Pain points", text: "The console was organized around services rather than intent, so customers had to know which service to use before they could start. Common workflows were manual and fragmented, with no agentic path to complete them end to end." },
          ],
        },
      },
      {
        id: "scoping",
        navLabel: "02 Product scoping",
        heading: "02 Product scoping.",
        content: {
          lead: "I turned the research into a shared product definition and a system design the team could build on, aligning product and engineering before any pixels were drawn.",
          subsections: [
            { label: "Requirement alignment", text: "I used the generated requirement document to align the product team on scope. We reviewed it, updated it, and agreed on what the agentic experience needed to do." },
            { label: "System design", text: "I partnered with engineering to draft and test the system design, making sure the backend was robust enough to support the expansion into an agentic experience." },
            { label: "Experience mapping", text: "I mapped the Amazon Q console layout in FigJam so the team could see how the agentic flow fit into the existing console." },
          ],
        },
      },
      {
        id: "design-iteration",
        navLabel: "03 Design Iteration",
        heading: "03 Design Iteration.",
        content: {
          lead: "The core challenge was serving two very different customers in one experience without splitting it into two products. I explored layouts with AI design tools and landed on a three-panel view that lets each customer type work the way they prefer.",
          subsections: [
            { label: "Planning", text: "I used the requirement document as the starting point and a planning skill to create design, product, and task documents. This gave the AI design tools the right context and clear next steps, which I reviewed to keep the plan aligned with the direction I had in mind." },
            { label: "Exploration", text: "Working with awscx-mcp and our internal design agent, I studied how each customer type wanted to work. New and casual users prefer to start on the left with a chat input, then move right to view, confirm, and manage the output. Power users prefer a hybrid of terminal and chat, mostly using the terminal for actions and chat for additional requests.", images: [{ src: "/img/ai-assistant/AWS Assistant-start.png", alt: "Casual user chat-first flow" }] },
            { label: "Decision", text: "I designed a three-panel view that serves both. The left panel is a terminal for calling APIs, collapsed by default. The middle is a chat panel for natural language. The right is a review panel showing the workflow steps, status, and outcome. I explored visual styles with AI, landed on the selected direction, and pushed straightforward changes as PRs into the gamma environment.", images: [{ src: "/img/ai-assistant/AWS Assistant-wCLI.png", alt: "Three-panel view with terminal, chat, and review" }] },
          ],
        },
      },
      {
        id: "outcome",
        navLabel: "04 Outcome",
        heading: "04 Outcome",
        headingAlign: "center",
        summary: "An intuitive agentic app that lives on top of the existing console, making AWS purpose-driven for newcomers and more efficient for power users.",
        content: [
          {
            subheading: "Purpose-driven, not service-driven",
            text: "New and casual customers can experiment with different AWS services simply by stating their purpose. The experience is organized around intent instead of services, so customers no longer need to know which service to use before they begin.",
            images: [
              { src: "/img/ai-assistant/AWS Assistant-start-noCLI.png", alt: "Purpose-driven chat and review experience" },
              { src: "/img/ai-assistant/AWS Assistant-finish.jpg", alt: "Completed purpose-driven workflow" },
            ],
          },
          {
            subheading: "A conversational layer for power users",
            text: "Power users keep the native terminal experience they rely on, now with an added conversational layer. They perform actions in the terminal and use chat for additional requests, completing their tasks more efficiently.",
            images: [
              { src: "/img/ai-assistant/AWS Assistant-wCLI.png", alt: "Terminal and chat hybrid for power users" },
            ],
          },
        ],
      },
    ],
    nextProject: "s3-tables",
  },
};

export const projectOrder = [
  "s3-tables",
  "simplifying-data-access",
  "agent-opportunities",
];

export function getProject(slug) {
  return projects[slug] || null;
}

export function getAllSlugs() {
  return Object.keys(projects);
}
