# Metadata

Category: GPU & AI Infrastructure

Subcategory: GPU Cluster Architecture

Difficulty: Hard

Importance: ★★★★★

Frequency: ★★★★☆

Related Topics:

- GPU Training
- RDMA
- RoCE
- VAST Storage
- Kubernetes
- Slurm
- DCGM

Interview Rounds:

- Technical Interview
- Hiring Manager
- Onsite

Tags:

gpu, ai-infrastructure, training, rdma, storage, architecture

---

# gpu-q04-gpu-cluster-architecture.md

# GPU & AI Infrastructure Interview Question 04

## Explain a Modern GPU Training Cluster Architecture

### Difficulty

Hard

### Importance

★★★★★

### Frequency

★★★★☆

---

# Quick Recall

GPU Cluster = Compute + Storage + Network + Scheduler + Monitoring <br> GPU 클러스터 = 연산(Compute) + 저장(Storage) + 망(Network) + 스케줄러(Scheduler) + 관제(Monitoring)

Key Components <br> 핵심 구성 요소:
- GPU Nodes <br> - GPU 연산 노드 (NVIDIA H100 등 고성능 가속기 탑재 서버)
- RDMA Network <br> - RDMA 고속 통신망 (RoCEv2 / InfiniBand 무손실 선로)
- Shared Storage <br> - 공유 스토리지 (VAST Data, Lustre 등 병렬 올플래시 스토리지)
- Scheduler <br> - 자원 스케줄러 (Slurm, Kubernetes 등 GPU 할당 관리 시스템)
- Observability <br> - 모니터링 레이어 (Prometheus, Grafana, DCGM 등 시스템 관제)

---

# Interview Question

Can you explain the architecture of a modern GPU training cluster? <br> 현대적인 대규모 GPU 분산 학습 클러스터의 아키텍처 구조를 설명해 주시겠습니까?

What components are required? <br> 이를 안정적으로 구축하고 가동하기 위해 요구되는 핵심 구성 요소들은 무엇입니까?

---

# Interviewer's Intent

The interviewer wants to evaluate: <br> 면접관은 다음 역량을 평가하고자 합니다:

- AI infrastructure knowledge: Comprehensive system understanding of modern training stacks. <br> - AI 인프라 아키텍처 지식: 분산 학습 환경에서 리소스 상호작용 및 오버헤드 요인 식별 능력.
- Systems thinking: Connecting hardware layers with software scheduler abstractions. <br> - 시스템적 사고력: 물리 하드웨어 레이어(GPU 노드, 스위치망, 스토리지)와 소프트웨어 오케스트레이션 간의 연결 관계 구성 능력.
- Distributed systems understanding: Understanding collective communications, synchronization stalls. <br> - 분산 시스템 이해도: 노드 간 분산 학습 시 일어나는 동기화 지연 및 올리듀스(AllReduce) 동작 형태에 대한 인식.
- GPU operations experience: Practical familiarity with GPU power, temperatures, and DCGM logs. <br> - GPU 운영 실무 지식: GPU 온도, 전력 소모량, VRAM 누수 및 DCGM 로그 분석을 활용한 프로덕션 트러블슈팅 경험.
- Modern data center architecture knowledge: Lossless fabric layouts, InfiniBand vs. RoCEv2 trade-offs. <br> - 데이터센터 설계 지식: 무손실 이더넷 및 스위치 토폴로지 구성, 인피니밴드와 RoCEv2 도입 요건 비교.

---

# Recommended Answer (English)

A modern GPU training cluster consists of several major components. <br> 현대적인 GPU 분산 학습 클러스터는 여러 핵심 기능 계층으로 구성됩니다.

First, there are GPU compute nodes that perform model training and inference workloads. <br> 첫째, 인프라의 중심에는 실제 딥러닝 모델 학습 및 추론 연산 워크로드를 수행하는 GPU 연산 노드(Compute Node)들이 존재합니다.

Second, there is a high-performance storage platform that provides training datasets and model artifacts. <br> 둘째, 학습용 원천 데이터셋을 노드들로 고속 공급하고 최종 모델 가중치(Checkpoint)를 저장하는 초고성능 분산 공유 스토리지 플랫폼이 필수적입니다.

