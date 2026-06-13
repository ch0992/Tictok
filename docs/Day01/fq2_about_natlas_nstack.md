# Day 01 - Behavioral Interview

## Follow-up Question 2 - Interesting. Tell me more about NAtlas and NStack.

### Importance

★★★★☆

### Frequency

★★★☆☆

### Probability

Medium

This question is likely to appear if the interviewer becomes interested in your AI engineering initiatives, platform engineering work, or developer productivity efforts.

---

## Interviewer's Intent

The interviewer wants to:

- Understand whether you built or led the initiative
- Evaluate system thinking and problem-solving ability
- Assess platform engineering mindset
- Understand your perspective on AI-assisted development
- Measure technical leadership and innovation

---

## Recommended Answer (English)

Certainly.

The idea actually started from an observation about how many teams are currently adopting AI-assisted development.

In many cases, developers interact with AI through conversations, generate code, and ultimately produce working software. While this approach is effective for rapidly building MVPs, it often leaves behind very little engineering context.

Several months later, teams may struggle to understand why certain decisions were made, what prompts were used, what alternatives were considered, or how a particular feature evolved over time.

To address this problem, I started working on a framework called NStack.

NStack is an AI-native engineering framework built around three concepts: Rules, Skills, and Workflows.

The goal is to standardize how engineers work with AI and ensure that important engineering knowledge is captured throughout the development process.

As part of this workflow, development activities are automatically documented. This includes prompts, implementation plans, architectural decisions, issue tracking, and development outcomes.

NAtlas was created as the knowledge platform that sits on top of this framework.

It acts as an engineering knowledge hub where project artifacts, design documents, prompts, implementation records, and engineering decisions are collected and indexed.

Through MCP integration, both engineers and LLMs can search and retrieve this information directly. Behind NAtlas, we leverage Swarmvault as the underlying retrieval-augmented generation (RAG) and memory vault, allowing semantic search and graph-based context retrieval to deliver highly relevant engineering history to the LLMs.

The main benefit is that engineers no longer need to reverse-engineer code to understand what happened in a project. They can quickly understand the intent, design decisions, and implementation history behind a system.

This improves collaboration, reduces duplicate work, shortens onboarding time, and helps teams scale AI-assisted development in a more sustainable and structured way.

---

## Korean Summary

NStack과 NAtlas는 AI 시대의 개발 방식에서 발생하는 문제를 해결하기 위해 시작되었습니다.

최근 많은 개발자들이 AI와 대화하며 빠르게 기능을 구현하고 MVP를 만들고 있습니다.

하지만 시간이 지나면 다음과 같은 문제가 발생합니다.

- 왜 이런 설계를 했는가?
- 어떤 프롬프트를 사용했는가?
- 어떤 대안을 검토했는가?
- 특정 기능이 어떻게 발전했는가?

이러한 정보가 남지 않아 결국 개발자가 코드를 역공학해야 합니다.

이를 해결하기 위해 NStack을 만들었습니다.

NStack은 Rules, Skills, Workflows로 구성된 AI-Native Engineering Framework입니다.

개발 과정에서 발생하는 다음 정보를 강제로 기록합니다.

- Prompt
- Issue
- Design Decision
- Implementation Plan
- Result

NAtlas는 이러한 정보를 저장하고 검색할 수 있는 Knowledge Platform입니다.

MCP를 통해 사람뿐만 아니라 LLM도 직접 검색할 수 있도록 설계했습니다. 특히 Swarmvault를 검색 엔진 및 메모리 저장소로 활용하여, 단순 검색을 넘어 컨텍스트 기반의 증강 검색(RAG)과 지식 그래프 조회가 가능하도록 구현했습니다.

이를 통해:

- 중복 개발 감소
- 온보딩 시간 단축
- 지식 공유 향상
- 토큰 사용량 감소
- 코드 역공학 감소

효과를 얻을 수 있습니다.

---

## Key Expressions

### AI-assisted development

AI 기반 개발

Example:
Many teams are adopting AI-assisted development.

---

### Engineering context

개발 배경 정보

Example:
AI-generated code often lacks engineering context.

---

### AI-native engineering

AI 중심 엔지니어링

Example:
NStack is an AI-native engineering framework.

---

### Standardize how engineers work with AI

AI 활용 방식을 표준화하다

Example:
The framework standardizes how engineers work with AI.

---

### Architectural decisions

아키텍처 의사결정

Example:
Important architectural decisions should be documented.

---

### Knowledge hub

지식 허브

Example:
NAtlas acts as a knowledge hub for engineering teams.

---

### Reverse-engineer code

코드를 역분석하다

Example:
Engineers often need to reverse-engineer code to understand historical decisions.

---

### Reduce duplicate work

중복 작업을 줄이다

Example:
The platform helps reduce duplicate work across teams.

---

### Scale AI-assisted development

AI 기반 개발을 확장하다

Example:
The goal is to scale AI-assisted development in a sustainable way.

---

### Retrieval-augmented generation (RAG) / Memory vault

검색 증강 생성 / 메모리 저장소

Example:
We leverage Swarmvault as the underlying RAG and memory vault for NAtlas.

---

## Expected Follow-up Questions

### Q1

How is NStack different from normal coding guidelines?

---

### Q2

What kind of information is stored in NAtlas?

---

### Q3

How does MCP integration work?

---

### Q4

How do you measure success for NAtlas?

---

### Q5

What problem was the team facing before implementing this framework?

---

### Q6

How would this scale across hundreds of engineers?

---

## Personal Notes

Strong Points:

- Shows platform thinking
- Demonstrates technical leadership
- Demonstrates process design
- Demonstrates AI engineering experience
- Demonstrates knowledge management

Emphasize:

- Standardization
- Automation
- Knowledge Retention
- Engineering Productivity
- Long-term Maintainability

Avoid:

- Presenting it as a simple documentation tool
- Focusing only on AI hype
- Making it sound like a personal side project

---

## Related Experience

- NStack Framework
- NAtlas Knowledge Platform
- AI-assisted Engineering
- MCP Integration
- Swarmvault (RAG & Memory Vault)
- Engineering Workflow Design
- Knowledge Management Systems

---

## Status

Studying
