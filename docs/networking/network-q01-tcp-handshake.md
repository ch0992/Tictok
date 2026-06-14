# Networking Interview Question 01

## Explain the TCP 3-Way Handshake

### Difficulty

Medium

### Importance

★★★★★

### Frequency

★★★★★

---

# Quick Recall

TCP establishes a reliable connection before data transfer. <br> TCP는 데이터를 전송하기 전에 신뢰할 수 있는 연결을 수립합니다.

1. SYN
2. SYN-ACK
3. ACK

Purpose: <br> 목적:

- Synchronize sequence numbers <br> - 시퀀스 번호의 동기화
- Verify both sides can communicate <br> - 양방향 통신 가능 여부 검증
- Establish a reliable connection <br> - 신뢰할 수 있는 세션 채널 수립

---

# Interview Question

Can you explain how the TCP 3-way handshake works? <br> TCP 3-way handshake의 작동 원리를 설명해 주세요.

Why is it needed? <br> 왜 이 동작이 꼭 필요합니까?

---

# Interviewer's Intent

The interviewer wants to evaluate: <br> 면접관은 다음 사항들을 평가하고자 합니다:

- TCP fundamentals <br> - TCP 프로토콜의 핵심 동작 메커니즘
- Network troubleshooting knowledge <br> - 네트워크 트러블슈팅에 필요한 인프라 분석 지식
- Understanding of reliable communication <br> - 신뢰성 있는 통신 채널 수립에 대한 이해도
- Protocol-level thinking <br> - 프로토콜 및 패킷 수준에서의 논리적 분석 사고 방식

The interviewer is often less interested in memorization and more interested in understanding why the handshake exists. <br> 면접관은 단순히 단계를 외우는 것보다 3-Way Handshake가 왜 존재해야만 하는지에 대한 깊은 이해를 확인하고 싶어 합니다.

---

# Recommended Answer (English)

TCP is a connection-oriented protocol, which means a connection must be established before data can be exchanged. <br> TCP는 연결 지향형 프로토콜이므로 실제 데이터를 주고받기 전에 먼저 신뢰할 수 있는 연결을 수립해야 합니다.

The TCP 3-way handshake is the process used to establish that connection. <br> TCP 3-way handshake는 그러한 가상 연결을 맺기 위해 사용하는 프로토콜 수립 프로세스입니다.

First, the client sends a SYN packet to the server indicating that it wants to initiate a connection. <br> 첫째, 클라이언트는 서버에 연결 요청을 알리기 위해 SYN(동기화) 패킷을 전송합니다.

Second, the server responds with a SYN-ACK packet acknowledging the client's request and providing its own sequence number. <br> 둘째, 서버는 클라이언트의 요청을 확인(ACK)하고, 자신의 연결 설정을 위한 시퀀스 번호와 함께 SYN-ACK 패킷으로 응답합니다.

Finally, the client sends an ACK packet back to the server. <br> 마지막으로, 클라이언트는 서버의 응답을 확인했다는 ACK 패킷을 다시 서버로 전송합니다.

At that point, both sides have synchronized sequence numbers and the connection is established. <br> 이 시점이 되면 양단 간의 초기 시퀀스 번호(Sequence Number) 동기가 완료되고 세션 연결이 공식 수립됩니다.

The purpose of the handshake is to verify bidirectional communication and ensure reliable delivery before application data is transmitted. <br> 핸드쉐이크의 본질적인 목적은 애플리케이션 데이터가 전송되기 전에 양방향 통신이 정상 동작함을 검증하고 안정적인 데이터 딜리버리를 보장하는 준비를 마치기 위함입니다.

---

# Korean Summary

TCP는 Connection-Oriented Protocol이다.

즉 데이터를 보내기 전에 연결을 먼저 수립해야 한다.

과정은 다음과 같다.

Step 1

Client

SYN

"연결하고 싶습니다."

↓

Step 2

Server

SYN-ACK

"연결 요청을 받았고 나도 준비되었습니다."

↓

Step 3

Client

ACK

"확인했습니다."

↓

Connection Established

---

# Visual Flow

Client

↓

SYN

↓

Server

↓

SYN + ACK

↓

Client

↓

ACK

