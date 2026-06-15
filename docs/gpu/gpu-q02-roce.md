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

RoCE = RDMA over Converged Ethernet <br> RoCE = 대용량 초저지연 전송망 기술 (RDMA over Converged Ethernet)

Benefits <br> 주요 이점:
- Low Latency <br> - 극도의 초저지연 (Microsecond 미만)
- High Throughput <br> - 높은 처리량 (라인 스피드 대역폭 활용)
- CPU Offload <br> - CPU 부하 제거 (NIC 하드웨어 오프로딩)

Requirements <br> 요구사항:
- Proper NIC Support <br> - RDMA를 지원하는 네트워크 카드 (RNIC/HCA)
- RDMA Drivers <br> - 호스트 내 RDMA 드라이버 (OFED 등)
- Lossless Ethernet <br> - 패킷 드롭이 없는 무손실 이더넷 환경

Common Failure <br> 흔한 장애 시나리오:
RDMA fails <br> RDMA 링크 연결 실패 또는 협상 실패
↓
Traffic falls back to TCP <br> 일반 TCP 커널 소켓 통신으로 강제 폴백 (Fallback)
↓
Performance drops <br> 네트워크 전송 응답 성능의 급격한 저하 (체크포인트 및 분산 연산 병목)

---

# Interview Question

What is RoCE? <br> RoCE(RDMA over Converged Ethernet)는 무엇입니까?

How is it different from traditional TCP networking? <br> 기존의 전통적인 TCP 네트워킹 방식과는 어떤 기술적 차이가 있나요?

Why is it important in AI infrastructure? <br> 현대의 분산 AI 인프라 아키텍처 환경에서 RoCE가 왜 그토록 중요하게 취급됩니까?

---

# Interviewer's Intent

The interviewer wants to evaluate: <br> 면접관은 다음 역량을 평가하고자 합니다:

- Modern AI infrastructure knowledge: Understanding transport layer offloading and hardware-level transfer mechanisms. <br> - 현대적 AI 인프라 지식: 전송 계층 오프로딩 및 하드웨어 수준의 데이터 전송 메커니즘 이해도.
- RDMA understanding: Deep familiarity with how RoCE encapsulates RDMA packets over Ethernet. <br> - RDMA 원리 이해: RoCE가 이더넷 상에서 RDMA 패킷을 어떻게 캡슐화하고 이동시키는지에 대한 지식 수준.
- GPU cluster networking: Knowledge of scale-out architectures, lossy vs. lossless networks. <br> - GPU 클러스터 네트워크 디자인: 손실 및 무손실 환경 구성 요소 및 스케일아웃 네트워킹 구조의 이해.
- Data center architecture experience: Real production configuration details of PFC, ECN, and lossless ethernet parameters. <br> - 데이터센터 운영 실무 역량: PFC 및 ECN 튜닝, 무손실 이더넷(Lossless Ethernet) 파라미터 적용 등 실무 경험 유무 확인.

---

# Recommended Answer (English)

RoCE stands for RDMA over Converged Ethernet. <br> RoCE는 RDMA over Converged Ethernet의 약자입니다.

It allows RDMA communication to operate on Ethernet networks rather than requiring a dedicated InfiniBand fabric. <br> 이는 전용 인피니밴드(InfiniBand) 인프라를 구축하지 않고도 일반 이더넷 네트워크 위에서 고성능 RDMA 통신을 가능하게 해주는 기술입니다.

The primary benefit is that organizations can achieve many of the advantages of RDMA, including low latency, low CPU utilization, and high throughput, while leveraging existing Ethernet infrastructure. <br> 핵심 이점은 기업이 이미 구축된 기존의 이더넷 인프라 장비를 최대한 활용하면서도, 초저지연, CPU 오버헤드 제거, 초고대역폭 등 RDMA가 제공하는 고성능 데이터 전송 혜택을 온전히 누릴 수 있다는 점입니다.

RoCE is widely used in modern AI training clusters and high-performance storage environments because it enables extremely efficient data movement between servers. <br> 서버 간 극도로 효율적인 데이터 이동을 제어해야 하므로, RoCE는 현대의 대규모 AI 학습 클러스터 및 고성능 분산 올플래시 스토리지 네트워크 설계에서 광범위하게 채택되고 있습니다.