Third, there is a low-latency, high-throughput network fabric, often based on RDMA technologies such as RoCE or InfiniBand. <br> 셋째, 노드 간 동기화 지연을 없애기 위해 RoCEv2 또는 InfiniBand 기반의 초저지연·고대역폭 RDMA 전용 네트워크 패브릭이 구축됩니다.

Fourth, there is a scheduling layer responsible for allocating resources to jobs. Examples include Slurm and Kubernetes. <br> 넷째, 사용자가 투약한 학습 잡(Job)에 맞춰 노드를 스케줄링하고 GPU 자원을 정밀 할당 및 격리해 주는 스케줄러 계층(Slurm 또는 Kubernetes)이 필요합니다.

Finally, observability systems monitor GPU utilization, storage performance, network health, and infrastructure reliability. <br> 마지막으로, 수만 개의 GPU 상태, 스토리지 입출력, 망 트래픽 등을 실시간 모니터링하여 장애를 미연에 감지하는 관제 시스템(Observability)이 결합됩니다.

The goal is to minimize communication bottlenecks and maximize GPU utilization because idle GPUs are extremely expensive. <br> 클러스터 설계의 궁극적 목표는 네트워크 및 스토리지 구간의 병목을 완전히 제거하여, 유휴 상태일 때 막대한 비용 손실을 발생시키는 GPU의 실제 가동률(GPU Utilization)을 90% 이상으로 극대화하는 것입니다.

---

# Korean Summary

GPU 분산 학습 환경에서 통신 및 스토리지 병목을 제거하여 초고가의 GPU 자원 가동률을 극대화하는 것이 핵심인 5대 요소 아키텍처입니다. <br> 하드웨어 레이어(GPU 노드, 스위치망, 스토리지)와 소프트웨어 레이어(스케줄러, 관제 시스템)가 유기적으로 연동되어 분산 연산을 수행합니다.

- **GPU Compute**: NVIDIA H100/B200 등의 가속기가 다중 결합되어 대규모 연산을 수행하는 호스트 서버들.
- **Storage Layer**: VAST Data, BeeGFS 등의 초고속 병렬 올플래시 스토리지로 데이터셋 고속 로딩 보장.
- **Network Layer**: RoCEv2 또는 InfiniBand 기반의 RDMA 네트워크로 GPU 메모리 간 데이터 다이렉트 이송.
- **Scheduler**: 물리 연산 노드 자원 분배 및 잡 대기열을 조율하는 Slurm 및 쿠버네티스 레이어.
- **Monitoring**: GPU 온도, 전력, 메모리 사용량 및 네이티브 하드웨어 지표를 추적하는 DCGM 및 프로메테우스 관제.

---

# High-Level Architecture

Users <br> 사용자 (연구원/엔지니어)
↓
Training Jobs <br> 학습 잡 제출
↓
Scheduler <br> 스케줄러 (Slurm / Kubernetes)
↓
GPU Nodes <br> GPU 연산 서버 노드
↓
RDMA Network <br> RDMA 초고속망 (RoCE / InfiniBand)
↓
Shared Storage <br> 고성능 분산 공유 스토리지
↓
Training Data <br> 학습 데이터셋 고속 이송

---

# Core Components

## GPU Compute Nodes
Purpose <br> 도입 목적:
Model Training <br> 인공지능 모델 학습 및 연산 가속화

Examples <br> 주요 하드웨어:
- NVIDIA H100
- NVIDIA A100
- NVIDIA B200

Responsibilities <br> 수행 역할:
- Training <br> - 대규모 매개변수 가중치 학습 (Training)
- Inference <br> - 실시간 모델 추론 서비스 (Inference)
- Fine-tuning <br> - 미세조정 및 다운스트림 태스크 학습 (Fine-tuning)

---

## Storage Layer
Purpose <br> 도입 목적:
Provide training datasets. <br> 학습용 대용량 멀티미디어 데이터셋 및 중간 체크포인트를 병목 없이 로드/세이브합니다.

Examples <br> 주요 스토리지 솔루션:
- VAST Data
- NetApp
- BeeGFS
- Lustre

