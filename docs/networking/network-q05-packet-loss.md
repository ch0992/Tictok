# Metadata

Category: Networking
Subcategory: Network Troubleshooting
Difficulty: Medium-Hard
Importance: ★★★★★
Frequency: ★★★★★
Related Topics:
- TCP
- Retransmission
- Latency
- RDMA
- RoCE
- Congestion Control
Interview Rounds:
- Technical Screen
- Hiring Manager
- Onsite
Tags:
packet-loss, networking, latency, tcp, troubleshooting

---

# network-q05-packet-loss.md

# Networking Interview Question 05

## Users Report Packet Loss

### Difficulty

Medium-Hard

### Importance

★★★★★

### Frequency

★★★★★

---

# Quick Recall

Packet Loss: Packets fail to reach the destination. <br> 패킷 유실: 패킷이 목적지에 도달하지 못하고 중간에 버려지는 현상입니다.

- TCP Retransmission: TCP resends lost packets. <br> - TCP 재전송: 유실을 감지한 TCP 프로토콜이 데이터를 재전송합니다.
- Increased Latency: Additional round trips increase response times. <br> - 지연 시간 증가: 재전송 과정으로 인해 지연 시간(RTT)이 급격히 증가합니다.
- Reduced Throughput: TCP congestion window shrinks upon loss. <br> - 처리량 저하: 패킷 유실 감지 시 TCP 혼잡 윈도우 크기가 급격히 줄어 전송 속도가 하락합니다.

Always identify: <br> 항상 다음 사항들을 우선 파악해야 합니다:
- Where loss occurs (NIC, switch, internet, routing path) <br> - 유실이 발생하는 정확한 위치 (네트워크 카드, 스위치, 인터넷망, 라우팅 경로)
- Why loss occurs (congestion, bad cable, MTU, configuration) <br> - 유실이 발생하는 근본적 원인 (혼잡, 케이블 불량, MTU 불일치, 설정 오류)
- Impact on application (latency, timeout, throughput degradation) <br> - 애플리케이션에 미치는 영향 (응답 지연, 시간 초과, 대역폭 급감)

---

# Interview Question

Users report packet loss and intermittent connectivity issues. <br> 사용자들이 패킷 유실 및 간헐적인 네트워크 연결 문제를 겪고 있다고 보고합니다.

How would you investigate and troubleshoot the problem? <br> 이러한 상황을 어떻게 조사하고 해결하시겠습니까?

---

# Interviewer's Intent

The interviewer wants to evaluate: <br> 면접관은 다음 역량을 평가하고자 합니다:

- Network troubleshooting methodology: Top-down or bottom-up structured approach. <br> - 네트워크 트러블슈팅 방법론: 체계적인 탑다운(Top-down) 또는 바텀업(Bottom-up) 분석 프레임워크 적용.
- TCP fundamentals: Knowledge of retransmission triggers, SACK, and CWND mechanics. <br> - TCP 핵심 원리: 패킷 유실 감지 시의 재전송 트리거, SACK 옵션 및 혼잡 제어 윈도우(CWND) 축소 매커니즘 이해.
- Production incident experience: Using commands (ping, traceroute, tcpdump, ethtool) effectively. <br> - 실무 장애 대응 능력: 적합한 진단 명령어(ping, traceroute, tcpdump, ethtool)의 능숙한 활용 및 로그 해석.
- Root Cause Analysis skills: Isolating issues between application, system kernel, and physical network layer. <br> - 근본 원인 분석 능력: 애플리케이션 버퍼, 커널 스택, 스위치 및 물리 케이블 단계 중 장애 구간 격리 능력.

---

# Recommended Answer (English)

When investigating packet loss, my first objective is to determine where the packet loss is occurring. <br> 패킷 유실 현상을 조사할 때, 저의 첫 번째 목표는 유실이 실제로 발생하는 정확한 지점을 식별하는 것입니다.

I would begin by collecting evidence rather than assuming the problem is caused by the network itself. <br> 네트워크 장비 자체의 문제라고 성급히 단정 짓지 않고, 먼저 다각적인 증거를 수집하는 것부터 시작합니다.

