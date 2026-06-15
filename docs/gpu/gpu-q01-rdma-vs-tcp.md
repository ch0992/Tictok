# Metadata

Category: GPU & AI Infrastructure
Subcategory: RDMA
Difficulty: Hard
Importance: ★★★★★
Frequency: ★★★★☆
Related Topics:
- TCP
- RoCE
- InfiniBand
- GPU Cluster
- VAST Storage
- AI Training Infrastructure
Interview Rounds:
- Technical Screen
- Hiring Manager
- Onsite
Tags:
rdma, roce, gpu, ai-infrastructure, networking, storage

---

# gpu-q01-rdma-vs-tcp.md

# GPU & AI Infrastructure Interview Question 01

## Explain the Difference Between TCP and RDMA

### Difficulty

Hard

### Importance

★★★★★

### Frequency

★★★★☆

---

# Quick Recall

TCP: Processes data through the kernel network stack, causing CPU context switches and memory copy overhead. <br> TCP: 커널 네트워크 스택을 거쳐 데이터를 처리하므로 CPU 컨텍스트 스위칭과 메모리 복사 복잡성이 유발됩니다.

- Higher CPU Usage: Every packet requires OS CPU involvement. <br> - 높은 CPU 사용률: 패킷을 전송할 때마다 운영체제 커널과 CPU 자원을 대량 소모합니다.
- Higher Latency: Socket buffers and stack processing add RTT delay (typically 10-50 microseconds). <br> - 높은 지연 시간: 소켓 버퍼 및 스택 연산으로 인해 마이크로초 단위의 RTT 지연이 추가됩니다.
- General Purpose: Works on any ethernet network out-of-the-box. <br> - 범용성: 표준 이더넷 네트워크라면 별도의 하드웨어 설정 없이 즉시 동작합니다.

RDMA: Remote Direct Memory Access bypasses the CPU and kernel stack, writing directly to remote memory. <br> RDMA: 원격 직접 메모리 접근 방식으로, CPU와 커널 스택을 우회하여 원격 메모리에 데이터를 직접 기록합니다.

- Kernel Bypass: Applications talk directly to the NIC, avoiding context switches. <br> - 커널 우회: 애플리케이션이 커널을 통하지 않고 NIC와 직접 데이터를 송수신합니다.
- Zero Copy: Data transfers directly between user-space memory buffers without kernel copies. <br> - 제로 카피: 소켓 버퍼로의 중간 메모리 복사 과정 없이 사용자 메모리 간 데이터를 직접 읽고 씁니다.
- Ultra-Low Latency: Achieves sub-microsecond latency (under 1 microsecond). <br> - 초저지연: 1마이크로초 미만(sub-microsecond)의 지연 시간을 제공합니다.

AI training clusters prefer RDMA to avoid communication bottlenecks during GPU synchronization (e.g. AllReduce). <br> AI 분산 학습 클러스터는 GPU 간 매개변수 동기화(AllReduce 등) 시 발생하는 통신 병목을 극복하기 위해 RDMA를 필수적으로 사용합니다.

---

# Interview Question

Can you explain the difference between TCP and RDMA? <br> TCP와 RDMA의 차이점을 설명해 주시겠습니까?

Why is RDMA important for AI and GPU infrastructure? <br> AI 및 GPU 인프라 환경에서 RDMA가 왜 중요한가요?

---

# Interviewer's Intent

The interviewer wants to evaluate: <br> 면접관은 다음 역량을 평가하고자 합니다:

- Modern data center networking knowledge: Understanding transport layer offloading and hardware-level transfer mechanisms. <br> - 현대적 데이터센터 네트워킹 지식: 전송 계층 오프로딩 및 하드웨어 수준의 데이터 전송 메커니즘 이해도.
- AI infrastructure experience: Understanding why traditional TCP falls short for large-scale GPU clusters. <br> - AI 인프라 아키텍처 경험: 대규모 GPU 클러스터 분산 연산 시 표준 TCP가 야기하는 병목 지점에 대한 이해.
- High-performance computing concepts: Kernel bypass, zero-copy memory registration, and RDMA over Converged Ethernet (RoCE). <br> - 고성능 컴퓨팅(HPC) 개념 인지: 커널 우회(Kernel Bypass), 제로 카피 메모리 등록(MR), 및 RoCE 기술 요건에 대한 깊이.
- Real-world troubleshooting experience: Diagnosing performance drops caused by TCP fallback in AI clusters. <br> - 프로덕션 트러블슈팅 경험: AI 모델 학습망에서 TCP 폴백에 기인한 성능 격하(Degradation)를 진단하고 해결한 실무 경험.