Requirements <br> 요구 조건:
- High Throughput <br> - 초고대역폭 전송 능력 (초당 수십~수백 GB 이상 가동)
- Low Latency <br> - 초저지연 읽기/쓰기 속도 보장
- Scalability <br> - 용량 및 노드 확장성 (Scale-out)

---

## Network Layer
Purpose <br> 도입 목적:
Node-to-node communication. <br> 노드 간 파라미터 및 그래디언트를 실시간으로 공유하고 전송합니다.

Examples <br> 주요 프로토콜 규격:
- RoCE
- InfiniBand

Requirements <br> 요구 조건:
- Low Latency <br> - 마이크로초 단위 RTT 지연 속도
- High Throughput <br> - 백엔드 전송 회선 대역폭 보장 (200G/400Gbps 이상)
- Minimal Packet Loss <br> - 패킷 유실 제로 (Zero packet loss) 유지

---

## Scheduler Layer
Purpose <br> 도입 목적:
Allocate GPU resources. <br> 여러 사용자 요청에 맞춰 노드를 할당하고 자원 경합을 제어합니다.

Examples <br> 주요 플랫폼:

### Slurm
Popular in HPC. <br> 전통적인 고성능 슈퍼컴퓨팅(HPC) 환경에서 널리 검증된 작업 스케줄링 솔루션입니다.

---

### Kubernetes
Popular in Cloud Native AI Platforms. <br> 클라우드 네이티브 환경 및 컨테이너 기반 AI 플랫폼(Kubeflow 등)에서 널리 채택되는 스케줄링 플랫폼입니다.

---

# Why RDMA Matters

## Without RDMA
GPU <br> GPU 연산 완료
↓
TCP Stack <br> 호스트 TCP 스택 가동 (CPU 간섭)
↓
Kernel <br> OS 커널 공간 복사 및 컨텍스트 스위칭
↓
Network <br> 네트워크 송출
↓
Higher Latency <br> RTT 지연 속도 증가
↓
Lower Efficiency <br> 연산 장치 가동률 하락

---

## With RDMA
GPU <br> GPU 연산 완료
↓
RDMA NIC <br> 하드웨어 NIC가 직접 원격지 메모리 액세스 (Zero-Copy)
↓
Network <br> 이더넷/인피니밴드 무손실 전송
↓
Remote Memory <br> 원격 서버 메모리 버퍼 즉각 기록
↓
Lower Latency <br> RTT 지연 시간의 극적인 단축 (1us 미만)
↓
Higher Efficiency <br> 병목 없는 고가동 연산 유지

---

# Monitoring Layer

Examples <br> 관제 솔루션 구성:
- DCGM (Data Center GPU Manager)
- Prometheus
- Grafana

Metrics <br> 수집 대상 지표:
- GPU Utilization <br> - 실제 GPU 스트리밍 멀티프로세서(SM) 가동률
- GPU Memory <br> - VRAM 할당량 및 대역폭 점유율
- Temperature <br> - 그래픽 칩셋 물리 발열 온도
- Power Usage <br> - 전력 소모량 추이
- Network Throughput <br> - RDMA 카드 대역폭 이송량
- Storage Throughput <br> - 공유 파일시스템 입출력 대역폭

---

# Common Bottlenecks

## Storage Bottleneck
Symptoms <br> 유발 증상:
- GPUs idle <br> - 스토리지 데이터 로딩 지연으로 GPU가 연산을 멈추고 대기 (GPU Starvation)
- Data loading slow <br> - 데이터 파이프라인의 에포크(Epoch) 지연 시간 증가

---

## Network Bottleneck
Symptoms <br> 유발 증상:
- Slow synchronization <br> - 분산 훈련 노드 간 동기화 구간(AllReduce)에서의 심한 랙 유발
- Poor scaling <br> - 연산 노드를 늘려도 학습 속도가 향상되지 않고 정체되는 선형 성능 한계 봉착

---

## Scheduler Bottleneck
Symptoms <br> 유발 증상:
- Resource fragmentation <br> - 노드 할당 파편화로 단일 잡에 필요한 연속된 노드 확보 불가
- Low utilization <br> - 전체 클러스터의 평균 GPU 사용량 하락

---