However, RoCE requires proper network configuration and RDMA-capable hardware. <br> 단, RoCE가 원활하게 작동하려면 하드웨어 단에서의 RDMA 카드 지원뿐만 아니라 무손실 네트워크 스위치 정책 설정이 엄격히 정렬되어야 합니다.

If RoCE is not functioning correctly, traffic may fall back to traditional TCP communication, resulting in significantly lower performance. <br> 만약 스위치나 드라이버 문제로 RoCE가 정상 동작하지 않으면 전송 트래픽이 일반 TCP 통신으로 강제 전환(Fallback)되어, 연산 클러스터 전반의 지연 시간이 증가하고 성능이 급격히 악화됩니다.

---

# Korean Summary

RoCE는 Ethernet 환경에서 RDMA를 사용할 수 있게 해주는 기술입니다. <br> 전용 인피니밴드 하드웨어를 구매하지 않고도, 범용 이더넷 네트워크 인프라 위에서 직접 메모리 전송(RDMA)을 수행합니다.

- 기존 TCP 방식: 데이터가 커널 네트워킹 스택을 거치며 CPU 자원을 많이 소모하고 마이크로초 단위의 지연(RTT)이 발생합니다.
- RoCE 방식: 이더넷 위에서 커널을 우회(Kernel Bypass)하고 직접 원격지 메모리 주소를 읽고 씀으로써, CPU 점유율을 0%에 가깝게 유지하며 1마이크로초 미만의 극초저지연 통신을 실현합니다.
- AI 클러스터에서의 중요성: 수만 개의 GPU가 서로 동기화(AllReduce)하고 스토리지로부터 대용량 체크포인트 및 데이터셋을 로드하는 과정에서 통신 병목을 없애 학습 가동률을 극대화합니다.

---

# Architecture Comparison

## Traditional TCP
```text
Application (User space)
   │ (System Call)
   ▼
Kernel Space Socket Buffers
   │ (TCP/IP Stack Processing + Checksums)
   ▼
NIC Driver (OS controlled)
   │ (DMA Copy)
   ▼
NIC Buffer
   │
   ▼  [Packet Transit - Milliseconds/Microseconds RTT]
   │
NIC Buffer (Receiver)
   │ (DMA Copy)
   ▼
Kernel Space Socket Buffers
   │ (TCP/IP Reassembly + Interrupted CPU)
   ▼
Application (User space)
```

---

## RoCE
```text
Application (User space)
   │
   ▼  [Kernel Bypass & CPU Bypass - RNIC reads memory directly]
RDMA NIC (RNIC)
   │
   ▼  [High Speed Lossless Ethernet - sub-1us Latency]
Ethernet Switch Fabric
   │
   ▼  [RNIC writes directly to remote memory]
RDMA NIC (RNIC)
   │
   ▼
Remote Memory (User space)
```

---

# Why AI Clusters Use RoCE

Distributed AI Training (PyTorch FSDP / DeepSpeed / Megatron-LM) <br> 대규모 분산 AI 모델 학습
↓
Massive Parameter & Gradient Exchange (AllReduce / AlltoAll communication phases) <br> 기가바이트 단위의 매개변수 및 그레이디언트 집단 동기화 통신
↓
Frequent Training Blockers (GPU compute halts waiting for network transit) <br> GPU 연산 중 네트워크 지연으로 인한 빈번한 병목 정지 현상 발생
↓
RoCE Minimizes Latency & CPU Overhead (Bypasses OS kernel, keeping GPUs saturated at 95%+) <br> RoCE로 커널 통신 스택 우회 및 초저지연 중계 (GPU 가동률 극대화)
↓
Higher Training Efficiency & Faster Convergence <br> AI 모델 수렴 속도 및 하드웨어 가용성 대폭 개선

---

# Important Concepts

## RDMA
Direct Memory Access between servers, bypassing CPU and OS kernel. <br> 서버 간에 CPU나 운영체제 커널의 개입 없이 네트워크 카드가 메모리 버퍼 영역에 직접 데이터를 쓰고 읽는 전송 기술입니다.

