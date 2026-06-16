# Metadata

Category: Kubernetes

Subcategory: Node Troubleshooting

Difficulty: Medium-Hard

Importance: ★★★★★

Frequency: ★★★★★

Related Topics:

- Kubelet
- Container Runtime
- CNI
- Node Pressure
- Scheduling
- Cluster Operations

Interview Rounds:

- Technical Screen
- Hiring Manager
- Onsite

Tags:

kubernetes, node, notready, kubelet, troubleshooting

---

# k8s-q01-node-notready.md

# Kubernetes Interview Question 01

## A Kubernetes Node Suddenly Becomes NotReady <br> 쿠버네티스 노드가 갑자기 NotReady 상태로 빠지는 장애 진단 및 대응

### Difficulty

Medium-Hard

### Importance

★★★★★

### Frequency

★★★★★

---

# Quick Recall

Node NotReady <br> 노드 NotReady 상태 진입
↓
Scope <br> 장애 범위 판별
Single Node? <br> - 단일 노드 국한 장애인가?
Multiple Nodes? <br> - 복수 노드 동시 장애인가?
Entire AZ? <br> - 가용영역(AZ) 전체의 장애인가?
↓
Check Node Conditions <br> 1단계: 노드 세부 조건(Conditions) 검사
↓
Check Kubelet <br> 2단계: Kubelet 프로세스/로그 진단
↓
Check Runtime <br> 3단계: 컨테이너 런타임(containerd) 상태 점검
↓
Check Resources <br> 4단계: 시스템 자원(디스크/메모리/PID) 고갈 여부 점검
↓
Check Network <br> 5단계: CNI 및 API 서버 통신 상태 검사
↓
Recent Changes <br> 6단계: 최근 변경(OS 패치, K8s 업그레이드 등) 이력 조회

---

# Interview Question

A Kubernetes node suddenly becomes NotReady. <br> 특정 쿠버네티스 노드가 갑자기 NotReady 상태로 변경되었습니다.
How would you investigate and resolve the issue? <br> 이 현상을 어떻게 조사하고 해결하겠습니까?

---

# Interviewer's Intent

The interviewer wants to evaluate: <br> 면접관은 다음 사항을 검증하고자 합니다:

- Kubernetes operations experience: Understanding of node health reporting and control plane synchronization. <br> - 쿠버네티스 실무 운영 경력: 노드 헬스체크 보고 구조와 제어부 동기화 메커니즘 이해도.
- Troubleshooting methodology: Systematic diagnostics rather than random guesses. <br> - 문제 해결 프레임워크: 임의의 대응이 아닌 체계적이고 구조화된 진단 접근법.
- Production thinking: Awareness of blast radius and workload impacts. <br> - 프로덕션 운영 사고방식: 장애 전파 범위(Blast Radius) 파악 및 파드 재일정 예약(Rescheduling)의 영향도 고려.
- Understanding of node components: Deep knowledge of Kubelet, runtime, OS resources, and CNI. <br> - 노드 컴포넌트 간 상호작용 이해: Kubelet, 컨테이너 런타임, OS 커널 자원, CNI 네트워킹 스택에 대한 깊은 지식.
- Ability to isolate failures: Differentiating cloud/hardware faults from software bugs. <br> - 실패 원인 격리 능력: 클라우드/하드웨어 장애와 소프트웨어적 장애의 차이를 분별하는 능력.

This is often used to determine whether someone understands how Kubernetes monitors node health in real production environments. <br> 이 질문은 지원자가 실제 프로덕션 환경에서 쿠버네티스가 노드의 헬스케어를 어떻게 모니터링하고 예외 상황을 처리하는지 알고 있는지 파악하기 위한 것입니다.

---

# Recommended Answer (English)

When a node becomes NotReady, my first objective is to understand the scope of the issue. <br> 노드가 NotReady 상태로 전환되면, 제 첫 번째 목표는 장애가 발생한 영향 범위를 파악하는 것입니다.