---

# Recommended Answer (English)

TCP is the traditional transport protocol used by most applications. <br> TCP는 대부분의 애플리케이션이 사용하는 전통적인 네트워크 전송 프로토콜입니다.

Data travels through the operating system's networking stack, which introduces CPU overhead and latency. <br> 데이터는 운영체제 커널의 네트워크 스택을 거쳐 전송되며, 이 과정에서 다수의 메모리 복사(Memory Copy)와 CPU 컨텍스트 스위칭 오버헤드가 발생하여 지연 시간이 추가됩니다.

RDMA, or Remote Direct Memory Access, allows one machine to directly access memory on another machine without involving the remote CPU or operating system kernel. <br> 반면 RDMA(Remote Direct Memory Access)는 원격 장비의 CPU나 운영체제 커널을 개입시키지 않고, 네트워크 카드가 송수신 장비의 메모리에 직접 접근할 수 있도록 보장합니다.

Because RDMA bypasses much of the traditional networking stack, it significantly reduces latency and CPU utilization while increasing throughput. <br> RDMA는 기존 네트워킹 스택 연산을 완전히 건너뛰기(Kernel Bypass) 때문에 지연 시간과 CPU 사용률을 극적으로 낮추는 동시에 데이터 처리량(Throughput)을 늘립니다.

This is particularly important in AI training environments where large amounts of data must move between GPU servers at extremely high speeds. <br> 이는 초대규모 모델 학습 데이터를 GPU 서버 간에 매우 빠른 속도로 끊임없이 주고받아야 하는 AI 분산 학습 환경에서 아주 중요합니다.

In GPU clusters, RDMA enables faster communication between nodes and helps improve overall training performance. <br> GPU 클러스터 내에서 RDMA는 노드 간 동기화 지연을 없애 GPU가 통신 대기 시간 없이 지속해서 연산할 수 있게 하여 전체 인프라의 효율성을 극대화합니다.

---

# Korean Summary

TCP는 일반적인 네트워크 통신 방식입니다. <br> 커널이 통신 전반을 통제하며, 소켓 버퍼를 활용해 패킷을 안전하게 송수신합니다.

데이터의 이동 흐름:
Application (User Space)
↓ (CPU Memory Copy)
Kernel Network Stack (Socket Buffers)
↓ (DMA Copy)
NIC
순서로 이동합니다. <br> 송수신 과정에서 컨텍스트 스위칭 + 커널 메모리 복사 작업으로 인해 지연 시간이 추가됩니다.

RDMA는 원격 직접 메모리 접근 방식입니다. <br> CPU의 개입 없이 원격 메모리 주소 공간을 직접 읽고 쓸 수 있는 하드웨어 지원 기술입니다.

데이터의 이동 흐름:
Application (User Space Registered Memory)
↓ (NIC PCIe DMA directly reads/writes)
Network
↓ (NIC PCIe DMA directly reads/writes)
Remote Memory (User Space Registered Memory)
의 흐름으로 중간 단계 없이 고속 전송이 수행됩니다. <br> 커널 스택 우회(Kernel Bypass) 및 무복사(Zero-Copy)가 핵심입니다.

결과:
- 극도로 낮은 지연 시간 (sub-microsecond 단위)
- 라인 스피드 수준의 높은 처리량 (100G/200G/400Gbps)
- 통신 도중 거의 제로(0%)에 수렴하는 CPU 점유율

AI 학습 클러스터에서는 가중치 매개변수를 동기화할 때 통신 오버헤드를 막기 위해 RDMA가 필수로 선택됩니다.

---

# Architecture Comparison

## TCP

```text
Host A Application (User Space)
  │ (CPU Memory Copy)
  ▼
Kernel Socket Buffer
  │ (TCP/IP Processing + CPU Overhead)
  ▼
Host A NIC Buffer
  │
  ▼  [Network Transit - Millisecond/Microsecond Jitter]
  │
Host B NIC Buffer
  │
  ▼
Kernel Socket Buffer
  │ (CPU Memory Copy + Interrupted CPU)
  ▼
Host B Application (User Space)
```

---

## RDMA

```text
Host A Registered Memory (User Space)
  │
  ▼  [Kernel Bypass & CPU Bypass - RNIC reads memory via PCIe DMA]
Host A RNIC (HCA)
  │
  ▼  [High Speed Infiniband / RoCE Network - sub-1us Latency]
  │
Host B RNIC (HCA)
  │
  ▼  [RNIC writes directly to user memory via PCIe DMA]
Host B Registered Memory (User Space)
```

