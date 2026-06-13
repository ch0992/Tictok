# Linux Interview Question 01

## Linux Server Suddenly Becomes Slow

### Difficulty

Medium

### Importance

★★★★★

### Frequency

★★★★★

---

## Interview Question

A Linux server suddenly becomes slow.

Users report increased response times and poor performance.

Walk me through your troubleshooting process.

---

## Interviewer's Intent

The interviewer wants to evaluate:<br>면접관은 다음 사항을 평가하고자 합니다:

- Troubleshooting methodology<br>장애 해결 방법론 및 절차
- Linux fundamentals<br>Linux 시스템 기본 지식 및 커널 메트릭
- Systems thinking<br>전체 시스템 및 의존성 관계적 사고방식
- Prioritization<br>우선순위 설정 및 대응 신속성
- Incident response approach<br>체계적인 장애 대응 방식
- Communication skills<br>기술적 커뮤니케이션 및 상황 공유 능력

The interviewer is NOT looking for a specific command.<br>면접관은 특정 명령어를 외우고 있는지를 보려는 것이 아닙니다.

The interviewer wants to understand how you think.<br>면접관은 당신이 어떻게 생각하고 문제를 해결하는지 과정을 이해하고 싶어 합니다.

---

## Recommended Answer (English)

When a Linux server suddenly becomes slow, I try to avoid making assumptions and follow a structured troubleshooting process.

First, I would determine whether the issue affects the entire system or only a specific application.

My first step is usually to collect high-level system metrics.

I would check:

- CPU utilization
- Memory usage
- Load average
- Disk utilization
- Network activity

using tools such as top, htop, free, vmstat, iostat, and sar.

Next, I would identify the primary bottleneck.

For example:

- High CPU usage
- Memory pressure
- Disk I/O saturation
- Network congestion
- Process-level issues

Once I identify the bottleneck, I would drill down further.

If CPU usage is high, I would investigate which processes are consuming resources.

If memory usage is high, I would look for memory leaks or excessive caching.

If disk latency is elevated, I would analyze I/O patterns and storage performance.

I would also review recent changes, including deployments, configuration changes, system updates, or infrastructure modifications.

Finally, I would correlate system metrics, application logs, and recent events to identify the root cause and implement corrective actions.

My goal is to use data to narrow the problem space rather than making assumptions too early.

---

## Korean Summary

Linux 서버가 갑자기 느려지면 가장 먼저 가설을 세우기보다 데이터부터 수집합니다.

우선 전체 시스템 문제인지 특정 애플리케이션 문제인지 확인합니다.

다음 항목을 확인합니다.

- CPU
- Memory
- Load Average
- Disk I/O
- Network

이를 통해 병목 지점을 찾습니다.

이후 병목이 확인되면 해당 영역을 깊게 분석합니다.

예를 들어:

CPU 문제

→ 프로세스 분석

Memory 문제

→ Memory Leak<br>애플리케이션이 메모리 사용 후 시스템에 반환하지 않는 메모리 누수 현상 확인

Disk 문제

→ I/O Latency 확인

Network 문제

→ 연결 상태 및 트래픽 분석

또한 최근 변경 사항도 반드시 확인합니다.

- 배포
- 설정 변경
- OS 업데이트
- 인프라 변경

최종적으로 시스템 메트릭, 로그, 변경 이력을 종합하여 RCA를 수행합니다.

---

# Investigation Flow

User Complaint

↓

Is it System-wide or Application-specific?

↓

Check CPU

↓

Check Memory

↓

Check Disk I/O

↓

Check Network

↓

Check Recent Changes

↓

Check Logs

↓

Identify Bottleneck

↓

Root Cause Analysis

---

# Key Commands

## CPU

```bash
top
htop
ps aux --sort=-%cpu
```

Purpose<br>목적

Identify CPU-heavy processes.<br>CPU 사용률이 높은 프로세스를 식별합니다.

---

## Memory

```bash
free -h
vmstat
cat /proc/meminfo
```

Purpose<br>목적

Identify memory pressure and swap usage.<br>메모리 압박 상태 및 스왑 사용률을 진단합니다.

---

## Disk

```bash
df -h
du -sh *
iostat -x 1
```

Purpose<br>목적

Identify storage bottlenecks.<br>디스크 스토리지 병목 현상 및 처리 성능을 진단합니다.

---

## Network

```bash
ss -tulpn
netstat -an
sar -n DEV 1
```

Purpose<br>목적

Analyze network utilization and connections.<br>네트워크 사용량 및 소켓 연결 상태를 분석합니다.

---

## Logs

```bash
journalctl -xe
tail -f /var/log/messages
```

Purpose<br>목적

Identify recent errors.<br>최근 발생한 시스템 및 애플리케이션 에러 로그를 확인합니다.

---

# Common Root Causes

## CPU Saturation

Examples<br>예시

- Infinite loop<br>애플리케이션 내 무한 루프 버그
- Runaway process<br>비정상 제어 불능 상태의 프로세스
- High traffic<br>대용량 사용자 트래픽 급증

---

## Memory Pressure

Examples<br>예시

- Memory leak<br>지속적으로 메모리를 점유해 반환하지 않는 누수
- Excessive caching<br>과도한 인메모리 캐싱
- OOM conditions<br>메모리 고갈로 인한 프로세스 종료 위험 상태

---

## Disk I/O Bottleneck

Examples<br>예시

- Storage latency<br>디스크 스토리지의 입출력 지연 속도
- Full disk<br>디스크 스토리지 용량 100% 포화
- Heavy write workload<br>대규모 배치 쓰기 작업

---

## Network Bottleneck

Examples<br>예시

- Packet drops<br>네트워크 패킷 드롭 및 재전송 발생
- Network saturation<br>네트워크 대역폭 한계 도달
- DNS issues<br>DNS 조회 실패 및 지연

---

## Recent Deployment

Examples<br>예시

- Bad release<br>최근 배포된 애플리케이션의 결함
- Configuration mistake<br>잘못 설정된 인프라 및 시스템 설정
- Infrastructure change<br>최근의 네트워크 및 클라우드 인프라 변경

---

# Expected Follow-up Questions

### Q1

CPU usage is 100%.

What would you do next?

---

### Q2

Load Average is high.

What does it mean?

---

### Q3

Memory usage is 95%.

How would you investigate?

---

### Q4

Disk utilization is 100%.

What would you do?

---

### Q5

How do you determine whether the issue is application-related or infrastructure-related?

---

### Q6

What logs would you check first?

---

# Personal Notes

Strong Interview Message<br>면접에서 전달할 강력한 메시지

I do not troubleshoot based on assumptions.<br>저는 지레짐작과 어설픈 가설로 장애를 해결하지 않습니다.

I troubleshoot based on evidence.<br>저는 수집된 메트릭과 증거를 기반으로 분석하고 해결합니다.

---

Strong Quote<br>면접관에게 전할 강렬한 한마디

"My first goal is not to find the root cause immediately. My first goal is to identify the bottleneck and narrow the problem space."<br>"저의 첫 번째 목표는 즉시 근본 원인을 찾는 것이 아닙니다. 진짜 첫 목표는 시스템의 병목 지점을 식별하고 원인 범위를 좁히는 것입니다."

This is a strong SRE-style answer.<br>이는 철저히 데이터에 입각한 정석 SRE 스타일의 답변입니다.

---

# Related Topics

[linux-q02-cpu-100.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q02-cpu-100.md)

[linux-q03-memory-leak.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q03-memory-leak.md)

[linux-q04-disk-full.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q04-disk-full.md)

[linux-q05-process-crash.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q05-process-crash.md)

---

## Status

Studying
