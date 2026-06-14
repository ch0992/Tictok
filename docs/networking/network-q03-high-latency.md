# Metadata

Category: Networking
Subcategory: Network Troubleshooting
Difficulty: Medium-Hard
Importance: ★★★★★
Frequency: ★★★★★
Related Topics:
- TCP
- DNS
- Packet Loss
- RDMA
- RoCE
- Storage Performance
- Load Balancer
Interview Rounds:
- Technical Screen
- Hiring Manager
- Onsite
Tags:
networking, latency, troubleshooting, sre, performance

---

# network-q03-high-latency.md

# Networking Interview Question 03

## Users Report High Latency

### Difficulty

Medium-Hard

### Importance

★★★★★

### Frequency

★★★★★

---

# Quick Recall

Latency is a symptom. <br> 지연 시간(Latency)은 최종 증상일 뿐입니다.

First identify: <br> 가장 먼저 다음 영역 중 어디서 병목이 발생하는지 식별하십시오:

1. Network? <br> 1. 네트워크 구간 지연?
2. Application? <br> 2. 애플리케이션 연산 지연?
3. Storage? <br> 3. 스토리지 파일 I/O 지연?
4. Database? <br> 4. 데이터베이스 쿼리/락 지연?

Measure before making assumptions. <br> 추측하기 전에 반드시 객관적인 메트릭을 측정해야 합니다.

---

# Interview Question

Users report that application response times have significantly increased. <br> 사용자들이 애플리케이션의 응답 속도가 현저히 느려졌다고 리포트합니다.

How would you investigate and troubleshoot the issue? <br> 이 문제를 어떻게 조사하고 해결하시겠습니까?

---

# Interviewer's Intent

The interviewer wants to evaluate: <br> 면접관은 다음 사항들을 평가하고자 합니다:

- Troubleshooting methodology <br> - 체계적인 장애 분석 방법론
- Layered thinking <br> - 계층 구조 기반의 논리적 사고 방식
- Networking fundamentals <br> - 네트워크 기본 지식
- RCA approach <br> - 근본 원인 분석(RCA)으로 다가가는 방식
- Real production experience <br> - 실제 프로덕션 환경의 트러블슈팅 경험

The interviewer does not expect you to immediately identify the root cause. <br> 면접관은 당신이 질문을 받자마자 즉시 정답을 맞추는 것을 기대하지 않습니다.

The interviewer wants to see how you narrow down the problem space. <br> 면접관이 확인하고 싶은 것은 복잡한 문제 범위를 좁혀나가는 논리적 탐색 과정입니다.

---

# Recommended Answer (English)

When users report high latency, I first try to determine where the latency is being introduced. <br> 사용자가 고지연 문제를 보고하면, 저는 먼저 어느 구간에서 지연 시간이 도입되고 있는지 식별하려고 합니다.

I avoid assuming that the network is the problem because latency can originate from many layers including the application, database, storage, or infrastructure. <br> 네트워크 문제일 것이라고 단정 짓는 것을 지양합니다. 지연은 애플리케이션, 데이터베이스, 스토리지, 인프라 등 매우 다양한 레이어에서 시작될 수 있기 때문입니다.

My first step is to collect metrics and establish a baseline. <br> 제가 취할 첫 번째 단계는 관련 성능 메트릭을 수집하고 정상 기준점(Baseline)을 확인하는 것입니다.

I would examine: <br> 저는 다음 메트릭들을 집중 검토합니다:

- Application response times <br> - 애플리케이션 트랜잭션별 응답 속도
- Network latency and path delay <br> - 네트워크 구간 지연 및 경로 핑 지연
- Packet loss rate <br> - 패킷 유실률(Packet Loss)
- CPU utilization <br> - 서버 CPU 사용량
- Memory usage and swapping <br> - 메모리 사용량 및 스와핑 여부
- Storage read/write latency <br> - 스토리지 읽기/쓰기 대기 시간

I would then determine whether the issue is isolated to a specific service, region, or user group. <br> 이후 이 장애 현상이 특정 서비스, 특정 리전, 혹은 특정 사용자 그룹에만 국한된 고립된 에러인지 판별합니다.

From there, I would progressively narrow the investigation by analyzing network paths, storage performance, application logs, and recent changes. <br> 여기서부터 네트워크 경로 분석, 스토리지 성능 검토, 애플리케이션 에러 로그 파싱 및 최근 배포/변경 이력을 바탕으로 조사 범위를 점진적으로 좁혀나갑니다.

