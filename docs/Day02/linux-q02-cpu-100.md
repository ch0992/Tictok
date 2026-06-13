# Linux Interview Question 02

## CPU Utilization is 100%

### Difficulty

Medium

### Importance

★★★★★

### Frequency

★★★★★

---

## Interview Question

CPU utilization on a Linux server suddenly reaches 100%.

How would you investigate and troubleshoot the issue?

---

## Interviewer's Intent

The interviewer wants to evaluate:<br>면접관은 다음 사항을 평가하고자 합니다:

- Linux troubleshooting skills<br>Linux 시스템 장애 대처 역량
- Understanding of CPU metrics<br>CPU 세부 지표(us, sy, wa, st) 분석 능력
- Process investigation methodology<br>프로세스 및 스레드 조사 방법론
- Root Cause Analysis approach<br>근본 원인 분석(RCA) 접근 방식
- Performance troubleshooting experience<br>시스템 성능 최적화 및 디버깅 경험

The interviewer is not looking for a command list.<br>면접관은 명령어 목록을 외우고 있는지를 보려는 것이 아닙니다.

The interviewer wants to understand your investigation process.<br>면접관은 당신의 장애 조사 및 대처 과정을 이해하고 싶어 합니다.

---

## Recommended Answer (English)

The first thing I would do is verify whether the CPU usage is affecting the entire system or a specific application.

I would start by using top or htop to identify which processes are consuming CPU resources.

Once I identify the high-CPU process, I would determine whether the usage is expected or abnormal.

For example:

- Increased traffic
- Batch processing
- Background jobs

could explain high CPU utilization.

If the behavior appears abnormal, I would investigate further by examining process details, application logs, recent deployments, and configuration changes.

I would also look at CPU breakdown metrics such as:

- User CPU
- System CPU
- IOWait
- Steal Time

to better understand where CPU time is being spent.

Finally, I would correlate the findings with application behavior, system logs, and recent changes to determine the root cause and implement corrective actions.

---

## Korean Summary

CPU가 100%가 되었다고 해서 바로 문제라고 판단하지는 않습니다.

먼저 높은 CPU 사용이 정상인지 비정상인지 판단합니다.

첫 단계는 top 또는 htop을 사용하여 어떤 프로세스가 CPU를 사용하는지 확인하는 것입니다.

이후:

- 트래픽 증가
- 배치 작업
- 백그라운드 작업

등 정상적인 원인이 있는지 확인합니다.

비정상적이라면:

- 프로세스 상세 분석
- 애플리케이션 로그
- 최근 배포
- 설정 변경

을 조사합니다.

또한 CPU 세부 지표를 확인합니다.

- User CPU
- System CPU
- IOWait
- Steal Time

이 정보를 기반으로 RCA를 수행합니다.

---

# Investigation Flow

CPU Alert

↓

Confirm CPU Utilization

↓

Identify High CPU Process

↓

Expected or Unexpected?

↓

Analyze Process

↓

Check Logs

↓

Check Recent Changes

↓

Determine Root Cause

↓

Mitigation / Resolution

---

# Key Commands

## Identify CPU Consumers

```bash
top
htop
ps aux --sort=-%cpu | head
```

Purpose<br>목적

Identify which processes consume CPU resources.<br>어떤 프로세스가 CPU 자원을 과점유하고 있는지 식별합니다.

---

## Detailed Process Inspection

```bash
ps -fp <pid>
pstree -p
```

Purpose<br>목적

Inspect process hierarchy and ownership.<br>프로세스의 실행 계층 구조(부모-자식 관계) 및 소유자를 파악합니다.

---

## Thread-Level Analysis

```bash
top -H -p <pid>
```

Purpose<br>목적

Identify specific threads causing CPU spikes.<br>CPU 스파이크를 유발하고 있는 프로세스 내의 세부 스레드를 식별합니다.

---

## CPU Statistics

```bash
mpstat -P ALL 1
```

Purpose<br>목적

View CPU utilization by core.<br>각 CPU 코어별 점유율 현황을 상세하게 진단합니다.

---

## Historical Analysis

```bash
sar -u 1 10
```

Purpose<br>목적

Review CPU utilization trends.<br>CPU 사용률의 역사적 평균 추세 및 특정 시간대 기록을 확인합니다.

---

# CPU Breakdown

Understanding CPU states is critical.

---

## User CPU (us)

Time spent executing user-space code.<br>사용자 애플리케이션(유저 공간) 코드를 실행하는 데 소요된 CPU 비율입니다.

Examples<br>예시:

- Python
- Java
- Application Processes

---

## System CPU (sy)

Time spent executing kernel code.<br>커널 공간(시스템 콜, 네트워크 드라이버 등)에서 연산을 처리하는 데 소요된 CPU 비율입니다.

Examples<br>예시:

- System Calls
- Networking
- File System Operations

