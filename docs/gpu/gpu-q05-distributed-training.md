# Metadata

Category: GPU & AI Infrastructure

Subcategory: Distributed Training

Difficulty: Hard

Importance: ★★★★★

Frequency: ★★★★☆

Related Topics:

- GPU Cluster
- RDMA
- RoCE
- NCCL
- AllReduce
- Storage
- AI Infrastructure

Interview Rounds:

- Technical Interview
- Hiring Manager
- Onsite

Tags:

distributed-training, gpu, ai, rdma, nccl, infrastructure

---

# gpu-q05-distributed-training.md

# GPU & AI Infrastructure Interview Question 05

## Why Does Distributed Training Need High-Performance Networking?

### Difficulty

Hard

### Importance

★★★★★

### Frequency

★★★★☆

---

# Quick Recall

Distributed Training <br> 분산 학습
↓
Multiple GPUs <br> 다중 GPU 할당
↓
Need Synchronization <br> 파라미터 동기화 필요
↓
Communication Becomes Bottleneck <br> 노드 간 통신이 성능 병목 유발
↓
RDMA Reduces Communication Cost <br> RDMA 도입으로 통신 코스트 감축
↓
Training Scales Efficiently <br> 학습 가동률 선형 확장 (Linear Scaling)

---

# Interview Question

Why do modern AI training systems use distributed training? <br> 현대의 인공지능(AI) 학습 시스템이 단일 노드를 넘어 분산 학습(Distributed Training)을 필수적으로 도입하는 이유는 무엇입니까?

Why is networking performance so important? <br> 이 분산 학습 아키텍처에서 고성능 네트워킹 성능이 매우 중요한 이유는 무엇입니까?

---

# Interviewer's Intent

The interviewer wants to evaluate: <br> 면접관은 다음 사항을 검증하고자 합니다:

- AI infrastructure understanding: Understanding the distribution of model weights and parameter updates. <br> - AI 인프라 시스템 이해도: 거대 모델의 매개변수 가중치 및 그래디언트 업데이트 기전 이해.
- Distributed systems knowledge: Understanding collective communication APIs and synchronous/asynchronous scaling. <br> - 분산 시스템 엔지니어링 지식: Collective Communication API와 동기식/비동기식 확장 병목에 대한 이해.
- GPU cluster architecture knowledge: How nodes interlock with high-speed fabrics. <br> - GPU 클러스터 설계 역량: 연산 코어 노드가 고속 패브릭 스위치망과 유기적으로 인터로킹되는 구조 인식.
- Network performance awareness: Realizing network latency directly affects GPU active computing cycles. <br> - 네트워크 성능 상관관계 인식: 네트워크 지연 속도가 GPU 스트리밍 프로세서의 연산 정지(Stall) 및 가동률에 직결됨을 인지하는지 여부.

---

# Recommended Answer (English)

Modern AI models are often too large to train on a single GPU. <br> 현대의 인공지능(AI) 모델들은 단일 GPU 메모리에 다 올리기 어려울 정도로 매개변수가 거대합니다.

As a result, training workloads are distributed across multiple GPUs and often multiple servers. <br> 그 결과, 모델 학습 작업을 다수의 GPU와 물리적으로 분리된 여러 서버 노드에 분산시켜 병렬 처리해야 합니다.

During training, GPUs must frequently exchange gradients, model parameters, and synchronization information. <br> 학습이 진행되는 동안, 각 GPU들은 연산 결과인 그래디언트(Gradient), 갱신된 모델 가중치 및 동기화 신호를 초당 수백 번씩 실시간 교환합니다.

This communication occurs repeatedly throughout the training process. <br> 이 노드 간 통신 프로세스는 전체 훈련 학습 주기 동안 끊임없이 반복해서 수행됩니다.

As clusters grow larger, communication overhead becomes a significant bottleneck. <br> 클러스터 노드 수가 확장될수록, 네트워크 통신 부하(Communication Overhead)는 분산 연산 전체의 지배적인 병목 요인으로 부상합니다.