I would verify application behavior, network latency, retransmission rates, interface statistics, and recent infrastructure changes. <br> 구체적으로 애플리케이션 동작 패턴, 네트워크 RTT 지연 추이, TCP 재전송 비율, OS 네트워크 인터페이스 통계, 그리고 최근의 인프라 변경 이력을 검증합니다.

I would use tools such as ping, traceroute, tcpdump, and interface metrics to identify where packets are being dropped. <br> ping, traceroute, tcpdump 및 ethtool과 같은 인터페이스 메트릭 도구를 조합하여 패킷이 중간 스위치나 목적지 서버 어디서 유실되는지 확인합니다.

If packet loss is confirmed, I would determine whether it is caused by network congestion, hardware failures, configuration issues, MTU mismatches, or routing problems. <br> 패킷 유실이 확인되면 그것이 네트워크 혼잡(Congestion), 케이블/NIC 물리 손상(Hardware Error), 장치 설정 오작동, MTU 크기 불일치(MTU Mismatch), 혹은 라우팅 루프에 기인한 것인지 구분합니다.

I would then correlate the findings with application performance and user impact to determine the root cause and appropriate corrective actions. <br> 최종적으로 이 분석 결과들을 실제 애플리케이션 성능 지표 및 사용자 영향도와 연계 분석하여 근본 원인을 파악하고 적절한 조치를 이행합니다.

---

# Korean Summary

패킷 손실이 발생했다고 하면 먼저 실제 손실이 발생하는 위치를 찾습니다. <br> 유실 보고를 받으면 먼저 로컬 장비, 스위치, 라우터, 외부 망 중 어디서 드랍이 일어나는지 물리적/기능적 경계를 좁힙니다.

바로 네트워크를 의심하지 않습니다. <br> 클라이언트 컴퓨터 자체의 과부하, 애플리케이션 스레드 풀 고사, 또는 방화벽 정책 차단 가능성도 염두에 둡니다.

확인 항목: <br> 필수 체크 리스트:
- 응답 시간 및 지연 추이 (Ping RTT)
- TCP 재전송 및 SACK 발생 비율 (ss, netstat)
- NIC 인터페이스 에러 및 Drop 카운터 (ip -s link, ethtool)
- 최근 네트워크 구성 요소 변경사항 (Config Commit Log)

패킷 손실이 확인되면 구체적인 원인을 분석합니다. <br> 다음 5대 주요 원인을 집중 조사합니다:
- 네트워크 혼잡 (스위치 큐 버퍼 오버플로우)
- NIC/케이블 하드웨어 물리 불량 (CRC 에러 증가)
- MTU 불일치 (Jumbo Frame 전송 중 블랙홀 현상)
- 비대칭 라우팅 및 루프 (Routing Loop)
- 방화벽 속도 제한 (Rate Limiting) 및 ACL 차단

중요한 것은 단계별 진단 도구를 사용해 손실 발생 구간을 차근차근 좁혀가는 것입니다.

---

# Investigation Flow

User Reports Packet Loss <br> 사용자 패킷 유실 보고
↓
Confirm Symptoms (Ping / App Monitoring) <br> 증상 확인 (핑 테스트 및 앱 모니터링 수치 확인)
↓
Check Latency (RTT Spikes Analysis) <br> 지연 시간 확인 (왕복 지연 시간의 비정상적 스파이크 감지)
↓
Check Retransmissions (ss -s, netstat -s) <br> TCP 재전송 검사 (재전송 및 중복 ACK 발생량 모니터링)
↓
Check Interface Errors (ethtool -S, ip -s link) <br> 인터페이스 에러 점검 (NIC 레벨의 Drop/CRC/Overrun 통계 조회)
↓
Check Network Path (mtr, traceroute) <br> 네트워크 경로 분석 (중간 홉 구간의 드랍 여부 파악)
↓
Identify Loss Location (Internal vs External vs Transit) <br> 유실 위치 판별 (내부망 스위치 vs 외부 인터넷망 vs 특정 게이트웨이)
↓
Determine Root Cause (Congestion, MTU, Bad Cable, etc.) <br> 근본 원인 도출 (네트워크 포화, MTU 불일치, 케이블 접촉 불량 등)
↓
Mitigation (Route adjustment, MTU Tuning, Hardware replacement) <br> 장애 조치 이행 (대체 라우팅 우회, MTU 일치화, 물리 부품 교체)

