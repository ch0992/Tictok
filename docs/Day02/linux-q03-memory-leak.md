# Linux Interview Question 03

## Memory Usage Keeps Increasing

### Difficulty

Medium

### Importance

★★★★★

### Frequency

★★★★★

---

## Interview Question

Memory usage on a Linux server keeps increasing over time.

How would you investigate and troubleshoot the issue?

---

## Interviewer's Intent

The interviewer wants to evaluate:<br>면접관은 다음 사항을 평가하고자 합니다:

- Linux memory fundamentals
- Troubleshooting methodology<br>장애 해결 방법론 및 절차
- Understanding of memory leaks<br>메모리 누수(Memory Leak<br>애플리케이션이 메모리 사용 후 시스템에 반환하지 않는 메모리 누수 현상) 현상에 대한 심층적 이해
- OOM investigation experience<br>OOM(Out Of Memory) Killer 발생 시 원인 추적 경험
- Performance analysis skills<br>시스템 리소스 진단 및 성능 최적화 역량

The interviewer wants to know whether you understand the difference between:<br>면접관은 당신이 다음 개념들의 차이점을 이해하고 있는지 평가하고자 합니다:

- Used Memory<br>사용 중인 메모리 (실제 프로세스가 할당한 영역)
- Cached Memory<br>파일 시스템 입출력을 가속화하기 위해 캐싱된 메모리 영역
- Memory Leak<br>애플리케이션이 메모리 사용 후 시스템에 반환하지 않는 메모리 누수 현상
- Swap Usage<br>물리 메모리가 부족해 하드 디스크 공간을 가상 메모리처럼 활용하는 영역
- OOM Conditions<br>가용한 물리 메모리와 스왑이 모두 고갈되어 시스템 전체가 다운될 위기 상황

---

## Recommended Answer (English)

When I see memory usage continuously increasing, my first step is to determine whether the behavior is actually abnormal.

High memory utilization does not always indicate a problem because Linux intentionally uses available memory for filesystem caching.

I would first review overall memory statistics using tools such as free, vmstat, and top.

I would pay particular attention to:

- Available Memory
- Cached Memory<br>파일 시스템 입출력을 가속화하기 위해 캐싱된 메모리 영역
- Swap Usage<br>물리 메모리가 부족해 하드 디스크 공간을 가상 메모리처럼 활용하는 영역
- Memory Growth Trends

Next, I would identify the process consuming memory.

Using top, ps, or pmap, I would determine whether a specific application is continuously increasing its memory footprint.

If memory usage continues growing without being released, I would suspect a memory leak.

I would also review application logs, recent deployments, configuration changes, and system events.

Additionally, I would check whether the system has experienced OOM events.

If necessary, I would collect heap dumps or application-level diagnostics to determine the source of the leak.

My goal is to distinguish between normal Linux memory behavior and genuine memory exhaustion.

---

## Korean Summary

메모리 사용량이 증가한다고 해서 바로 문제라고 판단하지 않습니다.

Linux는 남는 메모리를 캐시로 적극 활용하기 때문에 높은 메모리 사용률 자체는 정상일 수 있습니다.

먼저 확인할 항목:

- Available Memory
- Cache
- Buffers
- Swap Usage<br>물리 메모리가 부족해 하드 디스크 공간을 가상 메모리처럼 활용하는 영역
- Memory 증가 추세

이후 어떤 프로세스가 메모리를 사용하는지 확인합니다.

특정 프로세스의 메모리가 지속적으로 증가한다면 Memory Leak<br>애플리케이션이 메모리 사용 후 시스템에 반환하지 않는 메모리 누수 현상을 의심할 수 있습니다.

또한 다음도 확인합니다.

- 최근 배포
- 설정 변경
- 로그
- OOM 이벤트

궁극적으로는 정상적인 Linux 캐시 사용인지 실제 메모리 누수인지 구분하는 것이 중요합니다.

---

# Investigation Flow

