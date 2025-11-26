# PRD – TestAgentDemo

## Purpose

Demonstrate a simple, minimal Agentic QA Workflow using:

- Playwright AI agents (Planner, Generator, Healer)
- Cursor orchestrator rule
- Public demo targets:
  - https://www.saucedemo.com/ (UI)
  - https://petstore.swagger.io/ (API)

The workflow must automatically generate:

- Test plans
- Playwright tests
- Healing suggestions
- Execution reports

---

## Demo Scope

### UI (Saucedemo)
Demonstrate:
- Successful login
- Failed login
- Add to cart
- Checkout flow
- Example of healing a failing selector

### API (Petstore)
Demonstrate:
- CRUD operations for `/pet`
- Smoke test
- One negative test
- API healing example (wrong field / incorrect assertion)

---

## Out of Scope
- CI/CD
- Data seeding
- Configurable environments
- Authentication-tied flows
- Complex reporting dashboards

---

## Success Criteria

During the live demo, TestAgentDemo should:

1. Automatically generate a test plan (`tests/plans/*.md`)
2. Automatically generate Playwright tests
3. Execute tests via Playwright
4. Heal at least one failing test
5. Produce a clean Markdown report in `reports/*.md`

Nothing manually coded beyond this PRD, README, and one Cursor rule.