---

# Why RDMA Matters

AI Training Workloads (Large Language Models, Distributed Compute) <br> 대규모 AI 모델 학습 워크로드
↓
Massive Data Movement (Gigabytes of gradients per step) <br> 초대규모 데이터 이동 (매 스텝마다 기가바이트 단위의 그레이디언트 송출)
↓
Frequent GPU Synchronization (AllReduce / AlltoAll blocking barriers) <br> 빈번한 GPU 동기화 장벽 (AllReduce 동기화로 인한 연산 정지 차단 필요)
↓
Communication Bottleneck (TCP increases training time by up to 50%) <br> 통신 구간 병목 발생 (TCP 사용 시 네트워크 지연이 전체 학습 시간의 절반을 갉아먹음)
↓
RDMA Reduces Overhead (Zero-copy, microsecond transfers keep GPUs saturated) <br> RDMA 오버헤드 완화 (CPU 제로 카피 및 초저지연 중계로 GPU 연산 가동률 유지)
↓
Improved Training Efficiency (Faster time-to-market for AI Models) <br> 학습 효율 대폭 향상 (분산 AI 학습 가속화 완료)

---

# Important Concepts

## Kernel Bypass

The application bypasses the OS kernel networking stack and talks directly to the RDMA hardware (RNIC) through user-space libraries (libibverbs). This eliminates OS context switches and interrupts. <br> 애플리케이션이 OS 커널의 네트워크 레이어를 경유하지 않고 user-space 라이브러리(libibverbs)를 사용해 RDMA 랜카드 하드웨어와 곧바로 통신하여, 시스템 콜로 인한 컨텍스트 스위칭 및 인터럽트 지연을 제거하는 기법입니다.

---

## Zero Copy

Data is transferred directly from the memory of the sending application to the memory of the receiving application without being copied into intermediate socket buffers in kernel space, saving memory bandwidth and CPU cycles. <br> 전송할 데이터를 커널 영역의 임시 소켓 버퍼로 복사하지 않고, 송신 애플리케이션의 메모리 주소에서 수신 애플리케이션의 메모리 주소로 직접 장치가 전달하여 메모리 대역폭과 CPU 연산 낭비를 없애는 전송 방식입니다.

---

## Low Latency

RDMA network latency is typically under 1 microsecond (sub-microsecond), compared to 10-50 microseconds for optimized TCP. <br> 일반적인 최적화 TCP가 10~50마이크로초의 왕복 시간(RTT)을 소모하는 데 반해, RDMA 기반 네트워킹은 1마이크로초 미만(Sub-microsecond)의 극초저지연 성능을 보장합니다.

---

## High Throughput

Modern RDMA NICs (RNICs/HCAs) support extreme network bandwidths like 100GbE, 200GbE, or 400GbE to feed GPUs without latency degradation. <br> 현대의 RDMA 네트워크 카드(RNIC, Infiniband HCA)는 100G, 200G, 400G 및 그 이상의 초고속 네트워킹 환경을 지연 시간의 증가 없이 온전히 소화해 낼 수 있습니다.

---

# Common Interview Follow-up

### Q1

Why is RDMA faster than TCP? <br> RDMA가 TCP보다 비약적으로 속도가 빠른 근본적 원인은 무엇입니까?

Expected Answer
RDMA achieves its speed because it offloads the network protocol stack (congestion control, packet ordering) to the NIC hardware, and implements kernel bypass and zero-copy data paths. This eliminates the CPU context switches and memory copy overhead that limit TCP throughput. <br> RDMA는 네트워크 전송 프로토콜(혼잡 제어, 패킷 순서 보장 등) 연산을 NIC 하드웨어가 직접 처리(Offloading)하고, 커널 우회와 제로 카피 데이터 전송 경로를 구축하여 TCP 성능 저하의 주범인 운영체제 컨텍스트 스위칭과 메모리 복사 오버헤드를 완벽히 제거하기 때문입니다.

---

### Q2

Does RDMA completely eliminate CPU usage? <br> RDMA를 사용하면 통신 과정에서 CPU 점유율이 완전히 0%가 되는 건가요?