Memory Alert

↓

Check Overall Memory

↓

Check Available Memory

↓

Check Cache Usage

↓

Check Swap Usage<br>물리 메모리가 부족해 하드 디스크 공간을 가상 메모리처럼 활용하는 영역

↓

Identify High Memory Process

↓

Review Logs

↓

Check OOM Events

↓

Determine Root Cause

---

# Key Commands

## Memory Overview

```bash
free -h
```

Purpose<br>목적

View memory usage summary.<br>메모리 할당 상태 및 전체 스왑 메모리 요약 정보를 확인합니다.

Important

Focus on:

- available
- buff/cache

Not only "used".

---

## Memory Statistics

```bash
vmstat 1
```

Purpose<br>목적

Monitor memory activity and swapping.<br>실시간 메모리 할당 통계 및 디스크 스왑 입출력(Thrashing) 징후를 모니터링합니다.

---

## High Memory Processes

```bash
top
htop
ps aux --sort=-%mem | head
```

Purpose<br>목적

Identify memory consumers.<br>가장 많은 물리 메모리를 점유하고 있는 애플리케이션 프로세스를 확인합니다.

---

## Process Memory Mapping

```bash
pmap -x <pid>
```

Purpose<br>목적

Detailed memory allocation.<br>지정된 프로세스의 상세 가상 메모리 매핑 구조(가상 영역 크기 및 RSS 비율)를 확인합니다.

---

## OOM Investigation

```bash
dmesg | grep -i oom
journalctl -k | grep -i oom
```

Purpose<br>목적

Identify OOM Killer activity.<br>커널이 시스템 패닉을 막기 위해 프로세스를 강제 종료시켰던 OOM Killer 흔적을 시스템 로그에서 추적합니다.

---

# Important Concepts

## Used Memory<br>사용 중인 메모리 (실제 프로세스가 할당한 영역)

Not always problematic.<br>사용 중인 메모리가 늘어나는 현상 자체가 항상 문제를 의미하는 것은 아닙니다.

Linux aggressively uses memory.<br>Linux 커널은 아무 연산도 하지 않는 RAM을 낭비하지 않기 위해 파일 캐싱으로 적극 활용합니다.

---

## Cache

Linux uses unused RAM as cache.<br>Linux 커널은 사용되지 않는 남는 RAM을 디스크 입출력 속도를 높이기 위한 버퍼/캐시로 전환해 씁니다.

Cache can be reclaimed when applications need memory.<br>이 버퍼/캐시 공간은 실제 유저 애플리케이션이 메모리 할당을 요청하면 커널이 즉각적으로 회수하여 프로세스에게 제공합니다.

High cache usage is often normal.<br>따라서 높은 파일 캐싱 점유율은 성능상 최적인 상태이며 매우 정상적인 Linux 동작입니다.

---

## Available Memory

More important than used memory.<br>단순히 물리적으로 사용 중인 메모리 수치(used)보다 훨씬 중요한 실질적인 리소스 판단 메트릭입니다.

Available memory indicates how much memory can still be allocated.<br>새로운 프로세스를 기동하거나 기존 프로세스가 확장을 원할 때 시스템의 스왑 발생 없이 즉시 할당받을 수 있는 실제 여유 공간 크기입니다.

---

## Swap

Disk space used when RAM becomes insufficient.<br>물리 메모리가 한계에 도달해 가용 RAM이 거의 없을 때를 대비하여 하드 디스크의 특정 파티션을 가상 메모리 공간으로 치환해 쓰는 영역입니다.

High swap usage may indicate memory pressure.<br>스왑 공간의 사용량이 지속적으로 증가하며 si(swap-in)/so(swap-out) 입출력이 유발된다면 심각한 RAM 자원 부족 압박 상태임을 가리킵니다.

---

## OOM Killer

Out Of Memory Killer.