---

## RoCE
RDMA implemented over standard Ethernet networks, utilizing RoCEv1 (L2 ethernet based) or RoCEv2 (L3 UDP/IP routed). <br> 일반 이더넷 네트워크 환경에서 작동하도록 표준화된 RDMA 프로토콜입니다. L2 레벨에서 동작하는 RoCEv1과 L3 UDP/IP 헤더로 캡슐화되어 라우팅이 가능한 RoCEv2가 널리 쓰입니다.

---

## InfiniBand
Dedicated high-performance networking technology traditionally dominant in supercomputing and high-performance computing (HPC) environments. <br> 슈퍼컴퓨터 및 고성능 컴퓨팅(HPC) 환경에서 주로 독점해 온 전용 고성능 패브릭 연결망 기술입니다.

---

## Lossless Ethernet
RoCE performs best when packet loss is minimized, which requires configuring flow control protocols. <br> RoCE는 패킷 손실이 생기면 성능 저하가 극심하므로 패킷 유실을 원천 차단하는 무손실 이더넷 네트워크 가이드라인이 필요합니다.

Technologies often used <br> 주요 적용 기술:
- PFC (Priority Flow Control) <br> - 우선순위 흐름 제어: 트래픽 클래스별로 일시 정지(PAUSE) 프레임을 송출해 버퍼 오버플로우를 예방합니다.
- ECN (Explicit Congestion Notification) <br> - 명시적 혼잡 통보: 혼잡 발생 시 스위치 단에서 IP 헤더에 마킹하여 송신 호스트가 스스로 전송률을 감속하게 유도합니다.
- DCB (Data Center Bridging) <br> - 데이터센터 브릿징: 무손실 처리를 보장하기 위한 이더넷 확장 표준 규격 패키지입니다.

---

# RoCE vs InfiniBand

## RoCE
Advantages <br> 주요 장점:
- Uses Ethernet <br> - 기존 표준 범용 이더넷 장비 활용 가능
- Easier integration <br> - 기존 사내 데이터센터 인프라 인력에 익숙하고 통합 관리가 비교적 용이
- Lower deployment cost <br> - 인피니밴드 전용 스위치/케이블 대비 도입비용 절감 효과

---

## InfiniBand
Advantages <br> 주요 장점:
- Mature HPC ecosystem <br> - 아주 오래 검증된 초고성능 컴퓨팅(HPC) 에코시스템 구성
- Extremely low latency <br> - 물리적 레이어 수준에서 가장 짧고 안정적인 극초저지연 레이턴시 제공
- Highly optimized for large clusters <br> - 수만 대 규모의 대형 GPU 연산 노드 확장성에 매우 강인하고 에러 복구가 신속함

---

# Common Interview Follow-up

### Q1
Can RoCE operate on a standard Ethernet network? <br> RoCE는 아무런 추가 설정이 없는 일반 표준 이더넷 네트워크에서도 곧바로 정상 작동하나요?

Expected Answer
No. While it uses Ethernet cables, it requires specific switches configured with PFC (Priority Flow Control) and ECN, plus servers equipped with RoCE-enabled network cards (RNICs) and matching RDMA software drivers. <br> 아닙니다. 이더넷 전선을 사용하긴 하지만, 네트워크 스위치 장비에서 반드시 PFC 및 ECN 무손실(Lossless) 정책이 구성되어 있어야 하며, 서버에는 RoCE를 지원하는 특화된 NIC(RNIC) 카드와 전용 소프트웨어 드라이버가 로드되어야 합니다.

---

### Q2
What happens if RoCE fails? <br> 분산 연산 중 RoCE 연동에 에러가 발생하거나 통신이 끊어지면 어떻게 되나요?

Expected Answer
Applications (like NCCL or storage mount drivers) will fallback to standard TCP sockets over the normal network stack. This prevents application crashes but causes a massive drop in throughput and a huge surge in host CPU utilization. <br> NCCL 라이브러리나 분산 스토리지 연동 엔진이 자동으로 표준 TCP/IP 소켓 모드로 강제 폴백(Fallback)합니다. 시스템이 뻗지는 않으나, 네트워크 처리량이 폭락하고 통신 도중 CPU가 스택 파싱을 하느라 사용률이 80% 이상 급격히 요동치게 됩니다.