Expected Answer
No, but it reduces it significantly. The CPU is still responsible for setup tasks like allocating protection domains, registering memory regions (MR), and managing queue pairs (QP). However, during actual data transmission, the RNIC handles packet formatting and DMA transfers without CPU intervention, reducing CPU usage during heavy I/O to near-zero. <br> 완전히 없어지지는 않지만 거의 사용하지 않습니다. 통신 세션을 초기화하는 과정인 보호 도메인(PD) 생성, 메모리 영역(MR) 등록, 큐 페어(QP) 셋업 작업 등에는 여전히 CPU가 관여합니다. 하지만 일단 세션이 수립된 뒤 실제 대용량 데이터를 주고받는 데이터 패스(Data Path) 전송 단계에서는 CPU가 완전히 배제되므로 극히 낮은 CPU 소모율만 보입니다.

---

### Q3

What workloads benefit most from RDMA? <br> 어떤 종류의 워크로드가 RDMA의 도입 효과를 가장 크게 누릴 수 있습니까?

Expected Answer
Distributed AI training (like PyTorch FSDP/DeepSpeed), high-performance computing (HPC) simulations, distributed storage networks (like NVMe-oF or VAST Storage), and ultra-low latency databases benefit most due to their demand for massive, low-overhead inter-node data exchange. <br> PyTorch FSDP나 DeepSpeed를 활용한 거대 언어 모델 분산 AI 학습, HPC 슈퍼컴퓨팅 시뮬레이션, NVMe-oF나 VAST Storage 같은 분산 플래시 스토리지 네트워크, 그리고 대규모 인메모리 데이터베이스와 같이 노드 간 고속 대량 데이터 동기화가 필요한 분산 인프라에서 가장 큰 효과를 발휘합니다.

---

### Q4

Can RDMA run on Ethernet? <br> RDMA는 반드시 인피니밴드(InfiniBand) 전용 망에서만 동작하나요? 일반 이더넷에서도 작동합니까?

Expected Answer
Yes. While RDMA originally ran on InfiniBand, it can now run on standard Ethernet networks using RoCE (RDMA over Converged Ethernet) or iWARP. RoCEv2 is widely adopted in modern AI data centers, wrapping RDMA packets inside standard UDP/IP headers to route them over Ethernet. <br> 네, 일반 이더넷에서도 동작합니다. 초기에는 인피니밴드 전용망이 필요했으나, 현재는 RoCE(RDMA over Converged Ethernet) 또는 iWARP 기술을 통해 표준 이더넷 스위치 망 위에서도 실행됩니다. 특히 현대 AI 데이터센터에서는 RDMA 패킷을 표준 UDP/IP 헤더로 캡슐화하여 L3 라우팅을 지원하는 RoCEv2 방식을 대다수 채택하고 있습니다.

---

### Q5

Can applications use RDMA automatically? <br> 기존의 일반 소켓 기반 어플리케이션들이 자동으로 RDMA 네트워크 가속 혜택을 받을 수 있나요?

Expected Answer
No. Traditional applications built on BSD Sockets (using read/write/send/recv syscalls) must be refactored to use RDMA APIs (such as ibverbs or UCX) or run on top of intermediate middleware like MPI, NCCL, or storage drivers that are natively designed to leverage RDMA registered memory regions. <br> 아니요, 불가능합니다. 표준 BSD 소켓(read/write/recv 등)으로 작성된 기존 코드는 자동으로 RDMA를 활용할 수 없으며, RDMA Native API(ibverbs, UCX 등)를 직접 사용하도록 소스코드를 재설계해야 합니다. 혹은 RDMA를 내장 지원하는 NCCL(NVIDIA Collective Communications Library), MPI, 또는 분산 스토리지 드라이버 레이어를 중간 미들웨어로 결합하여 사용해야 합니다.

---

# Real Production Example

Environment: <br> 운영 환경:
A GPU cluster with 64x H100 nodes connected to a VAST storage system for high-throughput AI training. <br> 고대역폭 분산 AI 학습을 위해 VAST 스토리지와 연결된 64대의 NVIDIA H100 GPU 서버 클러스터 환경입니다.

Observed: <br> 이상 증상:
Write throughput during checkpoint saving dropped from a baseline of 40 GB/s to only 1.2 GB/s, while server CPU usage spiked significantly on all nodes. <br> 모델 가중치를 저장하는 체크포인트 시점에 초당 40GB를 상회하던 쓰기 성능이 갑자기 1.2GB/s로 곤두박질쳤고, 동시에 모든 학습 서버 노드의 CPU 점유율이 80% 이상으로 요동쳤습니다.