## GPU Utilization Bottleneck
Symptoms <br> 유발 증상:
- Expensive hardware underutilized <br> - 초고가의 하드웨어 인프라가 실질 연산을 수행하지 못해 감가상각 및 투자 대비 비용 손실(ROI) 악화

---

# Common Interview Follow-up

### Q1
Why do AI clusters need RDMA? <br> 왜 일반 TCP 대신 초고가 RDMA 환경을 AI 클러스터에 필수 구축해야 합니까?

Expected Answer
Distributed training requires extremely fast communication between GPU nodes. Traditional TCP creates major latency and CPU overhead during synchronizing weights (gradients), which halts GPU compute. <br> 수백 수천 대의 노드가 가중치 매개변수를 실시간으로 동기화해야 하는 분산 학습의 특성상, 기존 TCP 방식은 커널 오버헤드와 전송 지연이 심해 분산 성능 향상을 가로막기 때문입니다. RDMA만이 GPU 가동 중단(Stall) 시간을 방지할 수 있습니다.

---

### Q2
Why is storage performance important? <br> GPU 연산 성능이 우수해도 스토리지 입출력 성능이 미치지 못하면 어떻게 되나요?

Expected Answer
GPUs cannot train efficiently if data cannot be delivered fast enough. This leads to "GPU starvation" where expensive accelerators sit idle waiting for IO. <br> 아무리 빠른 GPU라도 훈련용 원천 데이터(이미지, 텍스트, 비디오 등)를 충분한 속도로 공급받지 못하면, 읽기 쓰기가 완료될 때까지 동작을 멈추고 대기하는 'GPU Starvation' 현상이 일어나며 전체 인프라 가용률이 붕괴됩니다.

---

### Q3
Why is GPU utilization important? <br> 실무에서 'GPU Utilization(가동률)' 수치를 집중 관리하는 근본적인 경영/인프라적 이유는 무엇인가요?

Expected Answer
GPUs are extremely expensive resources. Idle GPUs represent a massive waste of infrastructure investment and increase cloud/data center bills without value. <br> 단일 GPU 및 연산 노드의 구매/임대 비용이 극도로 높기 때문입니다. 가동률이 낮아 노드가 노는 것은 결국 매시간 수만 달러의 하드웨어 감가상각 비용과 인프라 운영 비용을 낭비하는 꼴이 됩니다.

---

### Q4
Would you choose Slurm or Kubernetes? <br> AI 연산 스케줄링을 위해 Slurm and Kubernetes 중 무엇을 선호하나요?

Expected Answer
It depends on workload requirements. Slurm is highly efficient for bare-metal multi-node batch jobs common in deep learning. Kubernetes is preferred for cloud-native AI platforms that need dynamic orchestration, container isolation, and integration with microservices. <br> 워크로드의 특성에 따라 다릅니다. 물리 하드웨어를 직접 제어하며 여러 연산 노드에 배치 작업을 즉시 실행하는 전통적인 AI 모델 연구에는 Slurm이 강점이 있습니다. 반면 다수의 사용자가 자원을 공유하고 마이크로서비스 연계 및 컨테이너 격리가 필요한 클라우드 네이티브 플랫폼 구축에는 Kubernetes가 적합합니다.

---

### Q5
What is the most common bottleneck in modern clusters? <br> 현대의 AI 클러스터에서 실질적으로 가장 흔히 만나는 성능 병목 지점은 어디인가요?

Expected Answer
Usually storage latency, networking congestion, or data pre-processing (data loading pipeline) rather than GPU compute limits. <br> 단순 GPU 자체의 연산 속도 한계보다는 스토리지 데이터 로드 대역폭, 네트워크 스위치의 패킷 유실 및 대기, 혹은 CPU 단에서의 학습용 이미지/비디오 데이터 전처리(Data Loading Pipeline) 병목이 가장 자주 관찰되는 장애 지점입니다.

---

# Real Production Example

GPU Cluster <br> 연산 장치:
GPU Training Nodes (64x H100) <br> 64대의 H100 가속기로 구성된 GPU 학습 클러스터
↓
VAST Storage <br> 공유 스토리지:
VAST High Throughput Storage System <br> VAST 초고속 병렬 공유 파일시스템
↓
RoCE Network <br> 전송 회선망:
lossless RoCEv2 Network Fabric <br> PFC가 인가된 무손실 RoCEv2 고속 패브릭망
↓
GPU Training Jobs <br> 수행 잡:
Distributed LLM Training Workloads <br> 거대 언어 모델(LLM) 분산 학습 작업 실행

