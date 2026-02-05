# Developer Onboarding Checklist

> **Purpose**: Validate that a new developer can understand and work with the system using only documentation.

## Test Subject
A developer with general web development experience but no prior exposure to this codebase.

---

## Phase 1: Environment Setup

| Step | Documentation | Success Criteria |
|------|--------------|------------------|
| Clone repository | [Installation Guide](./installation-guide.md#1-clone-repository) | Repo cloned |
| Install dependencies | Installation Guide | `npm install` succeeds |
| Configure environment | [Configuration Reference](./configuration-reference.md) | .env created |
| Start dev server | Installation Guide | http://localhost:3000 loads |

### Validation Questions
- [ ] Developer found installation docs easily?
- [ ] Dependencies installed without errors?
- [ ] Environment variables understood?
- [ ] Any steps unclear or missing?

---

## Phase 2: Architecture Understanding

| Step | Documentation | Success Criteria |
|------|--------------|------------------|
| Understand purpose | [System Overview](../architecture/system-overview.md) | Can explain what system does |
| Understand components | [Architecture Deep Dive](../architecture/architecture-deep-dive.md) | Can name main components |
| Understand agents | [Agent Roster](../agents/agent-roster.md) | Can explain agent purpose |
| Understand decisions | [ADRs](../architecture/adr/) | Can explain key decisions |

### Validation Questions
- [ ] Developer can draw system diagram from memory?
- [ ] Developer understands agent vs service distinction?
- [ ] Developer knows where to find decision rationale?

---

## Phase 3: Code Navigation

| Step | Documentation | Success Criteria |
|------|--------------|------------------|
| Find API endpoints | [API Reference](../api/api-reference.md) | Can locate endpoint code |
| Understand data model | [Firestore Schema](../api/firestore-schema.md) | Can query database |
| Navigate UI blocks | [Block Catalog](../ui/block-catalog.md) | Can find block component |
| Understand theming | [Theme System](../ui/theme-system.md) | Can modify colors |

### Validation Questions
- [ ] Developer can trace request from UI to database?
- [ ] Developer can find where logic lives?
- [ ] Code organization makes sense?

---

## Phase 4: Simple Task

**Task**: Add a "coming soon" badge to products with no inventory.

| Step | Documentation | Notes |
|------|--------------|-------|
| Find ProductCard block | Block Catalog | |
| Understand product data | Firestore Schema | |
| Modify component | - | Simple conditional |
| Test change | - | Badge appears |

### Time Limit
- Expected: 30-60 minutes
- If > 2 hours: Documentation gap

### Validation Questions
- [ ] Developer completed task without asking for help?
- [ ] Developer knew where to look?
- [ ] Any blockers encountered?

---

## Phase 5: Plugin Development

**Task**: Create a simple plugin that adds a widget to the admin dashboard.

| Step | Documentation | Notes |
|------|--------------|-------|
| Read plugin guide | [Plugin Developer Guide](../plugins/plugin-developer-guide.md) | |
| Use template | [Plugin Templates](../plugins/plugin-templates/) | |
| Define manifest | Plugin Guide | |
| Create component | Plugin Guide + [Plugin UI](../ui/plugin-ui-injection.md) | |
| Test locally | Plugin Guide | |

### Time Limit
- Expected: 1-2 hours
- If > 4 hours: Documentation gap

### Validation Questions
- [ ] Developer understood plugin lifecycle?
- [ ] Developer found template helpful?
- [ ] Security boundaries clear?

---

## Scoring

### Rating Scale
- **5**: Completed without any assistance
- **4**: Minor confusion, self-resolved with docs
- **3**: Needed one clarification
- **2**: Needed multiple clarifications
- **1**: Could not complete without help

### Target Scores
- Environment Setup: ≥4
- Architecture Understanding: ≥4
- Code Navigation: ≥3
- Simple Task: ≥4
- Plugin Development: ≥3

---

## Gap Identification

After each session, document:

1. **Where did developer get stuck?**
2. **What documentation was missing?**
3. **What was unclear?**
4. **Suggested improvements**

---

## Sign-Off

| Criterion | Met |
|-----------|-----|
| Developer can install system | [ ] |
| Developer understands architecture | [ ] |
| Developer can navigate code | [ ] |
| Developer can make simple changes | [ ] |
| Developer can create plugins | [ ] |

**Total Score**: ___ / 25

**Documentation Approved**: [ ] Yes [ ] No - needs improvements

---

## Related

- [Operator Checklist](./operator-checklist.md)
- [Installation Guide](./installation-guide.md)