I determine whether the problem affects a single node, multiple nodes, or an entire availability zone. <br> 이 문제가 단일 노드에 국한된 것인지, 여러 노드에서 일어나는지, 혹은 가용 영역(AZ) 전체의 문제인지 분별합니다.

Next, I review the node conditions using Kubernetes APIs and check whether the issue is related to memory pressure, disk pressure, PID exhaustion, or network availability. <br> 그다음, Kubernetes API를 통해 노드 조건(Conditions) 상태를 조회하여 메모리 부족, 디스크 고갈, PID 임계치 초과, 또는 네트워크 단절 상태인지 식별합니다.

I then investigate the node itself. <br> 그 후, 노드 내부에 접속하여 문제 요인을 직접 조사합니다.

I verify the kubelet service, container runtime, network connectivity, and resource utilization. <br> Kubelet 서비스 데몬, 컨테이너 런타임(containerd), 네트워크 소켓 상태, 시스템 자원 사용률을 면밀히 검증합니다.

If the node recently received an operating system update, Kubernetes upgrade, or configuration change, I review those changes as potential causes. <br> 최근에 노드 운영체제 업데이트, 쿠버네티스 패치, 혹은 구성 변경 사항이 있었다면 이를 유력한 장애 원인 후보로 삼고 검토합니다.

My goal is to identify whether the issue originates from Kubernetes, the operating system, networking, or the underlying infrastructure. <br> 저의 최종 목적은 이 원인이 쿠버네티스 제어부 문제인지, 게스트 OS 레벨의 버그인지, 네트워킹 문제인지, 혹은 물리 인프라 계층의 손상인지를 명확히 격리하는 것입니다.

---

# Korean Summary

Node NotReady는 증상이다. <br> 노드 NotReady 상태는 장애 결과로 나타나는 최종 증상일 뿐입니다.

먼저 범위를 확인한다. <br> 가장 먼저 장애 범위(Blast Radius)를 판단해야 합니다.

- 한 대만 문제인가? <br> - 단일 노드 한 대만 오프라인인가? (노드 하드웨어/OS 장애 의심)
- 여러 대인가? <br> - 여러 대가 동시에 장애인가? (CNI 설정, 네트워크 스위치, 스토리지 백엔드 문제 의심)
- AZ 전체인가? <br> - 가용영역 전체가 통신 불가인가? (클라우드 인프라 아웃티지 의심)

그 다음 아래의 계층 구조로 점검한다: <br> 영향 범위가 파악되면 다음 순서대로 추적합니다:

1. Node Condition <br> 1단계: API 서버로 조회되는 `kubectl describe node` 조건 분석
2. Kubelet <br> 2단계: Kubelet 프로세스 구동 여부와 시스템 로그(journalctl) 분석
3. Container Runtime <br> 3단계: containerd 데몬 상태 및 OOM 킬러 피습 여부 조사
4. Resource <br> 4단계: CPU 부하, 실 메모리 고갈, 루트 파일시스템/overlayfs 잔여량 점검
5. Network <br> 5단계: CNI 가동 상태, DNS 확인 및 API 서버 통신 포트 상태 조사
6. 최근 변경사항 <br> 6단계: 인프라 패치, 노드 프로비저닝 이력 등 최근 변경 사항 대조

---

# Investigation Flow

Node NotReady <br> 노드 NotReady 발생
↓
Check Scope <br> 영향 범위 파악
↓
Check Conditions <br> 노드 조건 필드 확인
↓
Check Kubelet <br> Kubelet 데몬 동작 검증
↓
Check Container Runtime <br> 컨테이너 런타임 상태 확인
↓
Check Resource Pressure <br> 호스트 자원 고갈 여부 실측
↓
Check Networking <br> CNI 인터페이스 및 네트워크 통신 확인
↓
Review Recent Changes <br> 최근의 인프라/OS 변경사항 대조
↓
Identify Root Cause <br> 장애의 근본 원인 도출 및 조치