My goal is to identify the bottleneck rather than immediately guessing the root cause. <br> 저의 핵심 목표는 근본 원인을 성급하게 추측하는 대신, 실제 병목이 걸리는 병목 구간(Bottleneck)을 정밀 격리하는 것입니다.

---

# Korean Summary

사용자가 느리다고 하면 바로 네트워크 문제라고 가정하지 않는다.

Latency는 결과이지 원인이 아니다.

먼저 어느 계층에서 지연이 발생하는지 확인한다.

확인 항목:
- Application (API 응답 지연 등)
- Network (라우터 혼잡, 패킷 드롭 등)
- Database (슬로우 쿼리, 테이블 락 등)
- Storage (NFS 마운트 병목, 디스크 I/O 대기 등)
- Infrastructure (CPU saturation, 가용 메모리 고갈 등)

이후 메트릭을 수집하여 병목 구간을 찾는다. 중요한 것은 원인을 즉흥적으로 추측하는 것이 아니라 논리적 필터링으로 병목 지점을 좁혀나가는 것이다.

---

# Investigation Flow

User Reports Latency <br> 사용자 지연 리포트 접수
↓
Application Metrics <br> APM 대시보드 검토 (API 지연 시간 필터링)
↓
Network Metrics <br> 네트워크 홉별 지연 및 유실 검사 (ping, traceroute)
↓
Storage Metrics <br> 스토리지 디바이스 I/O 대기 분석 (iostat)
↓
Infrastructure Metrics <br> 시스템 가용 자원 고갈 검사 (top, free)
↓
Recent Changes <br> 최근 작업 및 인프라 변경점 체크 (Git, CD 배포 로그)
↓
Identify Bottleneck <br> 병목 구간 격리 완료
↓
Root Cause Analysis <br> RCA 보고서 작성 및 조치 실행

---

# Common Sources of Latency

## Application Layer

- Slow API implementation: Bad algorithms <br> - 느린 API 로직: 알고리즘 복잡도 이슈
- Inefficient queries: Lack of indexes <br> - 인덱스 누락으로 인한 장시간의 풀 스캔 발생
- Thread contention: Deadlocks or starvation <br> - 스레드 경합: 임계 영역 락 획득 실패로 인한 대기 누적

---

## Database Layer

- Slow queries: Heavy join operations <br> - 비효율적인 조인 및 복잡한 서브쿼리 연산
- Lock contention: Multiple writes on same table <br> - 트랜잭션 락 경합: 동일 레코드/테이블에 동시 다발적 쓰기 유입
- Connection pool exhaustion: Wait on free connection <br> - 커넥션 풀 고갈: 가용 DB 커넥션이 부족하여 대기 타임아웃 발생

---

## Storage Layer

- High disk latency: Wait time on read/write queue <br> - 디스크 자체 지연 시간 증가: 디바이스 쓰기/읽기 대기열 병목
- NFS bottlenecks: Network file system mounts lag <br> - NFS 병목: 네트워크 디렉토리 마운트 공유단의 지연 전이
- Storage congestion: IOPS limit reached <br> - 스토리지 포화: 디스크 최대 허용 IOPS(초당 입출력 횟수) 도달

---

## Network Layer

- Packet loss: Drops at switch ports <br> - 패킷 유실: 네트워크 스위치 포트 수준에서의 드롭 발생
- Network Congestion: Saturated link bandwidth <br> - 네트워크 혼잡: 업링크 대역폭 포화로 인한 대기열 정체
- Retransmissions: Retransmit delays in TCP <br> - 재전송 지연: 유실된 세그먼트를 복구하기 위한 TCP 타임아웃 발생

---

## Infrastructure Layer

- CPU saturation: High load average <br> - CPU 포화: 가용 연산 자원 고갈로 인한 스케줄링 대기
- Memory pressure: High swap activity <br> - 메모리 압박: 물리 메모리 부족으로 디스크 스왑(si, so) 폭증
- Resource contention: Multi-tenant VM noisy neighbors <br> - 가상화 노이즈: 공유 물리 서버 내 타 가상 머신의 리소스 과점유

---

# Key Commands

## Network Latency
```bash
ping 142.250.196.142
```
Purpose: Basic network reachability and latency measurement. <br> 목적: 대상 IP와의 기초적인 왕복 시간(RTT) 및 도달 여부를 테스트합니다.

---

## Network Path
```bash
traceroute google.com
```
Purpose: Identify network path delays and identify the failing hop. <br> 목적: 패킷이 경유하는 라우터 경로를 나열하고 어느 구간(Hop)에서 지연/유실이 생기는지 격리합니다.