If networking is slow, GPUs spend more time waiting for synchronization and less time performing useful computation. <br> 네트워크 전송 속도가 느리면 GPU들이 데이터를 교환하고 동기화 상태를 정렬할 때까지 계산을 멈추고 노는 대기 시간(Stall)이 길어집니다.

Technologies such as RDMA and RoCE reduce communication latency and CPU overhead, enabling more efficient distributed training. <br> 따라서 RDMA 및 RoCEv2 같은 핵심 기술을 도입하여, 호스트 커널 오버헤드를 배제하고 전송 지연 시간을 단축해 분산 학습 효율을 보존해야 합니다.

The objective is to keep GPUs busy rather than waiting on network communication. <br> 분산 인프라 설계의 본질적인 목적은 초고가의 GPU들이 네트워크 전송 동기화를 대기하며 낭비되는 시간을 차단하고 쉬지 않고 계산 코어가 돌도록 하는 것입니다.

---

# Korean Summary

AI 모델이 커질수록 <br> AI 모델 매개변수가 기하급수적으로 늘어남에 따라

GPU 1대로는 학습이 불가능하다. <br> 단일 GPU의 메모리(HBM) 한계로 더 이상 한 대로는 학습이 불가능합니다.

그래서 여러 GPU가 함께 학습한다. <br> 그래서 다수의 연산 노드를 연결하여 데이터를 나누어 병렬로 학습합니다.

문제는 <br> 다만 이로 인해 생성되는 병목은

GPU끼리 계속 데이터를 주고받아야 한다는 것이다. <br> 매 에포크/스텝마다 GPU들이 모델 업데이트용 데이터를 상호 전송해야 한다는 것입니다.

---

GPU 계산 <br> 1단계: GPU 코어 연산 수행
↓
Gradient 생성 <br> 2단계: 가중치 조정을 위한 그래디언트 생성
↓
다른 GPU와 공유 <br> 3단계: 네트워크를 통해 다른 노드의 GPU로 송신
↓
동기화 <br> 4단계: 전체 연산 결과 취합 및 동기화 정렬
↓
다음 Step 진행 <br> 5단계: 정렬 완료 후 다음 단계 계산 재개

---

네트워크가 느리면 <br> 전송 선로 속도 및 지연이 나빠지면

GPU가 계산보다 대기하는 시간이 많아진다. <br> 고가의 GPU 장치가 연산 대신 네트워크 정렬을 기다리는 시간이 늘어 효율이 폭락합니다.

---

그래서 <br> 따라서 시스템 성능 극대화를 위해

RDMA <br> - RDMA (원격 다이렉트 메모리 액세스)

RoCE <br> - RoCEv2 (이더넷 기반 고속 RDMA 프로토콜)

InfiniBand <br> - InfiniBand (초저지연 무손실 고속 패브릭 선로)

가 중요하다. <br> 등 초고성능 네트워크 인프라 기술 도입이 핵심입니다.

---

# Training Architecture

Training Job <br> 학습 잡 구동
↓
Multiple Servers <br> 다중 서버 노드 할당
↓
Multiple GPUs <br> 노드당 다중 GPU 탑재 (8x GPU 등)
↓
Gradient Exchange <br> 생성된 그래디언트(가중치 편차) 고속 교환
↓
Model Synchronization <br> 전 노드 매개변수 동기화 병합 (AllReduce)
↓
Next Training Step <br> 정렬 즉시 다음 훈련 스텝 개재

---

# Why Networking Matters

## Single GPU

No synchronization required. <br> 단일 서버/GPU 학습 시에는 외부 동기화 지연 요소가 존재하지 않습니다.

---

## Multi-GPU

Requires synchronization. <br> 단일 노드 내부의 8개 GPU 간에는 NVLink 고속 버스(900 GB/s)를 통한 고성능 초저지연 동기화가 요구됩니다.

---

## Multi-Node Training