---

# Important Concepts

## Packet Loss

Packets fail to reach the destination and are discarded by intermediate routers, switches, or host network cards. <br> 송신부에서 보낸 IP 패킷이 전송 도중 노이즈, 버퍼 포화, 라우팅 오류 등으로 인해 수신부에 도달하지 못하고 사라지는 현상입니다.

---

## Retransmission

TCP detects lost packets via duplicate ACKs or Retransmission Timeouts (RTO) and resends the data to guarantee reliability. <br> TCP 프로토콜이 패킷 누락을 인지(중복 ACK 수신 또는 RTO 시간 초과)하면, 신뢰성을 보장하기 위해 해당 유실 블록을 다시 재전송(Retransmit)합니다.

---

## Latency

Packet loss often increases latency because retransmissions require additional round trips (RTT) to complete the data transfer. <br> 패킷 유실이 발생하면 재전송 및 확인 응답을 받기 위한 추가적인 왕복 지연이 동반되므로, 사용자 브라우저나 API 관점의 체감 지연 시간(Latency)이 기하급수적으로 늘어납니다.

---

## Throughput

Packet loss significantly reduces throughput, especially for large data transfers, because TCP's congestion control mechanism drastically shrinks the congestion window (CWND) to avoid further congestion. <br> 패킷 유실이 감지되면 TCP 혼잡 제어 알고리즘이 망 혼잡 상황으로 간주하고 전송 윈도우 크기(CWND)를 절반 이하로 줄여 대량 데이터 이동 속도(Throughput)가 대폭 저하됩니다.

---

# Common Root Causes

## Network Congestion

Link saturation and oversubscribed network switches fill up their buffer queues, causing tail-drops where new incoming packets are discarded. <br> 네트워크 회선 대역폭이 100% 포화되거나 스위치 장비의 입출력 버퍼 큐가 가득 차서, 새로 들어오는 패킷들을 버리는 꼬리 드랍(Tail-drop) 현상입니다.

---

## Faulty Hardware

Damaged copper/fiber cables, failing SFP transceivers, or faulty network interface cards (NICs) introduce packet corruption and bit errors. <br> 커넥터 접속 불량, 꺾인 광케이블, SFP 모듈 열화, 또는 랜카드 불량 등으로 패킷 비트가 훼손되어 노이즈 드랍이 발생합니다.

---

## MTU Mismatch

A server configured with Jumbo Frames (MTU 9000) sends packets that hit an intermediate switch or router with a standard MTU of 1500 with the Don't Fragment (DF) flag set, leading to silent drops (Black Hole). <br> 서버는 점보 프레임(MTU 9000)을 사용하여 대용량 패킷을 송출했으나, 중간 경로의 라우터가 표준 1500 바이트 크기 제한을 갖고 있으며 '단편화 방지(DF)' 플래그가 설정되어 패킷이 그냥 차단되는 블랙홀 현상입니다.

---

## Routing Issues

Asymmetric routing path variations, loop routing configurations, or flapping BGP advertisements cause out-of-order packets and drops. <br> 요청과 응답 경로가 불일치하여 비대칭 상태가 되거나 라우팅 테이블이 계속 갱신되면서 패킷이 순환 경로(Loop)에 갇혀 버리는 현상입니다.

---

## Firewall / ACL Issues

Misconfigured stateful firewalls, strict Access Control Lists (ACLs), or active security rate limiters drop legitimate packet flows. <br> 보안 장비의 과부하로 정상 패킷을 차단하거나, 방화벽의 세션 테이블 포화, DDoS 완화 장비의 오탐으로 인해 트래픽을 필터링 드랍하는 현상입니다.

---

# Key Commands

## Basic Connectivity

```bash
ping -c 100 -i 0.2 <host_ip>
```
Detect packet loss rate, identify latency fluctuations (jitter), and verify network reachability. <br> 100회 이상의 고속 핑을 발송하여 패킷 유실률을 산출하고 왕복 지연 시간의 편차(Jitter)를 수치화합니다.