---

## Packet Capture
```bash
tcpdump -i eth0 'tcp port 443'
```
Purpose: Capture packets to inspect retransmissions and window updates. <br> 목적: 유실 세그먼트 복구를 위한 재전송(Retransmission) 추이를 실시간으로 캡처 분석합니다.

---

## Connection Statistics
```bash
ss -s
```
Purpose: Analyze socket states and detect connection backlog bottlenecks. <br> 목적: 시스템 내부의 TCP/UDP 소켓 상태 분포 및 백로그 병목을 종합 요약합니다.

---

## Interface Statistics
```bash
sar -n DEV 1 3
```
Purpose: Monitor network interface throughput and packet counts. <br> 목적: 네트워크 인터페이스 카드의 초당 송수신 데이터 양과 패킷 처리 성능을 체크합니다.

---

# Important Concepts

## Latency <br> 지연 시간
Time required for data to travel between systems. <br> 데이터 패킷이 출발지에서 목적지까지 도달하여 응답이 오기까지 걸리는 절대 시간입니다.

---

## Throughput <br> 처리량
Amount of data transferred per unit time. High throughput does not always mean low latency. <br> 단위 시간당 전송되는 총 데이터의 양입니다. 처리량이 높다고 해서 반드시 지연 시간이 낮은 것은 아닙니다.

---

## Packet Loss <br> 패킷 유실
Lost packets increase latency due to TCP retransmission delays. <br> 라우터 혼잡이나 스위치 버퍼 오버플로우로 패킷이 사라지면, TCP는 재전송 대기 시간(RTO)을 가진 후에 전송하므로 전체 응답이 극도로 느려집니다.

---

## Retransmission <br> TCP 재전송
TCP automatically resends lost packets, causing significant increase in response times. <br> 송신자가 ACK를 받지 못해 패킷을 다시 쏘아 올리는 행위로, 사용자 브라우저에서는 "멈춤" 현상으로 나타납니다.

---

# Common Interview Follow-up

### Q1

How do you determine whether the issue is application-related or network-related? <br> 지연의 원인이 애플리케이션 로직인지 네트워크 회선 문제인지 어떻게 판단합니까?

Expected Answer
Compare application transaction latency (from logs/APM) with network round-trip time (RTT) from ping/traceroute. If ping is fast but API is slow, it is an application issue. <br> APM 메트릭상의 API 처리 지연 시간과 네트워크 RTT(왕복 속도)를 상호 비교합니다. 핑 왕복 시간은 5ms로 정상인데 API 응답만 2000ms라면 애플리케이션 병목입니다.

---

### Q2

What causes packet loss in a data center? <br> 데이터센터 인프라 환경에서 패킷 유실이 일어나는 주된 요인은 무엇인가요?

Expected Answer
Switches buffer overflow due to network congestion, hardware failures in cables/SFPs, or MTU mismatches causing packet drop. <br> 대량의 트래픽 폭주로 인한 스위치 포트의 버퍼 오버플로우, 광케이블/SFP 지빅의 물리적 결함, 혹은 MTU 크기 불일치로 인한 패킷 폐기 등이 있습니다.

---

### Q3

Why can packet loss increase latency? <br> 패킷 유실이 단순 전송 지연을 넘어 전체 레이턴시를 폭증시키는 이유는 무엇인가요?

Expected Answer
TCP must wait for the retransmission timeout (RTO) or trigger fast retransmit after receiving duplicate ACKs, pausing application data delivery to the user. <br> TCP의 신뢰성 보장 로직 작동 때문입니다. 유실된 패킷이 올바르게 전달될 때까지 통신을 중단하고 재전송 절차(RTO 대기 또는 3 Duplicate ACKs 수신)를 밟으므로 병목이 발생합니다.

---

### Q4

How would you investigate intermittent latency? <br> 가끔씩만 발생하는 간헐적 지연 현상은 어떻게 분석하나요?

Expected Answer
Correlate time-series metrics (CPU, I/O, Network packet drops) with application access logs during the latency spike. Search for cron jobs or backup tasks running concurrently. <br> 레이턴시 스파이크가 발생한 정확한 시간대의 시스템 메트릭, DB 락 이벤트, 네트워크 스위치 통계를 시간축 기준으로 정밀 대조(Correlation)합니다. 특정 주기의 백업 작업이나 배치(Cron) 구동 여부도 체크합니다.

---

### Q5