↓

Connection Established

---

# Why Is It Needed?

TCP는 신뢰성 있는 전송을 제공해야 한다. <br> TCP must provide reliable transmission.

Handshake를 통해: <br> Through the Handshake:

- 양방향 통신 가능 여부 확인 <br> - Confirm bidirectional communication capabilities
- 초기 Sequence Number 동기화 <br> - Synchronize initial sequence numbers
- 패킷 손실 방지 준비 <br> - Prepare to prevent packet loss
- Reliable Connection 수립 <br> - Establish a reliable connection

---

# Important Concepts

## SYN

Synchronize <br> 동기화 요청

Connection Request <br> 세션 연결 요청

---

## ACK

Acknowledgement <br> 수신 확인 응답

Packet Received <br> 패킷 수신 성공 알림

---

## Sequence Number <br> 시퀀스 번호

Used to: <br> 사용 목적:

- Detect lost packets <br> - 유실된 패킷 검출
- Detect duplicate packets <br> - 중복 전송된 패킷 제거
- Reassemble packets in order <br> - 패킷의 순서 있는 재조립

---

## Reliable Communication <br> 신뢰성 있는 통신

TCP guarantees: <br> TCP는 다음을 보장합니다:

- Ordered Delivery <br> - 전송 순서 보장
- Error Detection <br> - 데이터 오류 검출
- Retransmission <br> - 패킷 소실 시 자동 재전송

---

# Common Interview Follow-up

### Q1

Why are there 3 steps? <br> 왜 하필 3단계여야 할까요?

Why not 2? <br> 2단계로는 왜 불가능할까요?

Expected Answer <br> 모범 답변

Both sides must verify that they can send and receive packets. <br> 클라이언트와 서버 모두 자신이 패킷을 보낼 수 있고 받을 수도 있음을 완전하게 검증해야 합니다.

Two steps cannot fully verify bidirectional communication. <br> 2단계 구조에서는 서버 입장이나 클라이언트 입장 중 한쪽의 양방향 수신 여부를 완전하게 검증할 수 없습니다.

---

### Q2

Why not 4 steps? <br> 왜 4단계는 아닐까요?

Expected Answer <br> 모범 답변

Three steps are sufficient to establish the connection efficiently. <br> 양방향 통신 여부를 검증하고 상태를 동기화하기에 3단계만으로도 효율적이고 충분합니다.

---

### Q3

What happens after the handshake? <br> 핸드쉐이크가 끝난 후에는 무슨 일이 일어납니까?

Expected Answer <br> 모범 답변

Application data can be transmitted. <br> 실제 애플리케이션 데이터(HTTP 요청 등)를 전송할 수 있습니다.

TCP begins reliable data transfer. <br> TCP 프로토콜이 신뢰성 있는 데이터 전송 프로세스를 개시합니다.

---

### Q4

What happens if the SYN packet is lost? <br> 최초의 SYN 패킷이 유실되면 어떻게 됩니까?

Expected Answer <br> 모범 답변

The client retransmits the SYN packet after a timeout. <br> 클라이언트는 타임아웃 이후 SYN 패킷을 자동으로 다시 전송(Retransmit)합니다.

---

### Q5

What happens if the final ACK is lost? <br> 마지막 ACK 패킷이 유실되면 어떻게 됩니까?

Expected Answer <br> 모범 답변

The server may retransmit the SYN-ACK until timeout. <br> 서버는 마지막 ACK를 받지 못했으므로 SYN-ACK 패킷을 재전송하다가 결국 타임아웃 처리합니다.

TCP includes mechanisms to handle lost packets. <br> TCP는 이와 같은 패킷 유실 상황을 유연하게 처리할 수 있는 신뢰성 제어 로직을 내장하고 있습니다.

---

### Q6

What is a Half-Open Connection? <br> Half-Open Connection(반개방 연결)이란 무엇입니까?

Expected Answer <br> 모범 답변

One side believes the connection exists while the other side does not. <br> 통신 양단 중 한쪽만 세션 연결이 유효하다고 생각하고, 상대방은 연결 정보를 잃어버렸거나 없는 상태입니다.

---

# Real Production Example

Client <br> 클라이언트

↓

