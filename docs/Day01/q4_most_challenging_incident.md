# Day 01 - Behavioral Interview

## Question 4 - Tell me about the most challenging production incident you have handled.

### Importance

★★★★★

### Frequency

★★★★★

### Probability

Very High

This is one of the most important questions for SRE, Platform Engineering, Infrastructure Engineering, and DCS Cloud interviews.

---

## Interviewer's Intent

The interviewer wants to evaluate:

- Incident Response
- Troubleshooting
- Root Cause Analysis
- Reliability Engineering
- Cross-Team Collaboration
- Communication Skills
- Ownership
- Data-Driven Decision Making

---

## Recommended Answer (English)

One of the most challenging incidents I worked on involved a storage performance issue in a GPU infrastructure environment supporting AI workloads.

The issue was reported by a customer who experienced significantly lower storage performance than expected when accessing data through a VAST Storage platform.

Because the environment supported AI training workloads, storage throughput was a critical factor affecting overall system performance.

Our initial assumption was that the issue was related to RDMA or RoCE configuration because the observed performance characteristics looked similar to what we would expect if traffic were falling back to TCP.

To investigate the problem, I worked with multiple teams to establish performance baselines and compare results across different environments.

We performed tests comparing virtual machines and bare-metal systems, as well as TCP and RDMA data paths.

Through this process, we were able to narrow the problem domain significantly and determine that the issue was more complex than a simple network configuration problem.

The investigation involved collaboration across infrastructure, storage, networking, and customer-facing teams.

Eventually, the issue was resolved following additional operating system and kernel-level updates, which indicated that the root cause was deeper within the software stack than our initial assumptions.

One of the biggest lessons I learned from this incident was the importance of validating assumptions with data and systematically narrowing the scope of investigation rather than jumping directly to conclusions.

---

## Korean Summary

가장 기억에 남는 장애 중 하나는 AI GPU 인프라 환경에서 발생한 VAST Storage 성능 이슈였습니다.

고객은 기대보다 훨씬 낮은 스토리지 성능을 경험하고 있었고, AI 학습 환경에서는 스토리지 성능이 전체 시스템 성능에 큰 영향을 미치는 상황이었습니다.

초기에는 RDMA 또는 RoCE 설정 문제를 의심했습니다.

실제 성능 특성이 TCP Fallback 상황과 유사하게 보였기 때문입니다.

문제 분석을 위해 다음과 같은 비교 테스트를 수행했습니다.

- VM vs Bare Metal
- TCP vs RDMA
- 다양한 환경 간 성능 측정

이를 통해 문제 영역을 점진적으로 좁혀 나갔고, 단순한 네트워크 설정 문제가 아니라는 점을 확인했습니다.

또한 스토리지 팀, 네트워크 팀, 인프라 팀, 고객사와 긴밀하게 협업하며 문제를 분석했습니다.

최종적으로는 운영체제 및 커널 업데이트 이후 문제가 해결되었으며, 이는 실제 원인이 네트워크 설정보다 더 깊은 소프트웨어 스택 영역에 있었음을 시사했습니다.

이 사건을 통해 데이터를 기반으로 가설을 검증하고 체계적으로 문제 범위를 좁혀가는 접근 방식의 중요성을 다시 한번 확인할 수 있었습니다.

---

## Situation

Customer reported poor storage performance in an AI GPU infrastructure environment.

Storage throughput was significantly lower than expected.

The issue affected AI training workload performance.

---

## Task

Identify the root cause.

Determine whether the issue originated from:

- Storage
- Network
- RDMA
- RoCE
- Virtualization Layer
- Operating System

Minimize impact on customer workloads.

---

## Actions

### Step 1

Establish performance baselines.

---

### Step 2

Compare:

- VM vs Bare Metal

---

### Step 3

Compare:

- TCP vs RDMA

---

### Step 4

Analyze throughput differences.

---

### Step 5

Validate RDMA and network assumptions.

---

### Step 6

Collaborate with:

- Infrastructure Team
- Storage Team
- Networking Team
- Customer Team

---

### Step 7

Narrow the problem domain using collected evidence.

---

## Result

Current Verified Facts:

- Investigation narrowed the problem significantly.
- RDMA-related assumptions were validated.
- Issue persisted beyond initial configuration changes.
- Problem was eventually resolved following kernel-level updates.

Pending Confirmation:

- Exact kernel-related root cause.
- Specific software component responsible.

(To be updated after confirmation from responsible engineer.)

---

## Key Expressions

### Establish a baseline

기준 성능을 수립하다

---

### Narrow the problem domain

문제 범위를 좁히다

---

### Validate assumptions

가설을 검증하다

---

### Data-driven investigation

데이터 기반 분석

---

### Performance bottleneck

성능 병목

---

### Cross-functional collaboration

다부서 협업

---

### Root Cause Analysis (RCA)

근본 원인 분석

---

## Expected Follow-up Questions

### Q1

What performance numbers did you observe?

---

### Q2

Why did you suspect RDMA initially?

---

### Q3

What tools did you use during the investigation?

---

### Q4

How did you determine the issue was not storage-related?

---

### Q5

What was the final root cause?

---

### Q6

What would you do differently next time?

---

### Q7

How did you communicate updates to stakeholders?

---

## Personal Notes

Very Important:

Do not speculate about the final root cause.

Separate:

Verified Facts

vs

Assumptions

Strong Message:

"The most important contribution was systematically narrowing the problem space through data-driven analysis."

This is highly valued in SRE interviews.

---

## Related Experience

- SK Telecom GPUaaS
- Upstage
- VAST Storage
- RDMA
- RoCE
- Performance Analysis
- Cross-Team Troubleshooting
- AI Infrastructure

---

## Status

Draft (Awaiting Final RCA Confirmation)