Observed <br> 실제 이상 현상:
Training throughput lower than expected. <br> 데이터 이송 속도 저하로 인해 예상 학습 생산성 대비 40% 이상 하락하는 성능 감쇠 감지.

Investigation <br> 원인 규명 조사:
We ruled out hardware layers systematically: <br> 데이터 입송 선로를 계층별로 정밀 캡처하여 검증했습니다:
- Storage <br> - 1단계: 스토리지 드라이브 쓰기 응답성 검증 (정상)
- Network <br> - 2단계: 물리 케이블 및 스위치 포트 점유율 검증 (정상)
- RDMA <br> - 3단계: RoCEv2 프로토콜 드라이버 연결 검증 (정상)
- Operating System <br> - 4단계: 호스트 OS 가상 메모리 및 파일시스템 입출력 분석 (파편화 포착)

Root Cause <br> 최종 규명된 근본 원인:
NFS Client IO Fragmentation. Ubuntu OS kernel bug causing large sequential writes to be split into tiny packets. <br> 우분투 호스트 커널 단의 NFS 클라이언트 입출력 파편화 버그. 이 버그로 대용량 순차 쓰기가 무수히 쪼개져 IOPS 폭증을 일으켰습니다.

Result <br> 최종 해결 조치:
Performance restored after driver patch implementation, recovering writing speed to 42 GB/s. <br> 드라이버 레이어에 전송 패킷 재조합(Reassembly) 기능을 패치하여, 원래 대역폭 속도를 성공적으로 복구했습니다.

---

# ByteDance Relevance

This architecture closely matches the infrastructure requirements of large-scale AI and recommendation systems. <br> 이 아키텍처 구성 요소와 병목 제어 기술은 대용량 추천 알고리즘과 거대 딥러닝 훈련 망을 대규모로 운영해야 하는 기업(바이트댄스 등)의 실제 프로덕션 환경과 일치합니다.

Relevant Topics <br> 핵심 평가 항목:
- Distributed Training <br> - 대형 분산 AI 모델 가속화 기법
- GPU Infrastructure <br> - 대규모 GPU 인프라 장애 제어 능력
- Storage Systems <br> - 초고성능 분산 스토리지 아키텍처 최적화
- High Performance Networking <br> - RDMA/RoCEv2 무손실 고속 통신 튜닝
- Reliability Engineering <br> - 시스템 가동률 극대화를 위한 SRE 방법론

---

# Personal Notes

Strong Interview Message <br> 면접에서 어필할 강력한 핵심 메시지:
"The goal of a GPU cluster is not simply to provide GPUs. The goal is to ensure GPUs remain productive by eliminating storage, network, and scheduling bottlenecks." <br> "GPU 클러스터의 성공 여부는 단지 비싼 GPU 카드를 많이 꽂는 것에 달린 것이 아닙니다. 스토리지 입출력, 네트워크 구간, 스케줄링 자원 낭비를 완벽히 제거하여 비싼 GPU 하드웨어가 1초도 쉬지 않고 연산할 수 있는 윤활유(환경)를 칠해주는 것이 엔지니어의 핵심 역할입니다."

---

Strong Interview Quote <br> 면접관에게 전할 강렬한 한마디:
"In large AI environments, the challenge is usually not GPU performance. The challenge is feeding GPUs efficiently." <br> "대규모 분산 AI 인프라 환경에서 연산 하드웨어 성능 자체는 차고 넘칩니다. 진짜 기술력은 그 배고픈 GPU 연산 코어들에게 데이터를 굶기지 않고 얼마나 고속으로 먹이를 퍼다 줄(데이터를 흐르게 할) 수 있느냐에서 갈립니다."

---

# Related Topics

- [gpu-q01-rdma-vs-tcp.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q01-rdma-vs-tcp.md)
- [gpu-q02-roce.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q02-roce.md)
- [gpu-q03-vast-storage.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q03-vast-storage.md)
- [gpu-q05-distributed-training.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q05-distributed-training.md)

---

## Status

Studying