---

### Q3
Why is packet loss problematic for RoCE? <br> RoCE 환경에서 패킷 드롭(Packet Loss)이 단 1%라도 발생하는 것이 왜 그렇게 치명적입니까?

Expected Answer
RoCEv2 encapsulates RDMA packets in UDP/IP. Since UDP does not have built-in retransmission, packet loss forces the RDMA transport layer on the NIC to request heavy hardware-level Go-Back-N retransmissions, which severely halts data transfer pipelines and causes throughput to drop to near zero. <br> RoCEv2는 RDMA 패킷을 UDP로 캡슐화해 보냅니다. UDP에는 자체 재전송 메커니즘이 없기 때문에 패킷이 단 하나라도 손실되면, NIC 하드웨어 계층에서 무거운 Go-Back-N 방식의 재요청을 하게 되어 전체 대용량 전송 파이프라인이 정지하며 전송률이 순식간에 제로 수준으로 급하강합니다.

---

### Q4
What is PFC? <br> PFC (Priority Flow Control)란 무엇이며 어떤 기법으로 오작동을 방어하나요?

Expected Answer
Priority Flow Control is a link-level flow control standard. Unlike traditional Ethernet flow control which halts all traffic on the port, PFC can target specific high-priority traffic classes (like RoCE) and send PAUSE frames back to the sender, ensuring other normal traffic flows uninterrupted. <br> 링크 계층 흐름 제어의 일종으로, 포트 전체의 데이터 전송을 멈추는 일반 이더넷 흐름 제어와 달리 특정 트래픽 클래스(RoCE 전용 채널 등)에만 족집게처럼 정지(PAUSE) 프레임을 인가하여, 무손실 전송을 달성하는 동시에 다른 일반 웹 트래픽 전송에는 영향을 주지 않도록 통제하는 핵심 규격입니다.

---

### Q5
What is the difference between RoCE and InfiniBand? <br> RoCE와 InfiniBand의 본질적인 기술 차이점은 무엇인가요?

Expected Answer
RoCE layer runs over standard Ethernet IP/UDP network layers, meaning it must deal with routing, collision domain, and switch buffer tuning. InfiniBand is a separate dedicated L1-L4 protocol and cabling architecture designed from scratch to be natively lossless, cut-through, and centrally managed by a Subnet Manager. <br> RoCE는 일반 이더넷 IP/UDP 패키지 규격 위에 RDMA를 얹은 구조라 이더넷 버퍼 및 라우팅 환경 조율이 필요합니다. 반면 인피니밴드는 물리 레이어부터 무손실 및 컷스루(Cut-through) 전송을 전제로 고안된 전용 장비이며, 서브넷 매니저라는 중앙 제어기가 라우팅과 하드웨어 토폴로지를 완전히 자동 정렬해 줍니다.

---

# Real Production Example

Environment <br> 운영 환경:
A GPU cluster with 64x H100 nodes connected to a VAST storage system for high-throughput AI training. <br> 초고대역 분산 AI 학습을 위해 VAST 스토리지와 연결된 64대의 NVIDIA H100 GPU 서버 클러스터 환경입니다.

Expected <br> 기대 성능:
Line-rate RDMA throughput (e.g. 40 GB/s) for checkpoints with near-zero CPU overhead. <br> 체크포인트 저장 시 CPU 간섭 없이 40 GB/s 이상의 고속 RDMA 선로 속도(Line-rate) 유지를 기대했습니다.

Observed <br> 실제 이상 증상:
Performance drops to 1.2 GB/s, and host CPU usage spikes significantly on all nodes during checkpoint saving. <br> 백엔드 쓰기 성능이 갑자기 1.2 GB/s 수준으로 곤두박질쳤고, 체크포인트 저장 과정에서 모든 서버 노드의 CPU 점유율이 80% 이상으로 요동쳤습니다.

