<div align="center">
  <h1>Ruttansh Bhatelia</h1>
  <p><strong>AI Engineer</strong> · Curious by default. Rigorous in practice.</p>
  <p>
    <a href="https://www.0xrutts.com/" title="Website"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/website-dark-1e8d0855.svg"><img src="assets/readme/website-light-2a1d4257.svg" alt="Website" width="28" height="28"></picture></a>
    &nbsp;&nbsp;&nbsp;
    <a href="https://www.linkedin.com/in/ruttansh" title="LinkedIn"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/linkedin-dark-9a6ef6e1.svg"><img src="assets/readme/linkedin-light-ed1ba4c6.svg" alt="LinkedIn" width="28" height="28"></picture></a>
    &nbsp;&nbsp;&nbsp;
    <a href="mailto:rutts291@gmail.com" title="Email"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/email-dark-060b84ad.svg"><img src="assets/readme/email-light-1f9cd172.svg" alt="Email" width="28" height="28"></picture></a>
  </p>
</div>

I'm an AI engineer who needs to know why things are the way they are. Right now that means coding agents: letting them run long and unattended while they stay sandboxed, honest and on what the person actually asked for, without someone watching every step.

## Selected work

### [Keeping Agents Honest (kah)](https://github.com/rutts29/keeping-agents-honest)

A supervisor for unmodified Claude Code and Codex. [Case study](https://claude.ai/artifact/FH7Z6LcgcEcdKGEY9S689h#overview)

- Keeps the developer's exact words and later corrections in an intent history, so instructions survive context compaction.
- Checks every commit against that intent and steers the agent back through its native hooks, quoting the developer's own words.
- In a 31-commit replay, kah's commit screen escalated 7 of 8 planted violations with 0 of 23 normal commits flagged. On real work (safetensors #878), kah caught three defects in Codex's commits, each fixed in the next commit.
- Runs third-party repo commands in gVisor on a commodity VPS where KVM microVMs can't run: read-only root, all capabilities dropped, network off by default, model logins kept on the host.
- Runs unattended tasks in their own Git worktrees and tests each agent commit from a fresh checkout. Each run lands as a branch with a report, and merging, pushing and deploying stay a human decision by design.

`Rust` · `gVisor` · `Claude Code` · `Codex`

### [agentlog](https://github.com/rutts29/agentlog) & Agent Hub

Local-first observability for coding agents, and the always-on agent platform built on top of it.

- agentlog normalizes sessions from 7 coding-agent tools (Codex, Claude Code, Cursor, Grok and more) into a provenance-tracked SQLite ledger, served through a CLI, a dashboard and read-only MCP tools.
- The hub's file-memory coordinator picks the model per job and routes work to cloud workers, an always-on server or a local lane. An exit gateway checks every outward action before it runs.
- No public ports (Tailscale only), and credentials are injected at the network proxy, never stored on worker VMs.

`Python` · `TypeScript` · `SQLite` · `MCP` · `Tailscale`

## Experience

- **AI Engineer & ML Researcher, [CredShields](https://credshields.com/)** · Apr 2025 – Sep 2026 · Remote
  - Built the production foundation of [CredShields One](https://one.credshields.com/), an AI-assisted penetration-testing platform with sandboxed scans and an orchestrator/sub-agent architecture.
  - Owned [SolidityScan](https://solidityscan.com/)'s RAG and function-level AI pipeline, and extended its LLM false-positive checks from 2–3 vulnerability categories to all of them.
  - Built OpenHands agents over the Agent Communication Protocol (ACP) for Slack debugging, issues and pull requests.
  - Fine-tuned and published Solidity-CodeGen-v0.1 (Qwen3-4B) with LoRA, served with vLLM in an OpenZeppelin MCP workflow.
- **[Sheridan Centre for Applied AI](https://www.sheridancollege.ca/research/centres/applied-ai)** · May 2024 – Apr 2025 · Applied research with industry partners
  - ML Researcher with [TELUS](https://www.telus.com/) · Jan – Apr 2025: VAE and DDPM models that synthesize RSSI fingerprints for indoor localization.
  - Full Stack Developer with [McMaster University](https://www.mcmaster.ca/) · Sep – Dec 2024: a cross-platform Flutter client for a research app handling sensitive health data.
  - ML Researcher with [Osteoporosis Canada](https://osteoporosis.ca/) · May – Aug 2024: fracture-risk prediction with a soft-voting ensemble.

## Research

**[Low-Error Indoor Positioning via Synthetic RSSI Augmentation and Zx–WKNN Hybrid Model](https://doi.org/10.1109/MSWiM67937.2025.11309178)** · IEEE MSWiM 2025 · [DBLP](https://dblp.org/rec/conf/mswim/AhmedSCDZB25)

Honours BSc in Computer Science, Sheridan College. Thesis on smart-contract vulnerability detection with CodeBERT and graph models.

Open to applied AI, agent infrastructure and Forward-Deployed roles.