Investigation: <br> 트러블슈팅 및 조사:
- Verified VAST Storage metrics, confirming disks and controller CPUs were idle. <br> - VAST 스토리지 장비 자체의 디스크 및 컨트롤러 CPU 리소스를 점검하니 병목 없이 매우 한산한 상태였습니다.
- Checked network interfaces on GPU nodes and found high TCP packet transmission rates, but zero RDMA active links. <br> - GPU 서버 랜카드 상태를 모니터링한 결과, RDMA 전송 카운터는 멈춰 있는 반면 표준 TCP 패킷 전송이 몰아치고 있었습니다.
- Inspected logs, discovering that a switch configuration change had disabled PFC (Priority Flow Control), failing the RoCE lossless path check, which forced NCCL and storage drivers to fallback to standard TCP sockets. <br> - 로그 분석을 통해 인프라 작업 도중 스위치 설정 커밋 오류로 PFC(우선순위 흐름 제어)가 비활성화되었고, 무손실 검사(Lossless check) 실패로 스토리지 연동 드라이버가 일반 TCP 소켓 통신 모드로 강제 폴백(Fallback)되었음을 밝혀냈습니다.

Result: <br> 최종 해결 조치:
Re-enabled PFC and ECN on the leaf-spine switches and restarted the storage agents on GPU nodes. The RoCE lossless link was restored, checkpoint writing speed recovered to 42 GB/s, and CPU usage returned to under 3%. <br> 스위치의 PFC 및 ECN 무손실 정책 설정을 다시 업링크하고 GPU 노드의 스토리지 에이전트를 재부팅했습니다. RoCE 링크가 무손실(Lossless) 모드로 즉시 재연결되면서, 체크포인트 쓰기 속도는 42GB/s 수준으로 복구되었고 CPU 점유율은 다시 3% 미만으로 급격히 낮아졌습니다.

---

# ByteDance Follow-up Possibility

Very High <br> 바이트댄스 면접 꼬리 질문 출제 확률 100%

Typical Flow: <br> 예상 심화 질문 흐름:
TCP vs RDMA architecture differences <br> TCP와 RDMA 아키텍처 및 메모리 접근 차이
↓
Memory Registration (MR) pinning overhead <br> RDMA 동작 전 메모리 등록(MR) 및 가상 메모리 물리 고정(Pinning)에 따른 커널 오버헤드와 페이지 락(Page Lock) 한계
↓
RoCEv2 UDP encapsulation and routing <br> RoCEv2 프로토콜의 L3 UDP 패킷 캡슐화 및 네트워크 스위치 라우팅 원리
↓
NCCL (NVIDIA Collective Communications Library) transport selection <br> NCCL 라이브러리가 노드 내 NVLink 통신과 노드 간 RoCE/Infiniband RDMA 통신 경로를 자동으로 선택하고 토폴로지를 스케줄링하는 과정
↓
GPUDirect RDMA (GDR) mechanisms <br> CPU 호스트 메모리를 거치지 않고 PCIe 버스를 통해 GPU VRAM 간 데이터를 다이렉트로 복사하는 GPUDirect RDMA(GDR) 작동 구조

---

# Personal Notes

Strong Interview Message: <br> 면접에서 어필할 강력한 핵심 메시지:
"RDMA is not just a faster network protocol. It fundamentally changes how distributed systems exchange data by minimizing CPU and kernel involvement, turning network I/O into direct memory reads/writes." <br> "RDMA는 단순히 빠른 네트워크 프로토콜이 아닙니다. 그것은 네트워크 I/O를 메모리 직접 읽기/쓰기 작업으로 변환하여 운영체제 커널과 CPU 간섭을 배제함으로써, 분산 컴퓨팅의 성능 패러다임을 바꾼 고성능 인프라의 핵심 축입니다."

---

# Strong Interview Quote

"TCP moves data through the operating system. RDMA moves data directly between memories." <br> "TCP는 운영체제 스택을 거쳐 데이터를 한 단계씩 이송하지만, RDMA는 장치 레이어에서 메모리와 메모리 간 데이터를 직접 밀어 넣습니다."

This is concise and memorable. <br> 이 답변은 복잡한 하드웨어 동작 원리를 매우 짧고 깊이 있게 대조하여, 면접관에게 클라우드 네트워크에 대한 명확한 개념을 즉시 부각시킵니다.

---

# Related Topics

- [network-q05-packet-loss.md](file:///Users/yg/workspace/tictok/docs/networking/network-q05-packet-loss.md)
- [gpu-q02-roce.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q02-roce.md)
- [gpu-q03-vast-storage.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q03-vast-storage.md)
- [gpu-q04-gpu-training-network.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q04-gpu-training-network.md)

---

## Status

Studying