---

# Step 1

Determine Scope <br> 1단계: 장애 범위(Blast Radius) 산정

```bash id="j4x5mw"
kubectl get nodes
```

Questions <br> 질문 및 판단 기준:

- One node? <br> - 단 한 개의 노드만 문제인가? (노드 개별 장애: 디스크 풀, 하드웨어 불량, 커널 패닉)
- Multiple nodes? <br> - 동일 서브넷 내 여러 노드가 함께 빠졌는가? (네트워크 스위치 장애, CNI 컨트롤 플레인 장애)
- Entire cluster? <br> - 클러스터 전체 노드가 통신 단절인가? (컨트롤 플레인/API 서버 자체의 아웃티지)

---

# Step 2

Inspect Node Conditions <br> 2단계: 노드 조건(Conditions) 필드 분석

```bash id="g67xw0"
kubectl describe node <node-name>
```

Look For <br> 주요 핵심 조건부 검사 필드:

- Ready: `False` or `Unknown` (Kubelet과 API 서버 간 통신이 유효 시간 내 없었음)
- MemoryPressure: `True` (시스템 메모리가 임계값 아래로 내려가 자원 압박)
- DiskPressure: `True` (루트 파일시스템 또는 컨테이너 데이터 파티션 용량 포화)
- PIDPressure: `True` (프로세스 ID 한계 도달로 새로운 스레드/프로세스 생성 불가)
- NetworkUnavailable: `True` (CNI 플러그인이 정상 구성되지 않아 라우팅이 불가능함)

---

# Step 3

Verify Kubelet <br> 3단계: Kubelet 프로세스 상태 확인

```bash id="q12yq7"
systemctl status kubelet
journalctl -u kubelet -n 100 -f
```

Check <br> 주요 점검 사항:

- Running? <br> - 프로세스가 활성화 상태로 잘 작동하는가?
- Restart Loop? <br> - 설정 오류나 플래그 버그로 인해 무한 재시작 루프에 돌입했는가?
- Certificate Issues? <br> - Kubelet 클라이언트 인증서가 만료되어 API 서버 승인(TLS Bootstrap)을 통과하지 못하는가?

---

# Step 4

Verify Container Runtime <br> 4단계: 컨테이너 런타임 데몬 분석

Modern Kubernetes <br> 최신 쿠버네티스 런타임 점검 명령:

```bash id="5w2jml"
systemctl status containerd
journalctl -u containerd -n 100 --no-pager
```

Common Problems <br> 흔히 발생하는 런타임 관련 결함:

- Runtime Crash: OOM 킬러에 의해 `containerd` 프로세스가 강제 종료된 경우
- Disk Full: 컨테이너 로그 및 캐시 누적으로 이미지 저장 영역이 100% 포화된 경우
- Image Corruption: 비정상적 다운로드 등으로 인해 런타임 내부의 레이어가 손상된 경우

---

# Step 5

Check Resources <br> 5단계: 물리/게스트 호스트 자원 고갈 현황 파악

CPU <br> CPU 코어 부하 및 로드 애버리지 파악:

```bash id="7a9lpt"
top -b -n 1 | head -n 20
```

Memory <br> 여유 메모리 크기 검증:

```bash id="qzq0bk"
free -h
```

Disk <br> 루트 및 컨테이너 볼륨 디스크 용량 확인:

```bash id="9z8k7l"
df -h
```

---

# Step 6

Check Network <br> 6단계: 네트워크 링크 및 CNI 통신 진단

Verify <br> 확인해야 할 핵심 자원:

- CNI: CNI 파드가 로컬 노드 상에서 구동되어 인터페이스(veth, cali*)를 생성했는지 여부
- Routing: 노드 라우팅 테이블이 파괴되지 않고 유효하게 존재하는지 여부
- DNS: CoreDNS 서비스로 향하는 이름 분석 경로가 올바른지 여부
- API Server Connectivity: 노드가 API 서버의 6443 포트로 통신 연결을 유지할 수 있는지 여부

