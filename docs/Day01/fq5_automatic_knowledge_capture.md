# Day 01 - Behavioral Interview

## Follow-up Question 5 - How do you automatically capture knowledge?

### Importance

★★★★☆

### Frequency

★★★☆☆

### Probability

Medium to High

This question is likely to appear after discussing NAtlas, NStack, documentation automation, AI workflows, or engineering knowledge management.

---

## Interviewer's Intent

The interviewer wants to:

- Understand the technical implementation
- Verify that the idea is practical
- Evaluate engineering depth
- Assess systems thinking
- Determine whether the process can scale

---

## Recommended Answer (English)

The key idea is that we do not ask engineers to create additional documentation manually.

Instead, we integrate knowledge capture directly into the engineering workflow.

For example, when an engineer starts working on a task, the process typically begins with a GitHub issue, a requirement, or a project request.

As the engineer interacts with AI, important artifacts are generated naturally, including prompts, implementation plans, architectural discussions, task breakdowns, and design decisions.

Rather than treating those artifacts as temporary conversations, NStack treats them as engineering assets.

The workflow automatically associates those artifacts with the corresponding issue, task, or project.

As development progresses, additional information such as implementation results, code changes, pull requests, test outcomes, and lessons learned are collected.

These artifacts are then indexed and stored within NAtlas.

Through MCP integration, both engineers and LLMs can search this information semantically.

For example, instead of searching for a specific document title, an engineer could ask:

"How was authentication implemented in the previous project?"

or

"Has anyone solved a similar Kubernetes deployment issue before?"

The system can then retrieve relevant design decisions, implementation records, and project history.

The goal is to make knowledge capture a byproduct of engineering work rather than a separate activity.

---

## Korean Summary

핵심은 개발자에게 문서를 추가로 작성하라고 요구하지 않는 것입니다.

대신 개발 과정 자체에서 지식을 자동으로 수집합니다.

예를 들어 개발이 시작되면 보통:

- GitHub Issue
- Requirement
- Project Request

등이 존재합니다.

그리고 AI를 활용하는 과정에서 자연스럽게 다음 산출물이 생성됩니다.

- Prompt
- Task Breakdown
- Design Discussion
- Implementation Plan
- Architecture Decision

NStack은 이러한 정보를 단순 대화가 아니라 엔지니어링 자산으로 취급합니다.

이후 개발 과정에서:

- Code Change
- Pull Request
- Test Result
- Development Outcome
- Lessons Learned

등이 함께 연결됩니다.

이 정보는 NAtlas에 저장되고 인덱싱됩니다.

MCP를 통해 사람과 LLM이 모두 의미 기반 검색(Semantic Search)을 수행할 수 있습니다.

즉,

"이 프로젝트 인증은 어떻게 구현했지?"

"예전에 비슷한 Kubernetes 문제를 해결한 적이 있나?"

같은 질문이 가능해집니다.

핵심 목표는

문서 작성

↓

개발

이 아니라

개발

↓

지식 자동 생성

입니다.

---

## Key Expressions

### Knowledge capture

지식 수집

Example:
Knowledge capture should be integrated into the workflow.

---

### Engineering assets

엔지니어링 자산

Example:
Prompts should be treated as engineering assets.

---

### Semantic search

의미 기반 검색

Example:
Engineers can use semantic search instead of keyword search.

---

### Byproduct of engineering work

엔지니어링 작업의 부산물

Example:
Documentation should become a byproduct of engineering work.

---

### Architectural discussions

아키텍처 논의

Example:
Architectural discussions are preserved for future reference.

---

### Lessons learned

회고 및 교훈

Example:
Lessons learned are captured automatically.

---

## Expected Follow-up Questions

### Q1

How do you prevent low-quality information from being stored?

---

### Q2

How do you avoid creating too much noise?

---

### Q3

How is semantic search implemented?

---

### Q4

How would this work for a team of 500 engineers?

---

### Q5

What metrics would prove this system is successful?

---

### Q6

How is this different from simply storing prompts in Git?

---

## Personal Notes

Strong Message:

Traditional Process

Issue
→ Code
→ Documentation

NStack Process

Issue
→ Prompt
→ Design
→ Implementation
→ Outcome
→ Knowledge

Everything becomes searchable.

Strong Interview Quote:

"We don't ask engineers to write more documentation. We make knowledge generation part of the development process."

---

## Related Experience

- NStack
- NAtlas
- MCP Integration
- Semantic Search
- AI-assisted Engineering
- GitHub Workflow Integration

---

## Status

Studying
