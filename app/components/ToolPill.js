import { MCP, Bedrock, Nova, Claude, ClaudeCode, Figma, Github, Codex, Adobe, OpenAI, LobeHub, Kiro } from "@lobehub/icons";
// .tool-pill is defined in about-content.css (loaded by AboutDetails, the only consumer).

const iconMap = { MCP, Bedrock, Nova, Claude, ClaudeCode, Figma, Github, Codex, Adobe, OpenAI, LobeHub, Kiro };

export default function ToolPill({ name, icon }) {
  const Icon = iconMap[icon] || MCP;
  return (
    <span className="tool-pill">
      <Icon width={14} height={14} />
      {name}
    </span>
  );
}