Examples <br> 네트워크 점검 명령어 예시:

```bash id="nzhm1l"
ping -c 3 <api-server-ip>
curl -k https://<api-server-ip>:6443/healthz
ip route show
```

---

# Common Root Causes

## Kubelet Failure <br> Kubelet 자체 오작동

Symptoms <br> 유발 증상:

- Node unreachable: API 서버가 노드 상태를 수집하지 못함
- Ready condition false: 노드가 강제로 `Ready=Unknown` 또는 `NotReady` 상태로 천명됨

---

## Container Runtime Failure <br> 컨테이너 런타임 장애

Symptoms <br> 유발 증상:

- Pods cannot start: 신규 파드 예약 배치가 불가능함
- Runtime unavailable: CRI API 응답이 차단되고 CRI 서비스 헬스체크 통과 실패

---

## Disk Full <br> 루트/스토리지 디스크 포화

Symptoms <br> 유발 증상:

- Image pull failures: 이미지를 다운로드할 임시 영역이 부족하여 오동작
- Runtime failures: Kubelet이 노드에 축출(Eviction) 상태를 선언하며 파드들을 쫓아냄

---

## Memory Pressure <br> 호스트 물리 메모리 고갈

Symptoms <br> 유발 증상:

- OOM events: 리눅스 커널 OOM 킬러가 Kubelet 또는 containerd 등의 데몬을 사살함
- Evictions: 시스템 메모리 임계 여유가 바닥나 노드 안정을 위해 기존 파드들을 축출함

---

## Network Issues <br> 네트워크 라우팅 및 통신 단절

Symptoms <br> 유발 증상:

- API server unreachable: 심장박동(Heartbeat) 신호가 컨트롤 플레인에 전달되지 못함
- Node heartbeat failures: CNI 포트 단절로 로컬 컨테이너 네트워크 통신 차단

---

# Common Interview Follow-up

### Q1

What component marks a node as NotReady? <br> 어떤 컴포넌트가 노드를 NotReady 상태로 최종 표시하고 전파합니까?

Expected Answer <br> 모범 답안:

Kubelet reports node status to the API server. <br> 기본적으로 각 노드의 Kubelet 데몬이 주기적으로 자신의 상태를 수집해 API 서버에 리포트합니다. 만약 지정된 시간(기본 40초) 동안 Kubelet으로부터 상태 업데이트가 오지 않으면, 컨트롤 플레인의 `node-controller`가 해당 노드의 Ready 상태 조건을 `Unknown` 또는 `NotReady`로 변경합니다.

---

### Q2

Can a node become NotReady even if the server is running? <br> 물리 호스트 서버 자체는 멀쩡히 켜져 있는데도 노드가 NotReady 상태로 빠질 수 있나요?

Expected Answer <br> 모범 답안:

Yes. <br> 예, 충분히 발생합니다. Kubelet 데몬 프로세스만 크래시로 중단되었거나, Kubelet이 사용하는 인증서가 만료된 경우, 혹은 노드와 컨트롤 플레인 사이의 네트워크 방화벽 포트(6443) 통신이 차단된 경우, 호스트 서버가 켜져 있어도 쿠버네티스 제어부에서는 NotReady 상태로 인식하게 됩니다.

---

### Q3

What is Node Heartbeat? <br> 쿠버네티스의 노드 하트비트(Heartbeat) 메커니즘은 무엇인가요?

Expected Answer <br> 모범 답안:

Regular health updates sent by kubelet to the control plane. <br> 노드가 정상 가동 중임을 증명하기 위해 Kubelet이 제어부로 보내는 상태 메세지입니다. 현대 K8s에서는 각 노드 네임스페이스 밑에 `Lease` 객체를 생성하여, 노드의 무거운 상태 오브젝트(Node Status)를 매번 업데이트하는 대신 Lease 임대 자원을 갱신하는 방식을 채택해 API 서버의 부하를 최소화합니다.

