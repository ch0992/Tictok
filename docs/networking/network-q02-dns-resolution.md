# Metadata

Category: Networking
Subcategory: DNS
Difficulty: Medium
Importance: ★★★★★
Frequency: ★★★★★
Related Topics:
- DNS
- TCP
- TLS
- HTTP
- CDN
- Load Balancer
Interview Rounds:
- Technical Screen
- Hiring Manager
- Onsite
Tags:
networking, dns, http, tcp, troubleshooting

---

# network-q02-dns-resolution.md

# Networking Interview Question 02

## What Happens When You Type google.com Into a Browser?

### Difficulty

Medium

### Importance

★★★★★

### Frequency

★★★★★

---

# Quick Recall

User enters URL <br> 사용자의 URL 입력
↓
DNS Lookup <br> DNS 조회를 통한 IP 획득
↓
TCP Handshake <br> TCP 3-Way 핸드쉐이크
↓
TLS Handshake <br> 암호화를 위한 TLS 핸드쉐이크
↓
HTTP Request <br> HTTP GET 요청 발송
↓
Server Response <br> 서버의 응답
↓
Browser Rendering <br> 브라우저 화면 렌더링

---

# Interview Question

What happens when you type https://www.google.com into your browser and press Enter? <br> 브라우저 주소창에 https://www.google.com을 입력하고 Enter를 누르면 어떤 과정이 수행되나요?

---

# Interviewer's Intent

The interviewer wants to evaluate: <br> 면접관은 다음 사항들을 평가하고자 합니다:

- DNS fundamentals <br> - DNS 프로토콜 및 계층 구조 동작 이해도
- Network fundamentals <br> - 전반적인 네트워크 기본 지식
- End-to-end request flow <br> - 클라이언트부터 백엔드 서버까지의 엔드투엔드 요청 흐름
- System thinking <br> - 시스템 수준의 거시적 사고방식
- Troubleshooting knowledge <br> - 네트워크 장애 발생 시 계층별 트러블슈팅 지식

This is not a DNS-only question. It is a full-stack infrastructure question. <br> 이 질문은 단순 DNS 조회 질문이 아닙니다. 전체 인프라 아키텍처를 아우르는 종합 질문입니다.

---

# Recommended Answer (English)

When a user enters a URL such as https://www.google.com, the browser first checks its local cache to determine whether it already knows the IP address. <br> 사용자가 https://www.google.com과 같은 URL을 입력하면, 브라우저는 먼저 자체 로컬 캐시를 확인하여 이미 IP 주소를 알고 있는지 확인합니다.

If the address is not cached, the operating system performs DNS resolution to obtain the IP address associated with the domain. <br> 주소가 캐싱되어 있지 않다면, 운영체제(OS)는 도메인명에 해당하는 IP 주소를 얻기 위해 DNS 계층 구조에 따른 재귀적 조회를 수행합니다.

Once the IP address is known, the client establishes a TCP connection with the destination server using the TCP three-way handshake. <br> IP 주소를 성공적으로 확보하면, 클라이언트는 대상 서버와 TCP 3-way handshake를 실행하여 전송 계층 연결을 성립합니다.

After the TCP connection is established, a TLS handshake occurs because HTTPS is being used. <br> TCP 세션이 성립된 후, HTTPS 보안 프로토콜을 사용하고 있으므로 보안 채널 설정을 위한 TLS 핸드쉐이크를 수행합니다.

TLS negotiates encryption parameters and validates the server certificate to ensure authenticity. <br> TLS 과정에서 암호화 매개변수(Cipher Suite)를 조율하고 서버 인증서 유효성을 검증하여 안전성을 보장합니다.

Once the secure connection is established, the browser sends an HTTP request. <br> 암호화 채널이 완전하게 셋업되면, 브라우저는 서버로 HTTP GET 요청(웹 리소스 요청)을 발송합니다.

The server processes the request and returns an HTTP response, typically containing HTML, CSS, and JS. <br> 백엔드 웹 서버나 로드 밸런서가 요청을 처리한 뒤 HTML, CSS, JS 등의 자원을 담은 HTTP 응답을 회신합니다.

Finally, the browser downloads any required resources and renders the page for the user. <br> 마지막으로 브라우저는 내려받은 리소스를 구문 분석(Parsing)하고 화면에 최종 렌더링(Rendering)합니다.

---

# Korean Summary

사용자가 https://www.google.com 을 입력하면 다음 순서가 진행된다.

1. Browser Cache 확인 (브라우저 내 캐시된 IP 탐색)
2. DNS 조회 (Local Resolver -> Root -> TLD -> Authoritative DNS 순으로 확인)
3. TCP 3-Way Handshake (Port 443 세션 연결 수립)
4. TLS Handshake (공개키 검증 및 세션키 생성)
5. HTTP Request (GET 요청 발송)
6. HTTP Response (HTML/CSS/JS 데이터 응답 수신)
7. Browser Rendering (DOM/CSSOM 트리 빌드 및 화면 렌더링)