---

## Path Analysis

```bash
mtr -g <host_ip>
```
A dynamic real-time traceroute that shows loss percentage and latency details for every hop along the route. <br> 실시간으로 경로를 추적하면서 라우팅 노드별 누적 패킷 유실률과 응답 속도 변화를 보여주는 진보된 경로 진단 도구입니다.

---

## Interface Statistics

```bash
ip -s link show eth0
ethtool -S eth0
```
Check physical interface statistics for drops, overrun errors, frame errors, and CRC check failures. <br> 물리 네트워크 카드 레벨에서 발생하는 CRC 에러, 링 버퍼 오버런(Overrun), 드랍 카운터를 확인합니다.

---

## Packet Capture

```bash
tcpdump -i eth0 -n "tcp[tcpflags] & (tcp-syn|tcp-fin) != 0"
tcpdump -i eth0 -n "tcp and (tcp.analysis.retransmission or tcp.analysis.fast_retransmission)"
```
Analyze packet flows to isolate duplicates, out-of-order packets, window size advertisements, and retransmissions. <br> 실제 송수신되는 패킷 흐름을 캡처하여 순서 역전(Out-of-Order), 중복 ACK, RTO 만료에 의한 실제 재전송 건들을 정밀 추적합니다.

---

## Socket Statistics

```bash
ss -ti
```
Get active socket options, RTT measurements, congestion window size (cwnd), and retransmission statistics. <br> 개별 TCP 커넥션 단위로 세부 RTT 값, 혼잡 윈도우 크기(cwnd), 슬로우 스타트 임계치 및 소실 패킷 개수를 덤프합니다.

---

# Common Interview Follow-up

### Q1

How does packet loss affect TCP? <br> 패킷 유실은 TCP 프로토콜 동작에 어떤 직접적인 영향을 미칩니까?

Expected Answer
TCP detects loss via duplicate ACKs (triggering Fast Retransmit) or Retransmission Timeouts (RTO). Once loss is confirmed, TCP shrinks its congestion window (CWND) to avoid network saturation, causing a severe drop in connection throughput and adding round-trip delays to repair the data. <br> TCP는 중복 ACK 수신 또는 RTO 시간 초과로 유실을 감지합니다. 유실을 판별하면 TCP는 즉시 혼잡 윈도우(CWND) 크기를 반감시키거나 초기화하여 데이터 유입량을 줄이고, 유실된 패킷의 재전송을 마치기 전까지 상위 애플리케이션에 데이터를 올려보내지 못하므로 전체 전송 대역폭이 급감하고 RTT 단위 지연이 생깁니다.

---

### Q2

Why can a small amount of packet loss cause large performance degradation? <br> 아주 미미한 수준(예: 1~2%)의 패킷 유실이 시스템 전체 성능에 치명적인 저하를 유발하는 이유는 무엇인가요?

Expected Answer
Even a small packet loss rate triggers TCP's congestion control algorithms, causing the sender to drop back into Slow Start or Congestion Avoidance mode. Additionally, the Head-of-Line (HoL) blocking in TCP prevents later packets from being read by the application until the lost segment is retransmitted and acknowledged. <br> 미세한 유실만으로도 TCP는 혼잡 상태로 인식하여 슬로우 스타트(Slow Start)로 전환하거나 CWND를 축소시킵니다. 또한, TCP는 신뢰성 순서 보장(Head-of-Line blocking)을 하기 때문에, 먼저 보낸 유실된 패킷 하나가 재전송되어 성공적으로 받아질 때까지 뒤이어 도착한 정상 패킷들도 버퍼에 묶여 애플리케이션으로 읽혀지지 않기 때문에 성능이 병목화됩니다.

---

### Q3

How would you identify where packet loss occurs? <br> 네트워크 상에서 패킷 유실이 구체적으로 어느 지점에서 일어나고 있는지 판단하는 프로세스는 무엇입니까?