---

### Q4

What happens to workloads when a node becomes NotReady? <br> 특정 노드가 NotReady가 되면 그 위에서 돌고 있던 비즈니스 워크로드(파드)들은 어떻게 처리되나요?

Expected Answer <br> 모범 답안:

Pods may eventually be rescheduled to healthy nodes depending on workload configuration. <br> 노드가 NotReady/Unknown으로 진입하면, 파드들은 즉시 종료되지 않고 `pod-eviction-timeout`(기본 5분) 동안 유예 기간을 가집니다. 이 타임아웃을 초과하면 해당 노드의 파드들은 API 상에서 삭제 예약 상태로 전환되고, 디플로이먼트나 레플리카셋 제어기에 의해 다른 건강한 노드 위로 재생성(Rescheduled) 및 배포됩니다.

---

### Q5

Would you immediately reboot the node? <br> 노드에 장애가 났을 때 즉각적인 해결을 위해 서버 리부팅을 최우선 순위로 진행하겠습니까?

Expected Answer <br> 모범 답안:

No. <br> 아니요, 프로덕션 환경에서 즉각적인 리부팅은 최후의 보루입니다. 리부팅을 해 버리면 커널 버그 메시지(dmesg), 컨테이너 로그 및 시스템 메모리 덤프 등 장애의 원인을 담고 있는 휘발성 분석 정보가 완전히 증발합니다. 우선 장애 영향도를 억제하기 위해 노드를 `kubectl cordon`하여 스케줄링 대상을 제외하고, Kubelet 로그 및 시스템 메트릭을 확보한 뒤에 대응 가이드를 도출해야 합니다.

---

# Real Production Example

In production AKS and EKS environments, my first action is always to determine the blast radius. <br> 실제 프로덕션 AKS나 EKS 환경을 운영할 때, 제 최초 행동은 언제나 장애 영향 범위(Blast Radius)를 식별하는 것입니다.

A single unhealthy node is very different from a cluster-wide issue. <br> 단일 노드가 오프라인으로 떨어진 현상과 클러스터 전반에 걸친 대량 탈락 사고는 접근 방식 자체가 근본적으로 다릅니다.

Once the scope is clear, I investigate node conditions, kubelet health, container runtime status, and infrastructure changes before taking corrective action. <br> 범위가 고립되면, 성급한 조치에 앞서 노드 세부 조건부 메세지 분석, Kubelet 서비스 생사 확인, CRI(Containerd) 데몬 상태, 그리고 클라우드 측 인프라 및 네트워크 인프라 변경 건을 교차 대조하여 장애 원인을 안전하게 제거합니다.

This approach helps avoid unnecessary disruption and speeds up root cause identification. <br> 이러한 체계적 격리 프로세스는 조급함에 의한 2차 장애 전파를 방지하고 최단 시간에 올바른 근본 원인(RCA)을 규명하는 가장 효율적인 길입니다.

---

# AKS / EKS Experience Angle

Strong Interview Message <br> 시니어 면접용 주효 핵심 관점:

In managed Kubernetes environments such as AKS and EKS, Kubernetes itself is only one layer. <br> "Managed Kubernetes 환경(EKS/AKS)에서 쿠버네티스는 전체 클라우드 소프트웨어 스택의 한 레이어일 뿐입니다."

A NotReady node can originate from: <br> 노드 NotReady 현상은 단순 가동 상태 보고 차단을 넘어 아래의 다각적 원인 레이어에서 기인합니다:

- Kubernetes: Certificate expiry, API Server request rate limiting, configuration errors. <br> - 쿠버네티스 영역: 클라이언트 인증서 만료, API 서버 통신 포화로 인한 Rate Limit 제한 등.
- Operating System: Linux Kernel panic, OOM killer, disk full. <br> - 운영체제 영역: 호스트 리눅스 커널 패닉, 메모리 누수로 인한 OOM 사태, 디스크 영역 포화 등.
- Container Runtime: containerd service crash. <br> - 컨테이너 런타임 영역: containerd 데몬 중단 및 CRI 응답 무응답 정체.
- Cloud Infrastructure: Underlying hypervisor node migration, VM disk read-only lock. <br> - 클라우드 물리 인프라 영역: 물리 호스트 머신 결함으로 인한 마이그레이션 실패, 스토리지 볼륨 읽기 전용 락 잠금 등.
- Networking: Security Group config changes, VPC CIDR table errors. <br> - 네트워킹 인프라 영역: 보안 그룹 규칙 임의 변경, VPC 서브넷 라우팅 오설정으로 인한 내부 통신 마비.

Therefore I always investigate from the infrastructure layer upward. <br> "따라서 물리 클라우드 스토리지/네트워크 기본 기초 체력 테스트부터 시작하여 논리적 가상 환경 레벨까지 역추적하는 체계가 필수입니다."

---

# ByteDance Follow-up Possibility

Very High <br> 면접 시 꼬리 질문 전개 확률: 매우 높음

Typical Flow <br> 시니어 인프라 면접관의 예상 질문 전개 패턴:

Node NotReady <br> 노드가 갑자기 NotReady에 직면함
↓
Pod Scheduling <br> 해당 노드의 파드들은 어떻게 격리되나요? (cordon vs drain 차이)
↓
Node Drain <br> 노드를 완전 배제할 때 데이터베이스 같은 StatefulSet 파드는 안정적으로 이주 가능한가요?
↓
Cluster Upgrade <br> 대규모 클러스터 롤링 업그레이드 시 이 프로세스는 어떻게 안전하게 통합 제어되나요?
↓
CNI Troubleshooting <br> 파드 간 통신 불능 상태인 CNI 패킷 유실 장애 진단법은?
↓
Kubernetes Networking <br> iptables와 IPVS 모드의 패킷 라우팅 오버헤드 실무 비교 경험은?
↓
Production Operations <br> 대규모 실무 트래픽 환경에서의 무중단 K8s 클러스터 자원 회수 효율화 실무 사례는?

---

# Personal Notes

Strong Interview Message <br> 면접에서 어필할 인프라적 깊이감:

As AI systems scale, communication becomes just as important as computation. <br> "노드의 비정상 상태를 인지하는 것은 시스템의 시작일 뿐이며, 분산 처리 환경에서 각 인프라 컴포넌트의 결합도를 명확히 파악하고 있어야 올바른 디버깅이 가능합니다."

---

Strong Interview Quote <br> 핵심 클로징 답변 인용 문구:

"A NotReady node is not a root cause. It is simply Kubernetes telling us that something underneath requires investigation." <br> "노드가 NotReady 상태로 빠진 것은 장애의 결과 보고서일 뿐입니다. 우리에게 필요한 행동은 당황하여 서버를 재시작하는 것이 아니라, Kubelet 하트비트가 차단된 근본 원인이 OS, 런타임, 네트워크, 혹은 자원 압박 중 어디에 속해 있는지를 냉정히 점검하고 도출해내는 것입니다."

---

# Related Topics

- [k8s-q02-pod-crashloopbackoff.md](file:///Users/yg/workspace/tictok/docs/kubernetes/k8s-q02-pod-crashloopbackoff.md)
- [k8s-q03-imagepullbackoff.md](file:///Users/yg/workspace/tictok/docs/kubernetes/k8s-q03-imagepullbackoff.md)
- [k8s-q04-cni-network-troubleshooting.md](file:///Users/yg/workspace/tictok/docs/kubernetes/k8s-q04-cni-network-troubleshooting.md)
- [linux-q01-server-slow.md](file:///Users/yg/workspace/tictok/docs/linux/linux-q01-server-slow.md)
- [network-q05-packet-loss.md](file:///Users/yg/workspace/tictok/docs/networking/network-q05-packet-loss.md)

---

## Status

Studying
