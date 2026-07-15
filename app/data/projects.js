export const projects = {
  "simplifying-data-access": {
    slug: "simplifying-data-access",
    heroImage: "/img/sda/thumbnail.jpg",
    projectTitle: { main: "Simplifying data\naccess", sub: "Unifying 3 products into 1" },
    navTitle: "Simplifying data access: Unifying 3 endpoint products into 1",
    heroProblem: "Customers were managing storage infrastructure across three separate consoles by repeating the same setup tasks, with no unified way to access data stored in different storages. I led the UX for a cross-functional team of 10, designing a cohesive console experience that unified setup and access across all three services.",
    heroSolution: "Launched at {link:AWS re:Invent 2025}, the unified console experience cuts cross-service infrastructure setup to a single guided flow, allowing customers to scale access for large datasets in seconds.",
    externalLink: {
      url: "https://www.youtube.com/watch?v=NVZV0gfV-jA",
    },
    impact: "As sole designer, I led and delivered the design that merged 3 storage services into one, cutting months of setup to minutes.",
    type: "AWS",
    year: "2025",
    tags: ["Sole designer", "Cloud infrastructure", "from concept to launch", "API"],
    metricsImage: "/img/sda/final-visual/createap.png",
    metrics: [
      { value: 34, suffix: "%", label: "WoW adoption growth, first 3 months" },
      { value: 90, suffix: "%", label: "Customer satisfaction rate" },
      { value: 194, suffix: "%", label: "MoM API request growth, 6 months" },
      { value: 79, suffix: "%", label: "Access Point creation success rate" },
    ],
    sections: [
      {
        id: "problem",
        navLabel: "01 Who and why",
        heading: "01 Who and why",
        content: {
          lead: "Customers spent months building and maintaining custom pipelines just to access data across three separate storage consoles. Two personas and constant context-switching made the case for one unified data access experience.",
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
        heading: "02 Product scoping",
        content: {
          lead: "I mapped the user journey into prioritized stories that drove a scope decision: what ships at launch vs. what waits. This aligned the team on the three flows that mattered most.",
          subsections: [
            { label: "User stories", text: "The full story map exposed 20+ user needs across three services. This gave the team a shared view of the full scope and let us draw the launch boundary.", images: [{ src: "/img/sda/product-scoping/userstories.jpg", alt: "User stories" }] },
            { label: "User flows", text: "I mapped each priority flow end-to-end, illustrating how each flow fits into the overall experience.", images: [{ src: "/img/sda/product-scoping/userflow.jpg", alt: "User flows" }] },
          ],
        },
      },
      {
        id: "design-iteration",
        navLabel: "03 Design evolution",
        heading: "03 Design evolution",
        content: {
          lead: "Internal testing exposed a critical flaw: 40% of multi-step setups failed midway, and customers lost all their progress. I advocated for a pattern that surfaces every required step upfront and runs each API call independently, so a single failure no longer cascades. Follow-up testing validated the approach, and Access Point creation success rose to 79%.",
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
        summary: "A unified console that collapses months of custom pipeline work into a guided flow, letting customers set up and access data across three storage services in minutes.",
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
    detailImage: "/img/s3tables/project-page-thumbnail.jpg",
    projectTitle: { main: "AWS S3 Tables: turn big data into insights in one click" },
    navTitle: "AWS S3 Tables: turn big data into insights in one click",
    heroProblem: "Customers were spending millions building and maintaining complex infrastructure for AI/ML workloads. I led the UX for a 20-person team to design S3 Tables, a new product {img:/img/s3tables/customers-inline-img/hero-text/000.jpg,/img/s3tables/customers-inline-img/hero-text/101.jpg,/img/s3tables/customers-inline-img/hero-text/102.jpg|https://aws.amazon.com/s3/features/tables/} to eliminate that complexity, from concept to launch in 8 weeks.",
    heroSolution: "S3 Tables, featured in {link:the 2024 AWS CEO keynote}, handles infrastructure automatically, providing a seamless console experience that lets teams turn big data into insights in seconds.",
    impact: "I led the UX for S3 Tables, shaping its core user experience, from concept to launch in 8 weeks, resulting in 500+ TB stored in the first 6 months.",
    type: "AWS",
    year: "2024",
    tags: ["Design lead", "From concept to launch", "Cloud infrastructure"],
    metricsImage: "/img/s3tables/final-visual/metricsImage.png",
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
        navLabel: "01 Who, why, and what",
        heading: "01 Who, why, and what",
        content: {
          lead: "20+ interviews revealed that customers {img:/img/s3tables/customers-inline-img/netflix.jpg,/img/s3tables/customers-inline-img/bmw.jpg,/img/s3tables/customers-inline-img/mcdonlad.jpg,/img/s3tables/customers-inline-img/nasdaq.jpg,/img/s3tables/customers-inline-img/siemens.jpg,/img/s3tables/customers-inline-img/3m.jpg} don't want to store structured data in unstructured storage while maintaining custom infrastructure. They need a solution to streamline storage operations so teams can focus on data querying. I documented the existing user journey and major pain points, proposed an ideal user journey, then adapted the AWS JTBD framework to give the team a shared language for strategic scope trade-offs. After reviewing the JTBD framework, the team aligned on the product launch plan in one week.",
          subsections: [
            { label: "Research", text: "While working with 1 researcher and 3 PMs, I used internal AI tools to synthesize transcripts from 20+ enterprise customer interviews, and the outcome revealed who we are designing for and their respective pain points.", images:[{ src: "/img/s3tables/problem/research.jpg", alt: "Research"}]},
            { label: "Target personas", text: "Data engineers maintain storage systems daily. Strategic leads evaluate infrastructure costs and reliability.", images: [{ src: "/img/s3tables/problem/p-data-engineer.png", alt: "Data engineer persona" }, { src: "/img/s3tables/problem/p-strategic-lead.png", alt: "Strategic lead persona" }] },
            { label: "Existing user journey with pain points", text: "I mapped the user journey into phases to surface the highest-friction tasks, guiding the team to align on priorities to act on. The user journey shows that millions are wasted on custom infrastructure and integration with query engines, while no native way to keep structured data up-to-date.", images: [{ src: "/img/s3tables/problem/user-journey.gif", alt: "Problem 1" }] },
            { label: "JTBD Framework", text: "I first worked with the team to identify all user stories based on the JTBD framework, then mapped each story with its console steps, preconditions, and APIs to six groups: Create, List, View, Manage, Audit, and Delete.", images: [{ src: "/img/s3tables/scoping/JTBDframework.jpg", alt: "JTBD framework" }] },
            { label: "Action plan", text: "The framework allowed the team to align on a prioritized action plan with defined APIs, known limitations, and console impact, turning an ambiguous product space into a concrete roadmap. From there, we scoped the first launch to Create and Integrate.", images: [{ src: "/img/s3tables/scoping/action-plan.jpg", alt: "Action plan" }] },
          ],
        },
      },
      {
        id: "scoping",
        navLabel: "02 Define the foundational user flow and IA",
        heading: "02 Define the foundational user flow and IA",
        content: {
          lead: "With scope locked, I turned the optimized journey into the console's structure. I defined an information architecture that groups tasks the way customers think, drafted the end-to-end flow, then tested and refined it until the path from setup to query was clear.",
          subsections: [
            { label: "User journey optimization", text: "Building on the documented journey and its pain points, I reorganized the necessary actions into logical phases, cutting the journey from 4 milestones to 3 and removing 6 user actions that S3 Tables could automate.", images: [{ srcs: ["/img/s3tables/problem/user-journey-problem.jpg", "/img/s3tables/problem/user-journey-optimization.jpg"], alt: "Optimized user journey" }] },
            { label: "Console information architecture", text: "I ran two workshops with the PM and engineering teams to define and align on the console's information architecture.", images: [{ src: "/img/s3tables/scoping/console-ia.jpg", alt: "Console information architecture" }] },
            { label: "Console flow exploration", text: "Grounded in the ideal journey and the defined IA, I explored several console flow options. Testing with internal teams surfaced the core issue: separate integration steps made the flow confusing and fragile. Testers often didn't know where to set up the right permissions or which services to integrate with, and they wanted S3 to handle integration and permissions together.", images: [{ srcs: ["/img/s3tables/scoping/console-flow-issue.jpg", "/img/s3tables/scoping/console-flow-issue-2.jpg"], alt: "User flow exploration" }] },
            { label: "User flow optimization", text: "Acting on that feedback, I combined the separate integration steps into one, merging integration, permission setup, and resource creation into a single consolidated flow. Customers now complete several actions in one pass, cutting configuration time drastically for a more cohesive console experience.", images: [{ src: "/img/s3tables/scoping/console-flow-optimization.jpg", alt: "User flow optimization" }] },
          ],
        },
      },
      {
        id: "design-iteration",
        navLabel: "03 Design evolution",
        heading: "03 Design evolution",
        content: {
          lead: "Integration across multiple services needs to be seamless. After testing three options, I persuaded the team to combine integration with table bucket creation as a default-on setting. 97% of customers never turned it off.",
          subsections: [
            { label: "Design ideation", text: "I tested three integration models: a multi-step wizard that walked through each service, a fragmented approach with separate configuration pages, and a single-page create flow with integration built in.", images: [{ src: "/img/s3tables/design-iteration/design-ideation.jpg", alt: "Exploration" }] },
            { label: "Trade-offs", text: "The wizard added friction to what should feel instant. The fragmented model scattered a single decision across multiple pages. Customer research showed most users' end goal was querying, so bundling integration into table bucket creation matched their mental model.", images: [{ src: "/img/s3tables/design-iteration/s3table-iteration-tradeoffs.jpg", alt: "Trade-offs" }] },
            { label: "Component modernization", text: "Partnering with the AWS design system team, I audited the components the S3 Tables console relied on and updated the ones that fell short. Status indicators now signal progress more clearly, so customers always know where a task stands. Buttons follow a more rigorous, consistent spec. And tables carry more breathing room, so the dense information they hold stays glanceable. I contributed the changes back to the design system, so the improvements reach beyond S3 Tables.", images: [{ src: "/img/s3tables/design-iteration/ui-component-change.jpg", alt: "Modernized design system components" }] },
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
            text: "The S3 Tables console enables customers to create, manage, and query structured data for analytics and AI/ML workloads in a few clicks, drastically simplifying the way customers manage their storage.",
            images: [
              { src: "/img/s3tables/final-visual/newUI/tb-list.png", alt: "S3 Tables bucket overview" },
              { src: "/img/s3tables/final-visual/newUI/tb-detail-l.png", alt: "S3 Tables bucket detail page" },
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
              { src: "/img/s3tables/final-visual/ceo.jpg", alt: "re:Invent 2024 keynote" },
              { src: "/img/s3tables/final-visual/newUI/s3t-glam-shot.jpg", alt: "S3 Tables glam shot" },
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
    detailImage: "/img/ai-assistant/visual/b-l.png",
    heroVideo: "/img/ai-assistant/visual/defaultview.mp4",
    projectTitle: { main: "Amazon Q\nassistant", sub: "Purpose over services" },
    navTitle: "Amazon Q assistant",
    metricsImage: "/img/ai-assistant/visual/metricsImage.png",
    metrics: [
      { value: 1000, suffix: "+", label: "Workflows completed in 1 month" },
      { value: 20, suffix: "%", label: "Faster task completion" },
      { value: 10, suffix: "%", label: "of AWS services integrated in 1 month" },
      { value: 80, suffix: "%", label: "Console CSAT" },
    ],
    heroProblem: "After launching the {link:Amazon Q console|https://aws.amazon.com/q/} in early 2025, customer feedback revealed that its functionality was limited and service-driven. What customers needed was a natural-language experience driven by intent, not by service. I led design in close cross-functional collaboration with a small core team to find the workflows that would benefit most from an agentic flow, then shaped the experience in three weeks for two very different customers: new users exploring AWS, and power users who prefer a CLI/SDK experience.",
    heroSolution: "The result is an agentic application layered on the existing console. A three-panel experience lets new customers work by purpose instead of by service, while power users keep their native terminal and gain a conversational layer that speeds up their workflows.",
    impact: "I led UX for an agentic layer that makes AWS purpose-driven, not service-driven, reducing task completion time by 20%.",
    type: "AWS",
    year: "2026",
    tags: ["Lead UX Designer", "AI", "From concept to launch"],
    sections: [
      {
        id: "problem",
        navLabel: "01 Who and why",
        heading: "01 Who and why",
        content: {
          lead: "Customer feedback pointed to one gap: the experience was service-driven and manual when customers wanted it to be agentic and guided. I partnered with product to consolidate usage data and find the workflows that would benefit most from an agentic flow.",
          subsections: [
            { label: "Research process", text: "Fully embracing AI tools, I built a research knowledge base and used a research agent to pull from it alongside trustworthy external sources and internal persona reports. It synthesized the research in about an hour, work that usually takes days, and drafted a product requirement document in a few hours instead of the week it typically takes the team. I reviewed and refined both with the product team.", images: [{ srcs: ["/img/ai-assistant/research/research-process.png"], alt: "Research process" }] },
            { label: "Target customers and their pain points", text: "Two customer types shaped every decision. New and casual users want to state a purpose and explore AWS services through conversation. Power users live in the terminal and want conversational help layered on top, not a replacement. On the other hand, the console was organized around services rather than intent, so customers had to know which service to use before they could start. Common workflows were manual and fragmented, with no agentic path to complete them end to end.", images: [{ srcs: ["/img/ai-assistant/research/one-pager.png", "/img/ai-assistant/research/one-pager-w-highlight.png"], alt: "Research one-pager" }] },
          ],
        },
      },
      {
        id: "scoping",
        navLabel: "02 Define the foundational experience",
        heading: "02 Define the foundational experience",
        content: {
          lead: "Grounded in customer feedback, I designed an agentic experience matched to how customers actually think, and partnered with engineering on a backend structure that could scale with it.",
          subsections: [
            { label: "Design process", text: "I drove the design with multiple AI design agents and skills, exploring several design directions and components in a day rather than the weeks it used to take the team, while partnering with engineering to define the backend and review prototypes.", images: [{ src: "/img/ai-assistant/design-evolution/design-process.png", alt: "Design process" }] },
            { label: "Identify building blocks and define interface layout", text: "The core challenge was serving two very different customers in one experience without splitting it into two products. I captured the core building blocks and placed each in its right spot, assembling them into a three-panel layout: a terminal on the left for power users, a chat panel in the middle for natural language, and a review panel on the right for workflow steps, status, and output, so each customer type can work the way they prefer, all in one place.", images: [{ srcs: ["/img/ai-assistant/design-evolution/1.jpg", "/img/ai-assistant/design-evolution/2.jpg"], alt: "Building blocks and three-panel layout" }] },
            { label: "Motion and interaction", text: "I then designed the motion for how customers interact with the interface, expanding and collapsing panels to fit their needs. Power users can expand the terminal panel, more advanced users can expand the agent list, and anyone can expand or collapse the output panel depending on where they are in a flow.", images: [{ srcs: ["/img/ai-assistant/design-evolution/flow.gif"], alt: "Panel expand and collapse motion" }] },
            { label: "Backend structure and syntax", text: "In parallel, I partnered with the engineering team to define the backend structure and syntax, mapping the most common actions to the right components so the interface and the system stay in sync.", images: [{ srcs: ["/img/ai-assistant/design-evolution/backend-1.jpg", "/img/ai-assistant/design-evolution/backend-2.jpg", "/img/ai-assistant/design-evolution/backend-3.jpg"], alt: "Backend structure and syntax" }] },
          ],
        },
      },
      {
        id: "design-iteration",
        navLabel: "03 Detailed design and visual exploration",
        heading: "03 Detailed design and visual exploration",
        content: {
          lead: "With the layout set, I developed the visual direction on the existing AWS design system and made the component-level decisions that stripped out visual distraction, partnering with the AWS design system team to keep it consistent with the broader console.",
          subsections: [
            { label: "Visual exploration", text: "I proposed and developed the visual direction, grounded in the existing AWS design system and extended to fit the more agentic, conversational feel of the experience. I worked with the AWS design system team to align on it so the app stays consistent with the rest of the console.", images: [{ src: "/img/ai-assistant/design-evolution/visual-exploration.png", alt: "Visual exploration" }] },
            { label: "Component decisions", text: "I determined the component-level details, removing unnecessary borders, decorative elements, and decorative text, and aligning the color with AWS branding. The before and after show the same interface with the distraction stripped out, so attention stays on the conversation and the workflow.", images: [{ src: "/img/ai-assistant/design-evolution/fine-tune.png", alt: "Component decisions, before and after" }] },
          ],
        },
      },
      {
        id: "outcome",
        navLabel: "04 Outcome",
        heading: "04 Outcome",
        headingAlign: "center",
        summary: "An intuitive agentic app that lives on top of the existing console, making AWS purpose-driven for newcomers and more efficient for power users.",
        cinematicReveal: false,
        closingStatement: {
          lead: "When the path exists, customers work by intent, not service by service.",
          muted: "In the first month, 1,000+ workflows ran through the assistant and customers completed tasks 20% faster. Every new workflow that onboards compounds the agentic experience.",
        },
        content: [
          {
            subheading: "A flexible layout that matches how customers think",
            text: "The layout maps to the customer's mental model and journey, reading left to right. Power users stay in the CLI and SDK panel on the left. New and casual customers work in the chat panel in the middle, stating a purpose in natural language. Both meet in the review panel on the right to check status, output, and next steps before anything runs. Every panel expands, collapses, and rearranges, so customers can shape the workspace around the way they work.",
            images: [
              {
                srcs: [
                  "/img/ai-assistant/visual/clean-structure/clean-structure.png",
                  "/img/ai-assistant/visual/clean-structure/clean-structure-sidebar.png",
                  "/img/ai-assistant/visual/clean-structure/clean-structure-cli.png",
                  "/img/ai-assistant/visual/clean-structure/clean-structure-chat.png",
                  "/img/ai-assistant/visual/clean-structure/clean-structure-review.png",
                ],
                alt: "Three-panel layout mapped to the user journey, left to right",
              },
              { src: "/img/ai-assistant/visual/default-no-panel.jpg", alt: "Layout with panels collapsed" },
              { src: "/img/ai-assistant/visual/default-all-panels-l.png", alt: "Layout with all panels expanded" },
            ],
          },
          {
            subheading: "Designed for light and dark",
            text: "The full experience ships in both light and dark mode, built on the AWS design system so it stays consistent with the rest of the console.",
            images: [
              { video: "/img/ai-assistant/visual/light-dark.mp4", poster: "/img/ai-assistant/visual/light-dark-poster.jpg", alt: "The transition between light mode and dark mode" },
              { src: "/img/ai-assistant/visual/default-all-panel-d.jpg", alt: "The full experience in dark mode" },
              { src: "/img/ai-assistant/visual/default-all-panels-l.png", alt: "The full experience in light mode" },
            ],
          },
          {
            subheading: "Purpose-driven, not service-driven",
            text: "Customers complete tasks by stating what they want to do, not by knowing which service to open first. The chat experience reads their intent, proposes the steps, and carries the work through to completion.",
            images: [
              { video: "/img/ai-assistant/visual/full-flow.mp4", poster: "/img/ai-assistant/visual/full-flow-poster.jpg", alt: "Full experience walkthrough of a purpose-driven task, end to end" },
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
  "agent-opportunities",
  "simplifying-data-access",
];

export function getProject(slug) {
  return projects[slug] || null;
}

export function getAllSlugs() {
  return Object.keys(projects);
}