Expected Answer
I would use `mtr` (My Traceroute) to test loss at every hop along the route. If hops inside my network show 0% loss but loss appears at a specific transit ISP hop, it points to an external routing problem. I would also check interface errors on intermediate switches via SNMP or CLI, and run packet captures (`tcpdump`) on both client and server sides to see which segments are sent but never arrive. <br> `mtr`을 사용하여 클라이언트와 서버 사이의 모든 네트워크 홉 구간별 유실률을 대조합니다. 우리 내부 게이트웨이에서는 에러가 없으나 특정 외부 ISP 통과 구간부터 유실이 발생하면 외부 망 장애로 분류합니다. 또한 클라이언트와 서버 양끝단에서 동시에 `tcpdump`를 실행해 보낸 패킷이 유입되었는지 유실되었는지(패킷 매칭) 대조하며 에러를 판별합니다.

---

### Q4

What is MTU mismatch? <br> MTU 불일치(MTU Mismatch) 현상이란 무엇이며 어떻게 감지하나요?

Expected Answer
An MTU mismatch occurs when a host transmits packets larger than the Maximum Transmission Unit supported by a hop along the path. If the packet has the Don't Fragment (DF) flag set, the routing device drops it and should send an ICMP "Fragmentation Needed" message. If firewalls block ICMP, this creates an MTU black hole. We can diagnose this by running a ping command with DF set: `ping -M do -s 8972 <target>`. <br> 송신 장비가 대상 경로 스위치들의 최대 전송 단위(MTU)보다 큰 크기의 패킷을 전송할 때 발생합니다. 패킷에 단편화 금지(DF) 속성이 활성화되어 있으면 중간 라우터는 패킷을 즉시 폐기하고 ICMP Fragmentation Needed 메시지를 돌려주어야 하는데, 보안 장비가 이 ICMP를 막아두면 패킷이 흔적 없이 사라져(MTU 블랙홀) 연결이 중단됩니다. 이는 `ping -M do -s 8972`와 같이 점보 크기에 DF를 걸어 발송해보는 방식으로 테스트가 가능합니다.

---

### Q5

Can packet loss occur even when latency appears normal? <br> 평균 지연 시간(Latency)이 정상으로 출력되는 상황에서도 패킷 유실이 발생할 수 있나요?

Expected Answer
Yes. Under low-load or intermittent packet drop conditions, the average RTT of successfully returned ping packets can still be extremely low (e.g. 5ms). However, if 2% of the packets are completely dropped, the overall TCP performance will suffer because of retransmission pauses, even though the standard TCP ping only measures the active successful rounds. <br> 네, 충분히 발생할 수 있습니다. 예를 들어 네트워크 장비의 랜덤 드랍이나 순간적 큐 포화 상태일 때, 전송에 성공한 98%의 패킷에 대한 평균 왕복 시간(RTT)은 5ms로 매우 쾌적하게 측정될 수 있습니다. 그러나 손실된 2%의 패킷으로 인해 발생하는 TCP 세션 복구 지연과 성능 하락은 발생하므로, 단순 핑 테스트의 응답 속도 평균값만으로는 유실 유무를 완전하게 식별할 수 없습니다.

---

# Real Production Example

Observed: <br> 장애 인지 상황:
Storage throughput was significantly lower than expected during high-load AI model checkpoint saves. <br> 대량의 AI 모델 체크포인트를 저장하는 시점에 스토리지 쓰기 처리량(Throughput)이 스펙 대비 10% 이하로 급격히 저하되었습니다.

Investigation: <br> 진단 및 추적 과정:
- Checked application CPU/Memory metrics, showing normal CPU usage but high I/O wait times. <br> - 애플리케이션 CPU/Memory는 여유가 있었으나 I/O Wait 상태가 비정상적으로 높게 유지됨을 파악했습니다.
- Ran `ss -ti` on the storage interface, showing high TCP retransmissions (`retrans` counter increasing continuously). <br> - 스토리지 전송용 랜카드 인터페이스에 대해 `ss -ti`를 조회하니 TCP 재전송(`retrans`) 누적 횟수가 끝없이 급증하고 있었습니다.
- Captured network traffic via `tcpdump`, confirming a flood of duplicate ACKs and RTO pauses. <br> - `tcpdump` 패킷 분석 결과 중복 ACK의 연속 유입 및 RTO(재전송 타임아웃)로 인한 데이터 흐름 정지를 대조 확인했습니다.
- Validated RDMA (RoCE) metrics, and discovered that the network had fallen back to TCP. <br> - 고속 RoCE(RDMA over Converged Ethernet) 장치 링크 상태를 조회한 결과, 스위치 혼잡 제어가 꺼져 전송 계층이 표준 TCP 모드로 폴백(Fallback)되었음을 식별했습니다.