Linux mechanism that terminates processes when memory is exhausted.<br>가용한 가상/물리 메모리가 완벽히 고갈되었을 때 시스템 전체가 응답 불능 상태(Freeze)에 빠지는 것을 막고자, 커널이 스스로 메모리 점유율과 기여도(oom_score)가 가장 높은 프로세스를 골라 강제 종료하는 자구책 메커니즘입니다.

---

# Common Root Causes

## Application Memory Leak<br>애플리케이션이 메모리 사용 후 시스템에 반환하지 않는 메모리 누수 현상

Examples<br>예시

- Java heap leak<br>Java의 GC 대상에서 누락되는 힙 메모리 누수
- Python object leak<br>글로벌 변수 참조 등으로 인한 Python 오브젝트 유실 누수
- Goroutine leak<br>종료되지 않고 메모리에 계속 쌓이는 Go언어의 고루틴 누수

---

## Unbounded Cache Growth

Examples<br>예시

- Redis<br>인메모리 데이터베이스 Redis의 용량 제약 한계
- Application cache<br>애플리케이션 내부에 임시 캐시를 보관하다 지속 팽창하는 문제

---

## Memory Fragmentation

Examples<br>예시

- Long-running processes<br>장시간 재시작 없이 구동되면서 점진적으로 파편화되는 프로세스 메모리 공간

---

## Large Batch Jobs

Examples<br>예시

- ETL<br>ETL 데이터 적재 및 변환 작업
- Data Processing

---

## Recent Deployment

Examples<br>예시

- New release introduces leak

---

# Common Interview Follow-up

### Q1

Memory usage is 95%.

Is that necessarily a problem?

Expected Answer<br>예상 답변

No.

Linux uses memory for caching.

Need to examine available memory.

---

### Q2

How do you determine whether memory usage is caused by cache or an application?

Expected Answer<br>예상 답변

Inspect process memory consumption and cache statistics.

---

### Q3

What is the OOM Killer?

Expected Answer<br>예상 답변

Linux mechanism that terminates processes when memory is exhausted.<br>가용한 가상/물리 메모리가 완벽히 고갈되었을 때 시스템 전체가 응답 불능 상태(Freeze)에 빠지는 것을 막고자, 커널이 스스로 메모리 점유율과 기여도(oom_score)가 가장 높은 프로세스를 골라 강제 종료하는 자구책 메커니즘입니다.

---

### Q4

How would you investigate a suspected memory leak?

Expected Answer<br>예상 답변

Track memory growth over time and identify processes whose memory footprint continuously increases.

---

### Q5

Swap usage is increasing.

What does it mean?

Expected Answer<br>예상 답변

Possible memory pressure or insufficient RAM.

---

# Real Production Example

Common Scenario<br>일반적인 시나리오

Application memory grows slowly over several days.

↓

Available memory decreases.

↓

Swap usage increases.

↓

Latency increases.

↓

OOM Killer terminates process.

↓

Service outage occurs.

This pattern is common in production environments.

---

# Personal Notes

Strong Interview Message<br>면접에서 전달할 강력한 메시지

High memory usage is not necessarily a problem.<br>메모리 사용률이 높은 것 자체는 반드시 장애라고 볼 수는 없습니다.

Memory exhaustion is the problem.<br>진짜 문제는 가용 가능한 실질적인 메모리가 완전히 바닥나는 고갈(Exhaustion) 상황입니다.

---

Strong Interview Quote<br>면접관에게 전할 강렬한 한마디

"My first goal is to determine whether the memory usage is normal Linux caching behavior or actual memory pressure."

This demonstrates strong Linux fundamentals.<br>이 답변은 견고한 Linux 시스템 기본 지식을 보여줍니다.

---

# Related Topics

[linux-q01-server-slow.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q01-server-slow.md)

[linux-q02-cpu-100.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q02-cpu-100.md)

[linux-q04-disk-full.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q04-disk-full.md)

[linux-q05-process-crash.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q05-process-crash.md)

---

## Status

Studying
