# Metadata

Category: Networking
Subcategory: Load Balancing
Difficulty: Medium
Importance: ★★★★★
Frequency: ★★★★★
Related Topics:
- TCP
- HTTP
- Ingress
- Nginx
- Istio
- Kubernetes
- Reverse Proxy
Interview Rounds:
- Technical Screen
- Hiring Manager
- Onsite
Tags:
load-balancer, l4, l7, networking, kubernetes, ingress

---

# network-q04-l4-vs-l7-load-balancer.md

# Networking Interview Question 04

## Explain the Difference Between L4 and L7 Load Balancers

### Difficulty

Medium

### Importance

★★★★★

### Frequency

★★★★★

---

# Quick Recall

L4 is fast and focuses on network packets. <br> L4는 네트워크 패킷에 포커스를 두며 매우 빠릅니다.

- TCP/UDP protocol focus <br> - TCP/UDP 프로토콜 기준 동작
- IP + Port destination routing <br> - IP 및 포트 주소 목적지 기반 라우팅
- Faster forwarding, low CPU overhead <br> - 패킷 단순 전달로 연산 속도 우수, 낮은 CPU 오버헤드
- Less intelligent (no payload visibility) <br> - 세부 정보(페이로드) 해석 불가

L7 is flexible and application-aware. <br> L7은 유연하며 애플리케이션 정보를 완전히 인지합니다.

- HTTP/HTTPS/gRPC protocol focus <br> - HTTP, HTTPS, gRPC 프로토콜 분석 동작
- URL Path, Headers, Hostname routing <br> - URL 경로, 호스트 헤더, 쿠키 내용 기반 라우팅
- Cookie-based sticky sessions <br> - 쿠키 기반의 세션 고정(Sticky Session) 지원
- More flexible, but higher CPU consumption <br> - 유연한 라우팅이 가능하나, 패킷 파싱으로 인한 높은 CPU 사용량

---

# Interview Question

Can you explain the difference between Layer 4 and Layer 7 load balancing? <br> Layer 4와 Layer 7 로드 밸런싱의 차이점을 설명해 주시겠습니까?

When would you use each? <br> 각각 어떤 상황에서 사용하시겠습니까?

---

# Interviewer's Intent

The interviewer wants to evaluate: <br> 면접관은 다음 사항들을 평가하고자 합니다:

- OSI Model understanding: L4 Transport vs L7 Application layers. <br> - OSI 참조 모델 이해도: L4 전송 계층과 L7 애플리케이션 계층 차이 식별.
- Networking fundamentals: TCP sessions termination differences. <br> - 네트워크 기본기: TCP 세션 연결 종단(Termination) 메커니즘의 차이.
- Modern cloud architecture: Nginx Ingress vs Cloud Load Balancers (NLB/ALB). <br> - 클라우드 아키텍처 지식: Nginx Ingress와 클라우드 로드 밸런서(NLB/ALB)의 매핑 관계.
- Production experience: Understanding performance overhead vs routing logic trade-offs. <br> - 프로덕션 운영 경험: 처리 속도(성능)와 지능형 라우팅 요구사항 간의 트레이드오프 이해.

---

# Recommended Answer (English)

Layer 4 load balancing operates at the transport layer and makes routing decisions based on information such as source IP, destination IP, and port numbers. <br> Layer 4 로드 밸런싱은 전송 계층(Transport Layer)에서 동작하며 출발지 IP, 목적지 IP 및 포트 번호와 같은 정보를 바탕으로 라우팅 결정을 내립니다.

It does not inspect the application payload. <br> 애플리케이션 페이로드(데이터 본문 내용)를 열어보거나 검사하지 않습니다.

Because of this, Layer 4 load balancers are generally faster and introduce less overhead. <br> 이로 인해 L4 로드 밸런서는 일반적으로 연산 처리가 빠르고 부가적인 성능 오버헤드가 매우 적습니다.

Layer 7 load balancing operates at the application layer and can inspect HTTP or HTTPS traffic. <br> 반면 Layer 7 로드 밸런싱은 애플리케이션 계층(Application Layer)에서 동작하며 HTTP 또는 HTTPS 트래픽 내용을 직접 해독하고 검사할 수 있습니다.

It can make routing decisions based on: <br> L7 로드 밸런서는 다음과 같은 풍부한 요청 정보를 기반으로 지능적인 라우팅 결정을 내릴 수 있습니다:

- URL paths <br> - URL 세부 경로 (예: /api/*, /static/*)
- Host headers <br> - HTTP Host 헤더 (예: api.company.com)
- Cookies and user sessions <br> - 쿠키 정보 및 사용자 세션 상태
- Request methods and headers <br> - HTTP 요청 메소드(GET, POST) 및 헤더 값

This enables more advanced routing and traffic management capabilities. <br> 이를 통해 고급 라우팅, 무중단 배포 제어 및 세밀한 트래픽 쉐이핑 기능이 가능해집니다.

In modern cloud-native environments, Layer 4 load balancing is often used for efficient traffic distribution at the entry point, while Layer 7 load balancing is commonly used for application-aware routing through components such as NGINX Ingress or service meshes. <br> 현대의 클라우드 네이티브 아키텍처 환경에서는 진입점에서의 대규모 트래픽 고속 유입 및 분배를 위해 L4 로드 밸런싱을 전면에 세우고, 뒷단에서 NGINX Ingress나 Istio 서비스 메시와 같은 컴포넌트를 결합해 L7 애플리케이션 인지형 라우팅을 처리하는 패턴이 주로 사용됩니다.

---

# Korean Summary

L4는 Transport Layer에서 동작합니다. <br> L4 로드 밸런서는 전송 계층에서 실행됩니다.

기준: <br> 라우팅 조건:
- IP 주소 (IP)
- 포트 번호 (Port)

만 보고 트래픽을 전달합니다. <br> 위의 데이터만 읽고 뒷단의 백엔드 서버로 즉시 패킷을 토스합니다.

HTTP 내용을 보지 않습니다. <br> 헤더 내용이나 URL 등을 전혀 이해하지 못하며 단순히 패킷 포워딩을 수행합니다.

---

L7은 Application Layer에서 동작합니다. <br> L7 로드 밸런서는 애플리케이션 계층에서 실행됩니다.

기준: <br> 라우팅 조건:
- URL 경로 (URL Path)
- HTTP 헤더 (Header)
- 쿠키 값 (Cookie)
- 호스트명 (Hostname)

을 보고 트래픽을 전달합니다. <br> 사용자 요청의 내용물을 파악하고 특정 서비스로 분기 처리합니다.

---

예시 <br> 실제 핑거프린트 예시:

L4:
```text
Client -> 10.0.0.10:443 (L4 LB) -> Backend A (10.0.0.21:443) or Backend B (10.0.0.22:443)
```
단순 IP/Port 매핑 전달.

L7:
```text
Client -> https://api.company.com (L7 LB) 
          ├── /api/*    -> Backend Service A
          └── /images/* -> Backend Service B
```
세부 URL 경로 기준 라우팅 분기 실행.

---

# OSI Layer Perspective

## Layer 4

Transport Layer (전송 계층) <br> OSI 7계층 중 4계층인 전송 계층입니다.

Protocols: <br> 적용 프로토콜:
- TCP
- UDP

---

## Layer 7

Application Layer (애플리케이션 계층) <br> OSI 7계층 중 최상위인 7계층 애플리케이션 계층입니다.

Protocols: <br> 적용 프로토콜:
- HTTP
- HTTPS
- gRPC
- FTP

---

# L4 Load Balancer

## Routing Decision

Based On: <br> 결정 기준:
- Source IP / Port <br> - 출발지 IP / 포트
- Destination IP / Port <br> - 목적지 IP / 포트
- IP Protocol (TCP/UDP) <br> - 전송 프로토콜

---

## Advantages

- High performance: Forward packets without establishing separate TCP handshake loops per connection backend. <br> - 극도의 초고성능: 백엔드 서버와 세션을 분리해 맺지 않고 빠르게 패킷 레벨 포워딩(NAT/DSR)을 수행합니다.
- Low latency: No payload rendering or parsing delay. <br> - 초저지연: 페이로드 데이터 분석 지연이 없어 1ms 이하의 처리 속도를 보장합니다.
- Simpler processing, lower memory usage. <br> - 가볍고 단순한 아키텍처: 패킷 파싱이 필요 없고 CPU/메모리 부하가 극히 적습니다.

---

## Limitations

Cannot inspect: <br> 아래의 데이터 식별 불가능:
- URL path <br> - URL 주소 경로
- Host Header <br> - 호스트 헤더
- HTTP Cookies <br> - 세션 쿠키

---

## Examples

- AWS NLB (Network Load Balancer)
- Azure Load Balancer
- MetalLB (K8s L4 Load Balancer)
- LVS (Linux Virtual Server)

---

# L7 Load Balancer

## Routing Decision

Based On: <br> 결정 기준:
- URL Path <br> - URL 경로명
- Host Header <br> - 호스트 헤더 도메인
- Cookie / Session ID <br> - 세션 상태 데이터
- HTTP Method & Headers <br> - HTTP 요청 상세 파라미터

---

## Advantages

- Smart routing: Path-based or Domain-based routing. <br> - 스마트 지능형 라우팅: 도메인, URL 경로별 다른 서비스 Pod로 분기 가능.
- Traffic shaping & Deployments: Easy canary, A/B testing, and Blue/Green routing. <br> - 유연한 배포 제어: 트래픽 가중치를 활용해 카나리 배포, A/B 테스팅 손쉽게 구현.
- SSL/TLS Termination: Terminate HTTPS sessions at LB, easing backend CPU loads. <br> - SSL 인증서 종단: 인증서 복호화 과정을 로드 밸런서에서 처리하여 백엔드 연산 부담 제거.
- Security parsing: Web Application Firewall (WAF) filtering. <br> - 보안 레이어 추가: SQL injection이나 악성 HTTP 헤더 필터링 기능 탑재.

---

## Limitations

- More CPU usage: Heavy overhead of parsing high-level protocols. <br> - 높은 자원 점유: 패킷 데이터 복호화 및 L7 레이어 재조립 연산으로 CPU 소모량이 높습니다.
- More latency: RTT overhead from establishing two distinct TCP handshakes (Client-to-LB, LB-to-Backend). <br> - 지연 시간 소폭 증가: 클라이언트와의 세션과 백엔드와의 세션을 별도 관리하여 RTT가 다소 증가합니다.

---

## Examples

- NGINX Ingress Controller
- Envoy Proxy
- Istio Ingress Gateway
- AWS ALB (Application Load Balancer)
- HAProxy

---

# Real Kubernetes Example

Request 1: <br> 요청 1:
```text
https://api.company.com/users
```
↓
Ingress (L7 Load Balancer)
↓
Service A (User Service)

---

Request 2: <br> 요청 2:
```text
https://api.company.com/orders
```
↓
Ingress (L7 Load Balancer)
↓
Service B (Order Service)

This is L7 routing. <br> 이것이 전형적인 경로 기준(Path-based) L7 라우팅의 동작 흐름입니다.

---

# Common Interview Follow-up

### Q1

Which layer does NGINX Ingress operate on? <br> NGINX Ingress Controller는 OSI 모델 중 어느 계층에서 작동합니까?

Expected Answer
Primarily Layer 7. It decrypts TLS certificates and reads HTTP Request paths to route to corresponding K8s Cluster Services. <br> 주로 Layer 7(애플리케이션 계층)에서 동작합니다. TLS 복호화를 수행하고 HTTP 요청 주소를 식별하여 클러스터 내부의 알맞은 서비스로 연동합니다.

---

### Q2

Can Layer 4 inspect URLs? <br> Layer 4 로드 밸런서가 URL 경로 주소를 해석할 수 있나요?

Expected Answer
No. Layer 4 operates at the transport layer and has no knowledge of application layer payloads. It only forwards packets based on TCP/IP headers. <br> 아니요, 불가능합니다. L4는 L4 이하 헤더 정보만 읽기 때문에 HTTP와 같은 최상위 애플리케이션 페이로드 본문을 해독하거나 분석할 능력이 없습니다.

---

### Q3

Why is Layer 4 usually faster? <br> Layer 4 로드 밸런싱이 대게 더 빠른 근본적 이유는 무엇인가요?

Expected Answer
It acts as a packet forwarder. It does not look at the HTTP header, content, or cookies, nor does it perform SSL/TLS handshakes or decrypt user data payload. <br> 단순 패킷 전달자(Forwarder) 역할을 하기 때문입니다. HTTP 헤더 해독, 데이터 복호화, 쿠키 대조 등의 연산 처리를 완전히 건너뛰므로 훨씬 빠른 처리가 가능합니다.

---

### Q4

Which load balancer would you use for Kubernetes Ingress? <br> 쿠버네티스 인그레스 인프라의 최종 라우팅을 위해 어떤 형태의 로드 밸런서를 설정해야 하나요?

Expected Answer
We use a Layer 7 Load Balancer (like NGINX Ingress, AWS ALB, or Istio Gateway) to route HTTP requests dynamically based on hostname headers or URL paths. <br> Layer 7 로드 밸런서(NGINX Ingress, AWS ALB, Istio Gateway 등)를 채택합니다. 그래야 호스트 이름 도메인이나 세부 URL 경로별 동적 분기가 가능합니다.

---

### Q5

Can Layer 7 perform SSL termination? <br> Layer 7 로드 밸런서에서 SSL/TLS 종단(SSL Termination) 처리를 할 수 있습니까?

Expected Answer
Yes. L7 load balancers decrypt incoming HTTPS requests at the proxy level. They can then forward the decrypted HTTP traffic to the backend, relieving backends of SSL decryption CPU overhead. <br> 네, 가능합니다. 프록시 레벨에서 HTTPS 요청을 복호화하여 일반 HTTP 트래픽으로 안전한 백엔드 망 내의 서버들에 패킷을 전달하므로 백엔드 서버의 CPU 복호화 오버헤드를 극적으로 줄여줍니다.

---

# Common Production Scenarios

## Scenario 1: Typical Enterprise Setup <br> 일반적인 기업형 연계 구성 방식

Public Traffic <br> 외부 대외 유입 트래픽
↓
L4 Load Balancer (AWS NLB - High performance IP forwarding) <br> L4 로드 밸런서 (초고속 IP 포워딩 진입점 확보)
↓
NGINX Ingress (L7 Ingress Controller - SSL decrypt & Path routing) <br> NGINX 인그레스 (L7 제어 - 인증서 해제 및 도메인 분기)
↓
Application Pods <br> 백엔드 컨테이너 애플리케이션들

---

## Scenario 2: Canary / A-B Deployment <br> 카나리 및 A/B 테스트 배포 환경

Canary Deployment <br> 카나리 트래픽 라우팅
↓
L7 Routing Engine <br> L7 라우팅 가중치 연산
├── 90% Traffic -> Version A (Current Production Pods) <br> ├── 90% 트래픽 -> 현재 프로덕션 버전 A Pod
└── 10% Traffic -> Version B (New Release Canary Pods) <br> └── 10% 트래픽 -> 신규 버전 B 카나리 Pod

---

# ByteDance Follow-up Possibility

Very High <br> 바이트댄스 면접 꼬리 질문 출제 확률 100%

Typical Flow: <br> 예상 심화 질문 흐름:
L4 vs L7 fundamentals <br> L4/L7 기본 메커니즘 차이 분석
↓
Ingress Controller routing mechanics <br> 쿠버네티스 Ingress Controller 내부 패킷 프록시 원리
↓
NGINX connection buffering & proxy pass tuning <br> NGINX 역프록시(Proxy Pass) 버퍼링 및 커넥션 풀 튜닝
↓
Service Mesh sidecar performance overhead (Envoy) <br> 서비스 메시 사이드카 프록시(Envoy) 도입 시 RTT 지연 오버헤드 측정
↓
Kubernetes CNI (eBPF, Cilium) L4 bypass techniques <br> 쿠버네티스 CNI(Cilium, eBPF)를 통한 L4 프록시 우회 및 고속 포워딩 신기술

---

# Personal Notes

Strong Interview Message: <br> 면접에서 어필할 강력한 핵심 메시지:
L4 focuses on efficient connection forwarding. L7 focuses on intelligent application-aware routing. <br> "L4는 연결 자체를 빠르게 백엔드로 토스하여 중계하는 데 집중하고, L7은 사용자 패킷의 명세와 비즈니스 목적지를 정밀 분석하여 스마트하게 분기하는 데 집중합니다."

---

Strong Interview Quote: <br> 가장 직관적이고 기억에 남을 모범 답변 문구:
"Layer 4 distributes connections. Layer 7 distributes requests." <br> "L4는 TCP 커넥션을 분산하고, L7은 개별 HTTP 요청을 분산합니다."

This is concise and memorable. <br> 이는 핵심을 가장 짧고 강력하게 요약하여 실무 지식의 깊이를 명쾌하게 전달합니다.

---

# Related Topics

- [network-q01-tcp-handshake.md](file:///Users/yg/workspace/tictok/docs/networking/network-q01-tcp-handshake.md)
- [network-q02-dns-resolution.md](file:///Users/yg/workspace/tictok/docs/networking/network-q02-dns-resolution.md)
- [network-q03-high-latency.md](file:///Users/yg/workspace/tictok/docs/networking/network-q03-high-latency.md)
- [k8s-q01-ingress.md](file:///Users/yg/workspace/tictok/docs/kubernetes/k8s-q01-ingress.md)
- [k8s-q02-service-networking.md](file:///Users/yg/workspace/tictok/docs/kubernetes/k8s-q02-service-networking.md)

---

## Status

Studying