Result: <br> 조치 결과:
Priority Flow Control (PFC) was disabled on the switch, leading to packet drops during high throughput. Fallback to TCP increased latency and dropped throughput. <br> 스위치의 우선순위 흐름 제어(PFC) 활성화 설정이 누락되어 대용량 쓰기 요청 시 패킷 드랍이 유발되었고, 이로 인해 지연 시간이 긴 일반 TCP로 폴백되면서 대역폭이 40배 가량 급감했던 현상이었습니다. 스위치 PFC 및 eCN 설정을 복구하여 무손실 RDMA 상태를 재확립하였습니다.

---

# ByteDance Follow-up Possibility

Very High <br> 바이트댄스 면접 꼬리 질문 출제 확률 100%

Typical Flow: <br> 예상 심화 질문 흐름:
Packet Loss & Retransmission mechanics <br> 패킷 유실 검출 및 재전송 제어 원리
↓
TCP Congestion Control algorithms (BBR vs CUBIC) <br> TCP 혼잡 제어 알고리즘의 유실 대응 차이 (CUBIC의 윈도우 반감 vs BBR의 RTT-Bandwidth 실측 모델)
↓
RDMA/RoCE stateless packet processing <br> 대규모 AI 분산 연산 환경에서의 RDMA 무손실 네트워크 구성 요건
↓
PFC (Priority Flow Control) Head-of-Line blocking & storm issues <br> PFC(우선순위 흐름 제어) 오동작 시의 버퍼 포화 정체 전파(Congestion Propagation) 대책
↓
eCN (Explicit Congestion Notification) config on modern Leaf-Spine Switches <br> 데이터센터 스위치 레벨의 eCN 표식을 활용한 지능형 혼잡 완화 설계안

---

# Personal Notes

Strong Interview Message: <br> 면접에서 어필할 강력한 핵심 메시지:
"Packet loss is not just a networking metric. It is a system-wide symptom that directly impacts application performance, TCP congestion control state machines, and distributed storage stability." <br> "패킷 유실은 일시적인 네트워크 지표가 아닙니다. 그것은 TCP 혼잡 제어 엔진의 대역폭 축소를 자극하고, 상위 애플리케이션의 버퍼 병목(HoL)을 야기하며, 나아가 데이터센터 저장소와 분산 AI 인프라 전체의 안정성을 무너뜨리는 전파성 장애의 신호탄입니다."

---

# Strong Interview Quote

"My goal is not simply to detect packet loss. My goal is to determine where it occurs and how it affects the application." <br> "제 목표는 단순히 패킷이 손실된다는 사실을 검출하는 것이 아닙니다. 손실이 발생하는 네트워크 노드 위치를 신속히 격리하고, 그것이 비즈니스 애플리케이션에 어떤 형태의 지연과 오류를 입히고 있는지 인과관계를 밝히는 것입니다."

This demonstrates strong troubleshooting methodology. <br> 이는 단순 조작 요원이 아닌 고수준 SRE 엔지니어다운 깊이와 접근 방식을 명확하게 부각시킵니다.

---

# Related Topics

- [network-q01-tcp-handshake.md](file:///Users/yg/workspace/tictok/docs/networking/network-q01-tcp-handshake.md)
- [network-q02-dns-resolution.md](file:///Users/yg/workspace/tictok/docs/networking/network-q02-dns-resolution.md)
- [network-q03-high-latency.md](file:///Users/yg/workspace/tictok/docs/networking/network-q03-high-latency.md)
- [network-q04-l4-vs-l7-load-balancer.md](file:///Users/yg/workspace/tictok/docs/networking/network-q04-l4-vs-l7-load-balancer.md)
- [gpu-q01-rdma-vs-tcp.md](file:///Users/yg/workspace/tictok/docs/gpu/gpu-q01-rdma-vs-tcp.md)

---

## Status

Studying