Requires massive communication. <br> 여러 대의 물리 서버를 연결할 때는 물리 네트워크 스위치망을 거쳐 기가바이트 수준의 동기화 데이터를 교환해야 합니다.

---

As the cluster grows: <br> 클러스터가 커질수록:

Communication Cost <br> 통신에 사용되는 시간(Cost)
↑
Network Importance <br> 네트워크 인프라의 중요성
↑

---

# Important Concepts

## Gradient

Information generated during training. <br> 모델 가중치를 어느 방향으로 업데이트할지 결정하기 위해 오차 역전파 과정에서 계산되는 값입니다.

Used to update model weights. <br> 이 수치들을 종합하여 최종 신경망의 가중치 변수(Parameters)들을 업데이트합니다.

---

## Synchronization

All GPUs must agree on updated parameters. <br> 분산 학습 중인 모든 GPU 노드가 다음 계산 스텝으로 넘어가기 전, 계산된 파라미터 값이 동일하게 적용되도록 주소를 일치시키는 정렬 작업입니다.

---

## AllReduce

Most common distributed training operation. <br> 분산 학습에서 가장 지배적으로 사용되는 데이터 축소/수집용 Collective Communication 연산입니다.

Purpose <br> 도입 목적:

Combine gradients from multiple GPUs. <br> 모든 GPU 서버에 흩어진 각각의 그래디언트들을 다 수집해 합산(또는 평균)한 후, 결과를 다시 전 노드의 GPU들로 원상태 그대로 복사 분배합니다.

---

# Simplified Example

GPU 1

Gradient A <br> 1번 GPU: 계산값 A 생성

---

GPU 2

Gradient B <br> 2번 GPU: 계산값 B 생성

---

GPU 3

Gradient C <br> 3번 GPU: 계산값 C 생성

---

GPU 4

Gradient D <br> 4번 GPU: 계산값 D 생성

---

AllReduce <br> 올리듀스(AllReduce) 호출
↓
Combine <br> 1단계: 전 노드 데이터 수집
↓
Average <br> 2단계: 수집한 오차 값의 산술 평균 계산
↓
Distribute <br> 3단계: 정제 완료된 동일 데이터를 전 노드 GPU로 즉각 전송
↓
Continue Training <br> 4단계: 업데이트 확인 후 다음 단계로 전력 질주

---

# Why RDMA Helps

Traditional TCP <br> 전통적인 TCP/IP 통신

Application <br> 유저 영역 애플리케이션
↓
Kernel <br> 커널 영역 (소켓 전송 및 시스템 콜 점유)
↓
TCP Stack <br> 호스트 CPU에 의한 패킷 체크섬/분할 연산
↓
Network <br> 스위치 회선망 전송 (유실 위험)
↓
Kernel <br> 상대 수신측 호스트 OS 커널 개입 및 버퍼 복사
↓
Application <br> 유저 스페이스 수신

Higher Latency <br> RTT 전송 지연 시간 증가 (10~50us 이상)

Higher CPU Usage <br> OS 시스템 CPU 점유율 증가 및 softirq 오버헤드 유발

---

RDMA <br> RDMA 통신

Application <br> 유저 영역 메모리 버퍼
↓
RDMA NIC <br> RNIC 카드가 PCIe 버스를 통해 다이렉트 DMA 수행 (커널 바이패스)
↓
Network <br> 무손실 이더넷(RoCEv2) / 인피니밴드 선로 이송
↓
Remote Memory <br> 대상지 서버 메모리에 즉시 원격 직접 기록 (Zero-Copy)

Lower Latency <br> 초저지연 RTT 보장 (1us 미만)

Lower CPU Usage <br> 호스트 CPU 관여도 0% 수준 오프로드 달성

---

# Common Bottlenecks

## Storage Bottleneck

Symptoms <br> 유발 증상:

GPUs wait for data. <br> 스토리지에서 학습 파일(이미지/동영상 등)을 제때 불러오지 못해 GPU SM 사용량(SM Utility)이 0%로 내려가며 연산이 중단됩니다 (GPU Starvation).