Can storage issues appear as network latency to end users? <br> 스토리지 장애가 최종 사용자에게 네트워크 지연처럼 보일 수 있나요?

Expected Answer
Yes. When application threads block waiting for slow storage I/O operations (like NFS mounts or SAN latency), the port stays open but unresponsive, simulating a network delay. <br> 그렇습니다. 애플리케이션이 스토리지(NFS 파일 서버 등)로부터 파일 읽기/쓰기를 완료하지 못해 스레드가 대기(Blocked)되면, 네트워크 응답이 일시 차단되므로 사용자는 네트워크가 느린 것으로 인식하게 됩니다.

---

# Real Production Example

GPU Training Environment: <br> 실제 AI GPU 분산 학습 환경 장애 케이스:

Observed: <br> 장애 현상:
Application throughput significantly lower than expected during model training. <br> 거대 AI 모델 학습 중 분산 그래픽 카드 간의 데이터 처리 속도(Throughput)가 비정상적으로 추락했습니다.

Investigation Flow:
Storage I/O Performance $\rightarrow$ Network Congestion Check $\rightarrow$ RDMA Verification $\rightarrow$ RoCE Configuration Debugging <br> 디스크 읽기 속도 점검 $\rightarrow$ 네트워크 대역폭 확인 $\rightarrow$ RDMA(원격 메모리 직접 참조) 헬스 검사 $\rightarrow$ RoCE(InfiniBand over Ethernet) 설정 추적 순으로 확인했습니다.

Result:
Traffic was falling back to TCP instead of using high-speed RDMA due to PFC (Priority Flow Control) configuration errors on switches. <br> 이더넷 스위치의 우선순위 흐름 제어(PFC) 구성 에러로 인해 초고속 RDMA 채널을 타지 못하고 일반 커널 TCP 소켓 통신으로 Fallback되어 속도가 급락한 것이 원인이었습니다.

After correcting the RoCE configuration and validating the lossless data path, training throughput improved significantly. <br> PFC 설정을 보정하여 이더넷 무손실(Lossless) 데이터 경로를 확보하자, 분산 학습 대역폭이 정상 속도로 전면 회복되었습니다.

---

# ByteDance Follow-up Possibility

Very High <br> 바이트댄스/틱톡 면접 출제 확률 100%

Typical Flow:
Latency investigation $\rightarrow$ Network Packet Loss diagnosis $\rightarrow$ TCP Window resizing & Retransmission $\rightarrow$ High-performance RDMA/RoCE mechanics $\rightarrow$ PFC/ECN Congestion Control in GPU Cluster. <br> 지연 시간 격리 방법론에서 시작하여 패킷 유실 해결 절차, TCP 윈도우 튜닝, 고성능 분산 학습 환경을 위한 RDMA/RoCE 통신 원리, 그리고 스위치 레벨의 PFC/ECN 혼잡 제어 설정에 이르기까지 고급 SRE 인프라 영역으로 꼬리 질문이 집중 심화됩니다.

---

# Personal Notes

Strong Interview Message:
Latency is not a root cause. Latency is evidence that something else is slow. <br> "지연 시간(Latency)은 문제의 근본 원인이 아닙니다. 인프라의 다른 계층 어딘가가 심각하게 밀리고 있다는 명백한 객관적 증거일 뿐입니다."

---

Strong Interview Quote:
"My first objective is to identify where the latency is being introduced rather than assuming the network is at fault." <br> "저는 사용자가 느려졌다고 호소할 때 성급하게 회선 탓을 하지 않고, 최하위 물리 계층부터 L7 애플리케이션 세션 영역까지 메트릭을 동기화하여 정확한 병목 인큐베이터를 적시 도출합니다."

This statement highlights mature troubleshooting methodology. <br> 장애 상황에서 당황하지 않고 가용 도구를 활용해 범위를 체계적으로 격리하는 성숙한 프로페셔널 SRE의 문제 해결 자세를 증명합니다.

---

# Related Topics

- [network-q01-tcp-handshake.md](file:///Users/yg/workspace/tictok/docs/networking/network-q01-tcp-handshake.md)
- [network-q02-dns-resolution.md](file:///Users/yg/workspace/tictok/docs/networking/network-q02-dns-resolution.md)
- [network-q04-l4-vs-l7-load-balancer.md](file:///Users/yg/workspace/tictok/docs/networking/network-q04-l4-vs-l7-load-balancer.md)
- [gpu-q01-rdma-vs-tcp.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q01-rdma-vs-tcp.md)
- [gpu-q02-roce.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q02-roce.md)

---

## Status

Studying
