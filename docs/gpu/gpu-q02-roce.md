# Metadata

Category: GPU & AI Infrastructure

Subcategory: RoCE

Difficulty: Hard

Importance: ★★★★★

Frequency: ★★★★☆

Related Topics:

- RDMA
- TCP
- InfiniBand
- VAST Storage
- GPU Clusters
- Lossless Ethernet

Interview Rounds:

- Technical Screen
- Hiring Manager
- Onsite

Tags:

roce, rdma, infiniband, gpu, ai-infrastructure

---

# gpu-q02-roce.md

# GPU & AI Infrastructure Interview Question 02

## What is RoCE and Why Is It Important?

### Difficulty

Hard

### Importance

★★★★★

### Frequency

★★★★☆

---

# Quick Recall

RoCE

=

RDMA over Converged Ethernet

Benefits

- Low Latency
- High Throughput
- CPU Offload

Requirements

- Proper NIC Support
- RDMA Drivers
- Lossless Ethernet

Common Failure

RDMA fails

↓

Traffic falls back to TCP

↓

Performance drops

---

# Interview Question

What is RoCE?

How is it different from traditional TCP networking?

Why is it important in AI infrastructure?

---

# Interviewer's Intent

The interviewer wants to evaluate:

- Modern AI infrastructure knowledge
- RDMA understanding
- GPU cluster networking
- Data center architecture experience

This is a common follow-up after discussing RDMA.

---

# Recommended Answer (English)

RoCE stands for RDMA over Converged Ethernet.

It allows RDMA communication to operate on Ethernet networks rather than requiring a dedicated InfiniBand fabric.

The primary benefit is that organizations can achieve many of the advantages of RDMA, including low latency, low CPU utilization, and high throughput, while leveraging existing Ethernet infrastructure.

RoCE is widely used in modern AI training clusters and high-performance storage environments because it enables extremely efficient data movement between servers.

However, RoCE requires proper network configuration and RDMA-capable hardware.

If RoCE is not functioning correctly, traffic may fall back to traditional TCP communication, resulting in significantly lower performance.

---

# Korean Summary

RoCE는

RDMA over Converged Ethernet

이다.

즉

Ethernet 환경에서 RDMA를 사용할 수 있게 해주는 기술이다.

---

기존 방식

text id="gmxzhl" TCP/IP 

---

고성능 방식

text id="i58d9w" RDMA 

---

RoCE

text id="zlv2s7" RDMA + Ethernet 

---

AI 클러스터에서는

GPU 간 통신

Storage 접근

분산 학습

성능 향상

때문에 중요하다.

---

# Architecture Comparison

## Traditional TCP

Application

↓

Kernel

↓

TCP/IP Stack

↓

NIC

↓

Network

↓

NIC

↓

Kernel

↓

Application

---

## RoCE

Application

↓

RDMA NIC

↓

Ethernet Fabric

↓

RDMA NIC

↓

Remote Memory

Kernel Bypass

---

# Why AI Clusters Use RoCE

AI Training

↓

Large Data Transfers

↓

GPU Synchronization

↓

Network Bottleneck

↓

RoCE Reduces Communication Overhead

↓

Higher Training Efficiency

---

# Important Concepts

## RDMA

Direct Memory Access between servers.

---

## RoCE

RDMA implemented over Ethernet.

---

## InfiniBand

Dedicated high-performance networking technology.

Traditionally dominant in HPC environments.

---

## Lossless Ethernet

RoCE performs best when packet loss is minimized.

Technologies often used:

- PFC
- ECN
- DCB

---

# RoCE vs InfiniBand

## RoCE

Advantages

- Uses Ethernet
- Easier integration
- Lower deployment cost

---

## InfiniBand

Advantages

- Mature HPC ecosystem
- Extremely low latency
- Highly optimized for large clusters

---

# Common Interview Follow-up

### Q1

Can RoCE operate on a standard Ethernet network?

Expected Answer

Only if the network supports the required RDMA features and configurations.

---

### Q2

What happens if RoCE fails?

Expected Answer

Traffic may fall back to TCP.

Performance often decreases significantly.

---

### Q3

Why is packet loss problematic for RoCE?

Expected Answer

RDMA communication performs best in low-loss environments.

Loss impacts efficiency and throughput.

---

### Q4

What is PFC?

Expected Answer

Priority Flow Control.

Used to reduce packet loss in RoCE environments.

---

### Q5

What is the difference between RoCE and InfiniBand?

Expected Answer

RoCE operates over Ethernet.

InfiniBand uses a dedicated networking fabric.

---

# Real Production Example

Environment

GPU Training Cluster

↓

VAST Storage

↓

RoCE Network

Expected

RDMA Throughput

Observed

Performance significantly lower than expected.

Investigation

Storage Validation

↓

Network Validation

↓

RDMA Verification

↓

Traffic Analysis

Finding

Communication path was not using RDMA as expected.

Traffic was operating through the TCP stack.

Result

- Higher latency
- Lower throughput
- Increased CPU utilization

This highlighted the importance of validating actual RDMA operation rather than assuming it is enabled.

---

# ByteDance Follow-up Possibility

Very High

Typical Flow

RoCE

↓

RDMA Validation

↓

GPU Cluster Networking

↓

Distributed Training

↓

Storage Performance

↓

Large Scale AI Infrastructure

---

# Personal Notes

Strong Interview Message

Enabling RoCE is not enough.

You must verify that traffic is actually using the RDMA path.

---

Strong Interview Quote

"One of the most common mistakes is assuming RDMA is working simply because it has been configured."

This sounds like someone who has operated real AI infrastructure.

---

# Related Topics

gpu-q01-rdma-vs-tcp.md

gpu-q03-vast-storage.md

gpu-q04-gpu-training-network.md

network-q05-packet-loss.md

---

## Status

Studying