---

## Network Bottleneck

Symptoms <br> 유발 증상:

GPUs wait for synchronization. <br> 학습은 열심히 하고 있지만 다음 스텝으로 진행하기 위해 타 노드들의 AllReduce 수신을 기다리며 정체되는 동기화 정체 현상(Stall)이 심화됩니다.

---

## CPU Bottleneck

Symptoms <br> 유발 증상:

Communication overhead increases. <br> TCP 통신 시 네트워크 처리에 호스트 시스템 CPU 코어가 과다 점유되어 원천 데이터 전처리(Data Preprocessing) 속도가 마비됩니다.

---

## Scheduler Bottleneck

Symptoms <br> 유발 증상:

Resources remain idle. <br> 스케줄러가 노드를 비효율적으로 배치하여 리소스가 유휴 상태로 방치되고 작업 대기열 정체가 늘어납니다.

---

# Common Interview Follow-up

### Q1

Why can't we simply use TCP? <br> 단순히 성능 검증된 기성의 TCP를 사용하여 분산 학습 환경을 구성하면 안 되는 명확한 이유는 무엇인가요?

Expected Answer

TCP works but introduces additional CPU overhead and latency. <br> TCP로도 분산 학습 구성은 가능하나, OS 커널 계층과 소켓 복사 연산(2-Copy)이 수반되어 극심한 CPU 오버헤드와 10배 이상의 네트워크 지연이 발생합니다. 이는 수천 개의 GPU 성능을 깎아 먹는 근본 병목이 됩니다.

---

### Q2

What happens if network latency increases? <br> 분산 학습망에서 네트워크 홉(Hop) 또는 라우팅 선로 지연 속도(Latency)가 상승하면 어떤 연쇄적 영향이 발생하나요?

Expected Answer

GPU synchronization becomes slower and training efficiency decreases. <br> 네트워크 지연 시간은 AllReduce 연산 완료 시간에 정비례하여 길어집니다. 따라서 GPU가 갱신된 가중치를 기다리며 대기(Stall)하는 빈도가 늘어나고, 결과적으로 클러스터 전체의 학습 생산성(TFLOPS/가동률)이 파괴됩니다.

---

### Q3

What is AllReduce? <br> 분산 딥러닝에서 전유되는 올리듀스(AllReduce)의 통신 기전은 무엇이며 어떻게 최적화할 수 있나요?

Expected Answer

An operation that combines gradients across multiple GPUs and distributes the result back. <br> 각 연산 노드의 로컬 GPU가 계산한 그래디언트 벡터들을 모두 취합하여 산술 평균을 계산한 뒤, 이 정제된 값을 학습에 참여한 모든 GPU 메모리 주소에 균등 분배하는 분산 연산 프로토콜입니다. 링-올리듀스(Ring-AllReduce) 또는 계층적 트리 토폴로지를 구성해 네트워크 사용 대역폭을 최소화하도록 최적화합니다.

---

### Q4

Why is RDMA commonly used in AI infrastructure? <br> RDMA 기술이 현대 분산 AI 데이터센터 인프라 설계의 핵심 필수 장비로 자리 잡은 본질적 가치는 무엇인가요?

Expected Answer

It reduces communication overhead and improves distributed training efficiency. <br> 네트워크 통신 처리를 호스트 OS 커널과 CPU에서 완전히 분리(Offloading/Kernel Bypass)하고 원격 서버 메모리에 Zero-copy로 다이렉트 이송하기 때문입니다. 이를 통해 전송 지연을 sub-microsecond 수준으로 낮춰 대규모 노드 확장 시의 훈련 효율 저하를 완벽 차단합니다.

---

### Q5

What becomes the bottleneck as clusters grow? <br> GPU 인프라의 계산 카드를 수백 대 단위에서 수천, 수만 대 수준으로 확장할 때 실질적으로 마주치는 가장 거대한 성능 한계 병목은 무엇입니까?