SYN

↓

Load Balancer <br> 로드 밸런서

↓

Backend Server <br> 백엔드 서버

↓

SYN-ACK

↓

ACK

↓

Application Traffic <br> 애플리케이션 실제 트래픽

If this handshake fails, users cannot establish connections to the service. <br> 만약 이 핸드쉐이크가 실패하면, 엔드 유저는 서비스로의 어떠한 네트워크 세션도 맺을 수 없게 됩니다.

---

# Common Troubleshooting Scenarios

## Scenario 1 <br> 시나리오 1

Cannot connect to service <br> 서비스 접속 불가 장애

Investigate: <br> 확인해야 할 사항:

- Firewall <br> - 방화벽 차단 정책
- Security Groups <br> - 보안 그룹(Security Group) 설정
- Network ACL <br> - 서브넷 단위 Network ACL 규칙
- Listening Ports <br> - 서버 상의 데몬 포트 리스닝(Listen) 상태

---

## Scenario 2 <br> 시나리오 2

Intermittent Connection Failures <br> 간헐적인 네트워크 연결 끊김 및 실패

Investigate: <br> 확인해야 할 사항:

- Packet Loss <br> - 라우터/물리 회선 상의 패킷 유실률
- Retransmissions <br> - 패킷 재전송(Retransmission) 카운트 증가 추이
- Load Balancer Health Checks <br> - 로드 밸런서의 비정상적인 헬스 체크 상태

---

## Scenario 3 <br> 시나리오 3

Slow Connection Establishment <br> 세션 연결 수립 속도가 매우 느려짐

Investigate: <br> 확인해야 할 사항:

- DNS Latency <br> - 도메인 네임 해석 지연(DNS Latency)
- SYN Retransmissions <br> - SYN 패킷 유실로 인한 재전송 딜레이
- Network Congestion <br> - 대역폭 포화로 인한 네트워크 혼잡(Congestion)

---

# Related Linux Commands

## Check Connections

```bash
ss -tan
```

---

## Packet Capture

```bash
tcpdump -i eth0
```

---

## Connection Statistics

```bash
netstat -s
```

---

# ByteDance Follow-up Possibility

Very High <br> 출제 확률 매우 높음

Typical Path <br> 면접 시 전형적인 꼬리 질문 흐름

TCP Handshake <br> TCP 3-Way Handshake 기본 동작

↓

TCP vs UDP <br> TCP와 UDP 프로토콜의 아키텍처적 차이

↓

Packet Loss <br> 패킷 유실 발생 시 프로토콜 동작

↓

Connection States <br> TCP 커넥션 상태 상태머신 (SYN_SENT, TIME_WAIT 등)

↓

Load Balancer <br> L4/L7 로드 밸런서 연계 흐름

↓

High Latency <br> 네트워크 고지연 장애 분석

↓

Network Troubleshooting <br> 실무 도구(tcpdump, ss)를 활용한 트러블슈팅 종합

---

# Personal Notes

Strong Interview Message <br> 면접 합격을 위한 핵심 메시지

TCP is not just about sending packets. <br> TCP는 단순히 패킷을 쏘아보내는 프로토콜이 아닙니다.

TCP is about establishing a reliable communication channel before data transfer begins. <br> 데이터를 실제로 전송하기 전에 엔드포인트 간에 물리적, 논리적으로 신뢰 가능한 통신 채널을 수립하는 데 그 목적이 있습니다.

---

Strong Interview Quote <br> 인상적인 면접 답변용 문구

"The purpose of the handshake is not simply connection establishment. It is to verify bidirectional communication and synchronize state between both endpoints." <br> "핸드쉐이크의 본질적 목적은 단순한 연결 맺기가 아닙니다. 양단 간의 가용한 양방향 통신 경로를 최종 검증하고, 패킷 정렬 상태(State)를 일치시키는 것에 그 의미가 있습니다."

This sounds much more senior than simply saying SYN, SYN-ACK, ACK. <br> 단순히 SYN, SYN-ACK, ACK 단계만 외워서 대답하는 것보다 훨씬 시니어급 SRE 엔지니어다운 전문성을 보여줄 수 있는 발언입니다.

---

## Status

Studying
