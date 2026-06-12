import { ClaudeCode, Codex, Github, Adobe, Figma, ZenMux, Bedrock, OpenRouter, MCP, LobeHub, Aws, NanoBanana } from "@lobehub/icons";

// The design-toolkit grid. Styling lives in about-content.css (loaded by
// AboutDetails, the only consumer) — it no longer borrows MetricCard.

const iconMap = {
  "Claude Code": ClaudeCode,
  "Codex": Codex,
  "Github": Github,
  "Adobe": Adobe,
  "OpenRouter": OpenRouter,
  "Figma": Figma,
  "Figma/Figjam": Figma,
  "ZenMux": ZenMux,
  "Bedrock": Bedrock,
  "Impeccable skill": MCP,
  "LobeHub": LobeHub,
  "AWS Service Suite": Aws,
  "And so much more..": NanoBanana,
};

export default function Tools({ heading, items }) {
  return (
    <section className="about-section col-grid">
      <h2>{heading}</h2>
      <div className="tools-strip">
        {items.map((tool, i) => (
          <div key={i} className="tool-card">
            {(() => { const Icon = iconMap[tool.name]; return Icon ? <div className="tool-card-logo"><Icon width="100%" height="100%" /></div> : null; })()}
            <div>
              <span className="tool-card-name">{tool.name}</span>
              <p className="tool-card-text">{tool.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