Expected Answer

Network communication often becomes the limiting factor. <br> 단일 GPU 카드의 연산 속도 증가분보다 물리 네트워크 스위치망을 거쳐 여러 노드 간 통신하는 패브릭 통신 비용(Communication Bottleneck)이 지배적으로 급증합니다. 따라서 통신 병목을 제어하지 못하면 노드 확장에 따른 성능 상승이 선형적으로 늘어나지 못하고 정체 구간에 돌입합니다.

---

# Real Production Perspective

Small Model <br> 소형 모델 학습 시:
↓
Single Node <br> 단일 물리 서버 점유
↓
Network Less Important <br> 네트워크 속도가 학습 전체에 미치는 영향이 매우 작음

---

Large Model <br> 거대 파라미터 모델(LLM 등) 학습 시:
↓
Multiple Nodes <br> 다수의 물리 노드 결합 분산 학습
↓
Frequent Synchronization <br> 에포크당 수천 번의 빈번한 매개변수 동기화 발생
↓
Network Critical <br> 네트워크 지연과 유실율이 학습 완성 시간에 절대적인 영향 미침

---

This is why large AI environments invest heavily in: <br> 대기업 및 대규모 연구소들이 아래 장비에 조 단위의 예산을 아끼지 않고 투자하는 기술적 근원입니다:

- RDMA <br> - RDMA 고속 전송 기술 규격 적용
- RoCE <br> - RoCEv2 지원 ConnectX 고성능 스마트 NIC
- InfiniBand <br> - 인피니밴드 전용 전 구간 스위치 패브릭망
- High-performance storage <br> - VAST Data 같은 병렬 분산 올플래시 스토리지 시스템

---

# ByteDance Relevance

ByteDance operates massive recommendation and AI training platforms. <br> 바이트댄스는 하루에 수십억 명의 사용자에게 실시간 맞춤 컨텐츠를 제공하는 거대 추천 엔진과 대용량 추천 칩셋, 초거대 LLM 분산 학습 환경을 운영합니다.

Key Topics <br> 핵심 인프라 평가 주제:

- Distributed Training <br> - 대규모 매개변수 분산 가속화 방법론
- GPU Infrastructure <br> - 대규모 GPU 인프라 장애 제어 능력
- High Performance Networking <br> - RDMA/RoCEv2 등 패킷 유실 방지망 구축
- Resource Efficiency <br> - 유휴 연산 자원 비용 회수 및 가동 효율화
- Infrastructure Reliability <br> - 스위치 포화 및 노드 오프라인 시 서비스 신뢰성 확보

---

# Personal Notes

Strong Interview Message <br> 면접에서 각인시킬 핵심 아키텍처 관점:

As AI systems scale, communication becomes just as important as computation. <br> "AI 인프라가 멀티 노드 스케일로 커질수록 엔지니어의 참된 평가는 연산(Computation) 성능을 얼마나 높였느냐보다 통신(Communication) 구간의 병목과 오버헤드를 얼마나 완벽하게 억제했느냐에서 결정됩니다."

---

Strong Interview Quote <br> 면접관을 매료시킬 실무 엔지니어의 핵심 인용구:

"In large-scale AI training, the fastest GPU is useless if it spends most of its time waiting on the network." <br> "대규모 인공지능 분산 학습 환경에서 아무리 빠른 최첨단 GPU를 수천 대 구축해 놨다 하더라도, 네트워크 전송과 동기화 정렬을 기다리는 시간이 하루의 절반 이상이라면 그 인프라는 껍데기뿐인 고비용 실패작입니다."

---

# Related Topics

- [gpu-q01-rdma-vs-tcp.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q01-rdma-vs-tcp.md)
- [gpu-q02-roce.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q02-roce.md)
- [gpu-q03-vast-storage.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q03-vast-storage.md)
- [gpu-q04-gpu-cluster-architecture.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q04-gpu-cluster-architecture.md)

---

## Status

Studying