Investigation <br> 트러블슈팅 및 조사:
Verified VAST storage and confirmed controllers were idle. Checking network interface statistics on the GPU nodes showed that RoCE active links were zero, while standard TCP packet counts were rising. Logs confirmed that PFC was disabled on a spine switch due to a configuration rollback, failing the RoCE lossless connection checks. <br> VAST 스토리지 컨트롤러 부하를 확인했으나 디바이스는 한산했습니다. GPU 서버 랜카드의 상태 카운터를 조회해 보니 액티브 RoCE 세션 수가 0이었고, 대신 표준 TCP 패킷 카운트만 수직 상승 중이었습니다. 스위치 로그 분석 결과, 설정 롤백 실수로 스파인 스위치 하나에서 PFC 정책이 해제되어 lossless 요건이 충족되지 않아 NCCL과 스토리지 드라이버가 TCP 소켓 모드로 자동 전환되었음이 확인되었습니다.

Result <br> 최종 해결 조치:
Re-enabled PFC and ECN on the spine switches and restarted the storage agents on GPU nodes. The RoCE lossless link was restored, checkpoint writing speed recovered to 42 GB/s, and CPU usage returned to under 3%. <br> 스파인 스위치의 PFC 및 ECN 무손실 정책 설정을 다시 활성화하고 서버의 에이전트들을 순차 재부팅했습니다. RoCE 링크가 무손실(Lossless) 모드로 정상 수립되면서 체크포인트 쓰기 속도는 42 GB/s 수준으로 정상 회복되었고, CPU 점유율 또한 3% 미만으로 복구되었습니다.

---

# ByteDance Follow-up Possibility

Very High <br> 바이트댄스 면접 꼬리 질문 출제 확률 100%

Typical Flow <br> 예상 심화 질문 흐름:
RoCEv2 L3 routing & UDP encapsulation headers <br> RoCEv2 프로토콜의 L3 UDP 패킷 캡슐화 및 네트워크 스위치 라우팅 원리
↓
PFC (Priority Flow Control) deadlock prevention <br> PFC 도입 시 패킷 순환 정체로 인한 스위치 Deadlock(데드락) 방지 및 버퍼 격리 기법
↓
RoCEv2 Congestion Control algorithms (DCQCN vs. TIMELY) <br> RoCEv2 혼잡 제어를 위한 하드웨어 수준의 알림 알고리즘(DCQCN, TIMELY 등) 비교 분석
↓
NCCL (NVIDIA Collective Communications Library) transport selection <br> NCCL이 노드 간 최적의 통신을 위해 RoCE 드라이버 채널과 토폴로지를 자동으로 선택하고 스케줄링하는 원리
↓
GPUDirect RDMA (GDR) setup <br> 호스트 CPU를 개입시키지 않고 GPU VRAM 주소 간 데이터를 PCIe 버스를 통해 직접 RoCE로 밀어 넣는 GPUDirect RDMA(GDR) 작동 원리

---

# Personal Notes

Strong Interview Message <br> 면접에서 어필할 강력한 핵심 메시지:
"Enabling RoCE is not enough. You must verify that traffic is actually using the RDMA path." <br> "스위치와 서버에 RoCE 설정을 적용하는 것만으로는 부족합니다. 실제 대용량 파일 복사 및 학습 훈련 시점에 패킷이 일반 TCP 레이어를 우회하고 실제 RDMA 데이터 패스(Data Path)로 이송 중인지를 통계 카운터로 명확히 검증하는 습관이 중요합니다."

---

Strong Interview Quote <br> 면접관에게 전할 강렬한 한마디:
"One of the most common mistakes is assuming RDMA is working simply because it has been configured." <br> "인프라 운영 경험이 부족할 때 저지르기 가장 쉬운 실수는, 단지 설정 파일에 RoCE 옵션을 켰다는 사실만 믿고 실제로 RDMA 전송이 작동하고 있다고 믿어버리는 것입니다."

---

# Related Topics

- [gpu-q01-rdma-vs-tcp.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q01-rdma-vs-tcp.md)
- [gpu-q03-vast-storage.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q03-vast-storage.md)
- [gpu-q04-gpu-training-network.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q04-gpu-training-network.md)
- [network-q05-packet-loss.md](file:///Users/yg/workspace/tictok/docs/networking/network-q05-packet-loss.md)

---

## Status

Studying