---

## IOWait (wa)

CPU waiting for disk operations.<br>CPU가 디스크 I/O 입출력 연산 완료를 대기하느라 블로킹된 시간 비율입니다.

Important:

High IOWait does NOT necessarily mean CPU is the bottleneck.<br>IOWait가 높다고 해서 CPU 연산 속도가 성능 저하의 근본 원인인 것은 아닙니다.

It often indicates a storage problem.<br>대개 느린 디스크 응답 속도나 스토리지 성능 병목을 의미합니다.

---

## Idle (id)

Unused CPU capacity.<br>아무런 연산을 하지 않고 대기 상태로 있는 가용 CPU 자원 비율입니다.

---

## Steal Time (st)

Virtualized environments only.<br>가상화 환경(클라우드 VM, EC2 등)에서만 관찰되는 지표입니다.

CPU time taken by the hypervisor.<br>하이퍼바이저가 해당 VM의 CPU 사이클을 박탈해 동일 물리 호스트 내 다른 VM에 할당한 시간 비율입니다.

High Steal Time may indicate noisy neighbors or host contention.<br>이 값이 지속적으로 높다면 인접 가상 머신(Noisy Neighbor) 간의 심각한 자원 경합을 의심해야 합니다.

---

# Common Root Causes

## Infinite Loop

Example

```python
while True:
    pass
```

---

## Traffic Spike

Examples<br>예시

- API traffic surge<br>API 요청 트래픽의 갑작스러운 급증
- DDoS<br>DDoS 분산 서비스 거부 공격
- Unexpected load<br>의도치 않은 대규모 트래픽 부하

---

## Batch Jobs

Examples<br>예시

- ETL<br>ETL 데이터 적재 및 변환 작업
- Cron Jobs<br>스케줄링된 주기적인 크론 잡
- Scheduled Tasks<br>백그라운드로 동작하는 스케줄링 태스크

---

## Application Bug

Examples<br>예시

- Memory leak<br>지속적으로 메모리를 점유해 반환하지 않는 누수 side effects<br>메모리 누수로 인한 GC(Garbage Collection) 스레드의 과도한 회전 부하
- Retry storms<br>에러 발생 시 급격한 재시도 폭풍(Retry Storm)
- Dead loops<br>무한 대기 및 데드락 조건 루프

---

## Misconfiguration

Examples<br>예시

- Logging loops<br>반복적인 디버그 로그 쓰기 루프
- Excessive polling<br>소켓 또는 락에 대한 과도한 폴링 루프
- Incorrect thread count<br>부적절하게 설정된 워커 스레드 개수

---

# Common Interview Follow-up

### Q1

CPU is 100%, but Load Average is only 1.

What does it mean?

Expected Answer<br>예상 답변

Likely a single-threaded process consuming one CPU core.

---

### Q2

Load Average is 20, but CPU utilization is only 10%.

What does it mean?

Expected Answer<br>예상 답변

Possible I/O bottleneck.

Investigate IOWait and storage performance.

---

### Q3

CPU utilization is high, but no process appears abnormal.

What would you do?

Expected Answer<br>예상 답변

Check kernel activity, interrupts, threads, and system metrics.

---

### Q4

What is the difference between User CPU and System CPU?

Expected Answer<br>예상 답변

User CPU executes application code.

System CPU executes kernel operations.

---

### Q5

What is Steal Time?

Expected Answer<br>예상 답변

CPU time consumed by the hypervisor in virtualized environments.

---

# Personal Notes

Strong Interview Message<br>면접에서 전달할 강력한 메시지

CPU 100% is a symptom.<br>CPU 점유율 100% 도달은 하나의 증상(Symptom)일 뿐입니다.

It is not the root cause.<br>그것 자체가 근본 원인(Root Cause)은 아닙니다.

My goal is to identify why CPU utilization increased.<br>나의 핵심 목표는 왜 CPU 사용량이 갑자기 비정상적으로 급증했는지 원인을 알아내는 것입니다.

---

Strong Interview Quote<br>면접관에게 전할 강렬한 한마디

"I focus on identifying the process responsible for CPU consumption and then determine whether the behavior is expected or abnormal."<br>"저는 CPU를 점유 중인 특정 프로세스를 찾아 격리한 뒤, 이 동작이 시스템의 의도된 결과인지 아니면 비정상적인 동작인지를 구분하는 데 집중합니다."

This sounds much stronger than simply listing commands.<br>이것은 단순히 명령어 목록만 나열하는 것보다 훨씬 강력한 인상을 줍니다.

---

# Related Topics

[linux-q01-server-slow.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q01-server-slow.md)

[linux-q03-memory-leak.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q03-memory-leak.md)

[linux-q04-disk-full.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q04-disk-full.md)

[linux-q05-process-crash.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q05-process-crash.md)

---

## Status

Studying
