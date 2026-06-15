# Metadata

Category: GPU & AI Infrastructure

Subcategory: Storage Performance

Difficulty: Hard

Importance: ★★★★★

Frequency: ★★★★☆

Related Topics:

- RDMA
- RoCE
- VAST Storage
- GPU Training
- Performance Analysis
- RCA

Interview Rounds:

- Hiring Manager
- Technical Interview
- Onsite

Tags:

vast, storage, rdma, roce, troubleshooting, performance

---

# gpu-q03-vast-storage.md

# GPU & AI Infrastructure Interview Question 03

## Tell Me About a Challenging Storage Performance Incident

### Difficulty

Hard

### Importance

★★★★★

### Frequency

★★★★☆

---

# Quick Recall

Expected

RDMA Throughput

↓

Observed

TCP-Level Performance

↓

Investigated

Storage

Network

RDMA

Kernel

↓

Root Cause

RDMA Path Not Functioning Correctly

↓

Resolution

Kernel / Driver Update

↓

Performance Restored

---

# Interview Question

Tell me about a challenging infrastructure incident that you investigated and resolved.

---

# Interviewer's Intent

The interviewer wants to evaluate:

- Troubleshooting methodology
- Technical depth
- RCA ability
- Communication skills
- Ownership

This question is commonly asked in both behavioral and technical interviews.

---

# Situation

I was supporting a GPU infrastructure environment used for AI workloads.

The environment relied on VAST Storage and RDMA networking to deliver high throughput to GPU training clusters.

Users reported that storage performance was significantly lower than expected.

Because storage throughput directly affected training performance, the issue became a high-priority investigation.

---

# Task

My responsibility was to identify the source of the performance degradation and determine whether the issue originated from:

- Storage
- Network
- RDMA Configuration
- Host Configuration

The challenge was that all components appeared healthy at first glance.

---

# Actions

## Step 1

Establish Baseline

We compared performance across:

- Development VM
- Production VM
- Bare Metal Servers

Observed Results

Development VM

TCP

~9.7 GB/s

Expected

RDMA

~40+ GB/s

---

## Step 2

Validate Storage

We reviewed:

- VAST Storage Health
- Storage Configuration
- Throughput Metrics

Storage appeared healthy.

---

## Step 3

Validate Network

We verified:

- Physical Connectivity
- Switch Configuration
- Network Performance

Network infrastructure appeared healthy.

---

## Step 4

Investigate RDMA Path

We suspected that traffic was not using the expected RDMA communication path.

We reviewed:

- RDMA Configuration
- RoCE Configuration
- Driver Status
- Interface Settings

At this stage we identified evidence suggesting that communication was falling back to traditional TCP networking.

---

## Step 5

Deep Investigation

The issue continued even after RDMA-related validation.

The infrastructure team continued troubleshooting and eventually identified a lower-level software compatibility issue.

A kernel and driver update was performed.

Following the update, performance returned to expected levels.

---

# Result

Observed Throughput

Before

~9.7 GB/s

After

~40+ GB/s

Performance aligned with expected RDMA behavior.

The issue was resolved without hardware replacement.

The investigation also improved our validation procedures for future deployments.

---

# Technical Lessons Learned

## Lesson 1

Never assume RDMA is working simply because it is configured.

Always validate actual traffic behavior.

---

## Lesson 2

Performance issues often span multiple layers.

Storage symptoms can originate from:

- Network
- Drivers
- Kernel
- Configuration

---

## Lesson 3

A structured elimination process is critical.

We systematically ruled out:

- Storage
- Network
- Hardware

before identifying the lower-level software issue.

---

# Korean Summary

GPU 학습 환경에서 VAST Storage 성능이 기대보다 크게 낮게 나타났다.

예상

RDMA

40GB/s 이상

실제

약 9.7GB/s

---

조사 순서

Storage 확인

↓

Network 확인

↓

RDMA 검증

↓

RoCE 검증

↓

Driver 검증

↓

Kernel 검증

---

최종적으로 Kernel / Driver 관련 이슈가 확인되었고 업데이트 이후 성능이 정상 수준으로 회복되었다.

---

# Common Interview Follow-up

### Q1

Why did you initially suspect RDMA?

Expected Answer

Observed throughput was much closer to TCP performance than expected RDMA performance.

---

### Q2

How did you isolate the problem?

Expected Answer

By systematically validating storage, networking, RDMA configuration, and host software layers.

---

### Q3

Why is this a good example of troubleshooting?

Expected Answer

The investigation followed evidence rather than assumptions and eliminated potential causes one layer at a time.

---

### Q4

What was the biggest lesson?

Expected Answer

Never assume that a configured feature is functioning correctly.

Always verify actual behavior.

---

# ByteDance Relevance

This example demonstrates:

- Large-scale infrastructure troubleshooting
- GPU environment experience
- Storage performance analysis
- RDMA knowledge
- Cross-functional collaboration
- RCA methodology

All of these are highly relevant to DCS Cloud.

---

# Personal Notes

Strong Interview Message

I focus on proving or disproving hypotheses using measurements rather than assumptions.

---

Strong Interview Quote

"We did not start by searching for the root cause. We started by identifying which layer was not behaving as expected."

This sounds very senior and aligns well with SRE-style incident investigation.

---

## Status

Needs Future Update

(Replace kernel/driver section with confirmed RCA once final details are available.)