---

# Detailed Flow

User <br> 사용자 입력
↓
Browser Cache <br> 브라우저 내 캐시 조회 (chrome://net-internals/#dns 등)
↓
OS DNS Cache <br> OS 호스트 파일 및 로컬 DNS 캐시 (/etc/hosts 등)
↓
DNS Resolver <br> 로컬 DNS 서버 조회 (ISP DNS, 8.8.8.8 등)
↓
Authoritative DNS Server <br> 권한 있는 네임서버 조회 (Root -> TLD -> Google NS)
↓
IP Address Returned <br> IP 주소 회신 완료
↓
TCP Handshake <br> 전송 계층(L4) 세션 연결
↓
TLS Handshake <br> 보안 계층(L5/L6) 암호화 세션 확립
↓
HTTP Request <br> 애플리케이션 계층(L7) 데이터 요청
↓
Server Response <br> 서버 측 응답 메시지 반환
↓
Page Rendering <br> 브라우저 드로잉 및 페인팅 동작

---

# DNS Resolution

## Purpose

Convert text `www.google.com` into IP Address `142.250.196.142` <br> 사람이 읽을 수 있는 도메인 주소(www.google.com)를 컴퓨터가 이해할 수 있는 숫자형 IP 주소로 변환하는 목적을 가집니다.

---

## Common Record Types

### A Record
Domain → IPv4 (도메인을 IPv4 주소로 매핑)

---

### AAAA Record
Domain → IPv6 (도메인을 IPv6 주소로 매핑)

---

### CNAME
Alias (도메인을 다른 별칭 도메인으로 매핑)

---

### MX
Mail Server (메일 전송에 사용되는 메일 서버 정보 매핑)

---

# TCP Handshake

Purpose: Reliable Connection Establishment <br> 신뢰성 있는 4계층 세션 연결을 수립하기 위해 사용됩니다.

Steps:
1. SYN (클라이언트 $\rightarrow$ 서버 연결 요청)
2. SYN-ACK (서버 $\rightarrow$ 클라이언트 응답 및 동기화 요청)
3. ACK (클라이언트 $\rightarrow$ 서버 최종 확인)

---

# TLS Handshake

Purpose: Secure Communication <br> 대칭키/비대칭키 암호화 기법을 결합하여 데이터를 안전하게 전송하는 터널을 수립합니다.

Tasks:
- Certificate Validation: Verify server identity using CA <br> - 인증서 검증: 인증 기관(CA) 서명을 통해 서버의 신원 보장
- Key Exchange: Negotiate session key using asymmetric encryption <br> - 키 교환: 비대칭키 방식으로 세션 암호화에 쓸 대칭 대칭키 합의
- Encryption Negotiation: Agree on cipher suites <br> - 암호화 협상: 지원 가능한 암호화 알고리즘 목록(Cipher Suite) 조율

---

# HTTP Request

Example:
```http
GET / HTTP/1.1
Host: www.google.com
User-Agent: Mozilla/5.0
Accept: text/html
```

---

# HTTP Response

Example:
```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 12560
Server: gws

<!DOCTYPE html><html>...</html>
```

---

# Common Interview Follow-up

### Q1

What happens if DNS fails? <br> DNS 조회가 실패하면 어떻게 됩니까?

Expected Answer
The browser cannot resolve the domain name and therefore cannot establish a connection. <br> 브라우저가 도메인에 매핑된 IP 주소를 알 방법이 없기 때문에, 이후의 TCP 핸드쉐이크 단계로 넘어가지 못하고 연결 실패 에러가 발생합니다.

---

### Q2

What is DNS caching? <br> DNS 캐싱이란 무엇인가요?

Expected Answer
Previously resolved DNS results are stored locally to reduce lookup latency. <br> 이전에 한 번 조회한 도메인의 IP 정보를 브라우저, OS, 또는 로컬 네임서버에 TTL(Time To Live) 동안 보존하여 네트워크 조회 성능을 극대화합니다.

---

### Q3

Why is DNS important? <br> DNS가 인프라에서 왜 핵심적인가요?

Expected Answer
Humans use names. Networks use IP addresses. DNS translates between them. <br> 사람은 문자로 된 도메인을 기억하기 쉽지만, 기기 간의 실제 라우팅은 IP 기반으로만 일어납니다. DNS는 이 둘 사이의 가교 역할을 해 줍니다.

---

### Q4

What happens if TCP succeeds but TLS fails? <br> TCP 연결은 수립되었으나 TLS 핸드쉐이크가 실패하면 어떤 현상이 벌어집니까?

Expected Answer
Connection established. Secure session not established. HTTPS request cannot proceed. <br> L4 레벨의 소켓은 성공적으로 개방(Connect)되었으나 보안 인증 및 비밀키 조율이 깨진 것이므로, 브라우저는 HTTPS SSL 보안 에러(인증서 무효 등)를 화면에 띄우고 L7 요청을 중단합니다.

---

### Q5

What happens if TLS succeeds but HTTP returns 500? <br> TLS까지 정상 수립되었으나 서버가 HTTP 500 에러를 반환하면 원인은 어디에 있습니까?

Expected Answer
Network is healthy. Application failed. <br> 네트워크, 암호화 채널, 포트 개방 등 모든 인프라 경로는 완전하게 동작하고 있는 상태입니다. 500 에러는 백엔드 애플리케이션 소스 코드나 데이터베이스 조회단에서 에러가 발생했음을 보여줍니다.

---

# Common Troubleshooting Scenarios

## Scenario 1
Website unreachable <br> 특정 웹사이트 접속 불가

Investigate:
```bash
nslookup www.google.com
dig www.google.com
```
Evaluate whether DNS is returning the correct IP. <br> DNS 네임서버가 올바른 IP를 반환하고 있는지 질의 도구로 점검합니다.

---

## Scenario 2
DNS latency <br> 웹페이지 첫 진입 시 오랜 대기 지연

Investigate:
- DNS Resolver configuration (e.g. `/etc/resolv.conf`) <br> - DNS 리졸버 서버 설정 및 지연 상태
- Upstream DNS response times <br> - 상위 DNS 네임서버와의 핑 지연
- Cache Misses / Low TTL <br> - 잦은 캐시 만료로 인한 도메인 전체 재귀 조회 발생 여부

---

## Scenario 3
Intermittent failures <br> 간헐적인 도메인 접속 불통 장애

Investigate:
- TTL Settings <br> - DNS 레코드의 TTL 설정 시간 점검
- DNS propagation delay <br> - 네임서버 변경 사항이 전 세계 리졸버로 전파되는 지연 시간 분석
- Load Balancer records / Round Robin DNS stability <br> - 다중 IP 매핑(DNS 라운드 로빈) 시 불량 인스턴스 IP가 포함되어 있는지 확인

---

# Useful Commands

## DNS Lookup
```bash
nslookup google.com
```

---

## Advanced DNS Query
```bash
dig google.com
```

---

## Trace DNS Resolution
```bash
dig +trace google.com
```

---

## Connectivity Test
```bash
curl -v https://google.com
```

---

# Real Production Example

User reports: "Website is down." <br> 운영 상황에서 사용자가 "웹사이트가 안 켜진다"고 리포트했습니다.

Investigation Flow:
DNS Check $\rightarrow$ TCP Connection Check $\rightarrow$ TLS Certificate Check $\rightarrow$ Application Log Check <br> 순서로 레이어별로 아래에서 위로 격리 진단을 나섭니다.

Result:
DNS record was accidentally deleted during infrastructure changes. <br> 인프라 변경 작업 중 DNS CNAME/A 레코드가 누락/삭제된 것으로 밝혀졌습니다.

---

# ByteDance Follow-up Possibility

Very High <br> 바이트댄스 면접 출제 확률 극도로 높음

Typical Flow:
DNS Resolution $\rightarrow$ CDN Edge Server $\rightarrow$ Load Balancer $\rightarrow$ Backend Server $\rightarrow$ TLS handshake latency optimization $\rightarrow$ HTTP/2 multiplexing <br> DNS 확인부터 CDN 에지 서버 경유, L4/L7 로드밸런싱, 그리고 TLS 지연시간 단축 기법(Session Ticket, False Start) 및 HTTP 프로토콜 최적화(Multiplexing) 영역까지 꼬리 질문이 이어집니다.

---

# Personal Notes

Strong Interview Message:
I always troubleshoot from the lowest layer upward (DNS $\rightarrow$ Network $\rightarrow$ Transport $\rightarrow$ Application). <br> "저는 장애 인프라를 분석할 때 항상 가장 낮은 계층(L3/L4 DNS, IP 라우팅)부터 점검하여 점진적으로 상위 계층(TLS, 애플리케이션)으로 격리 분석해 나갑니다."

---

Strong Interview Quote:
"Just because a website is unavailable does not mean the application is broken. I first determine which layer is failing." <br> "웹사이트 접속이 불가능하다고 해서 애플리케이션 코드가 깨진 것은 아닙니다. 저는 어떤 네트워크 레이어에서 패킷 드롭이나 응답 차단이 발생하는지 순서대로 증명해 보일 것입니다."

This statement highlights strong SRE-oriented expertise. <br> 단순히 개발자 입장이 아닌 인프라 장애를 전방위적으로 관찰하는 SRE 다운 관점의 깊이 있는 답변 태도입니다.

---

## Status

Studying
