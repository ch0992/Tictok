# Linux Interview Question 05

## A Critical Process Unexpectedly Crashed

### Difficulty

Medium

### Importance

★★★★★

### Frequency

★★★★★

---

## Interview Question

A critical application process unexpectedly terminated.

Users report service disruption.

How would you investigate and troubleshoot the issue?

---

## Interviewer's Intent

The interviewer wants to evaluate:<br>면접관은 다음 사항을 평가하고자 합니다:

- Incident Response<br>장애 감지 시 신속하고 침착한 초기 대응력
- Root Cause Analysis
- Linux Process Management<br>Linux OS 프로세스 생명주기 및 상태 제어 역량
- Log Analysis<br>로그 기반 에러 분석 및 디렉토리 추적
- Production Troubleshooting<br>상용 서비스 장애 상황 디버깅 경험
- Service Recovery Strategy<br>서비스 가용성 복구(MTTR 단축)를 위한 우선순위 설계

The interviewer wants to understand:<br>면접관은 다음 사항에 대한 당신의 지식 깊이를 파악하고자 합니다:

- How you investigate process failures<br>프로세스 비정상 중단 시 단서를 어떻게 파헤치는지
- Whether you know where to find evidence<br>어느 시스템 로그 디렉토리에서 증거를 찾아내야 하는지 알고 있는지
- How you prioritize service restoration vs root cause analysis<br>서비스 원복 조치와 근본 원인(RCA) 분석의 순위를 어떻게 두는지

---

## Recommended Answer (English)

When a critical process crashes, my first priority is to determine the business impact and restore service if necessary.

I would first verify whether the process is still running and whether an automatic recovery mechanism such as systemd has already restarted it.

Next, I would review system logs and application logs to determine when the process terminated and whether any errors were recorded before the crash.

I would specifically investigate:

- Application errors
- OOM events
- Segmentation fault<br>주소 접근 오류로 인한 세그멘테이션 폴트s
- Dependency failure<br>연결된 외부 데이터베이스나 스토리지 시스템의 장애s
- Configuration issues
- Recent deployments

If available, I would review core dumps and crash diagnostics to identify the failure point.

I would also correlate the crash with recent changes, system resource utilization, and infrastructure events.

After restoring service, I would perform a full root cause analysis and implement preventive measures to reduce the likelihood of recurrence.

---

## Korean Summary

중요 프로세스가 종료되었을 때 가장 먼저 해야 할 일은 영향도를 파악하고 서비스 복구 여부를 확인하는 것입니다.

우선 확인할 내용은:

- 프로세스 상태
- systemd 자동 재시작 여부
- 서비스 영향 범위

입니다.

그 후 다음을 조사합니다.

- Application Log
- System Log
- OOM Killer
- Segmentation Fault
- 최근 배포
- 설정 변경

필요하다면 Core Dump를 분석하여 원인을 확인합니다.

서비스 복구 후에는 반드시 RCA를 수행하고 재발 방지 대책을 수립합니다.

---

# Investigation Flow

Service Alert

↓

Confirm Impact

↓

Check Process Status

↓

Check Restart Status

↓

Review Logs

↓

Investigate Failure Cause

↓

Restore Service

↓

Perform RCA

↓

Implement Prevention

---

# Key Commands

## Process Status

```bash
ps aux
pgrep <process>
pidof <process>
```

Purpose<br>목적

Verify whether the process is running.<br>현재 해당 애플리케이션 프로세스가 살아있는지 검사합니다.

---

## Systemd Status

```bash
systemctl status <service>
```

Purpose<br>목적

Check service state and restart history.<br>Systemd 서비스 데몬의 동작 상태 및 이전 비정상 자동 재기동 이력을 확인합니다.

---

## Service Logs

```bash
journalctl -u <service>
```

Purpose<br>목적

Review service-related events.<br>Systemd 저널로그에서 해당 서비스 유닛과 연동된 에러를 확인합니다.

---

## System Logs

```bash
journalctl -xe
```

Purpose<br>목적

Review recent system events.<br>시스템 전체 저널로그에서 장애 발생 직전의 다른 데몬 영향도를 확인합니다.

---

## Kernel Logs

```bash
dmesg
```

Purpose<br>목적

Check kernel-level failures.<br>커널 링 버퍼에서 메모리 관련 하드 에러나 커널 패닉 메시지를 스캔합니다.

---

## OOM Investigation

```bash
dmesg | grep -i oom
journalctl -k | grep -i oom
```

Purpose<br>목적

Determine whether the process was killed due to memory exhaustion.<br>물리 메모리 부족으로 인해 커널 OOM Killer에 의해 프로세스가 살해되었는지 점검합니다.

---

## Core Dump Analysis

```bash
coredumpctl list
coredumpctl info
```

Purpose<br>목적

Review crash information.<br>프로세스 비정상 종료 시 디버깅을 위해 메모리를 그대로 덤프한 내역을 진단합니다.

---

# Important Concepts

## Process Crash

Unexpected application termination.<br>애플리케이션 데몬 프로세스가 예기치 않게 비정상 다운된 현상입니다.

Possible causes:<br>다음과 같은 원인들이 있을 수 있습니다:

- Software bug<br>애플리케이션 소스 코드 레벨의 치명적 결함
- Memory corruption<br>포인터 오류 등으로 인한 메모리 손상(Corruption)
- Dependency failure<br>연결된 외부 데이터베이스나 스토리지 시스템의 장애
- Resource exhaustion<br>CPU, 메모리 등 컴퓨팅 자원의 고갈

---

## OOM Killer

Out Of Memory Killer.

Linux may terminate processes when memory becomes exhausted.<br>가용 물리 메모리가 완전히 고갈되면 시스템 멎음을 예방하고자 커널이 프로세스를 강제 종료시킵니다.

Symptoms:<br>주요 징후는 다음과 같습니다:

- Process suddenly disappears<br>프로세스가 ps 명령어 결과에서 아무 이유 없이 사라짐
- OOM events recorded in logs<br>커널 로그에 oom-kill 및 killed process 메시지가 기록됨

---

## Segmentation Fault

Application attempts to access invalid memory.<br>프로세스가 소유하지 않거나 접근 권한이 없는 비정상적인 가상 메모리 주소에 읽기/쓰기를 시도했을 때 발생합니다.

Common in:<br>주로 다음 언어 및 컴포넌트에서 자주 발생합니다:

- C/C++<br>C/C++ 애플리케이션
- Native libraries<br>JVM이나 Node.js에서 구동되는 Native C-Library 및 모듈
- Driver-related software<br>커널 디바이스 드라이버 모듈

---

## Core Dump

Snapshot of application memory at crash time.<br>프로세스가 정상 상태를 벗어나 비정상 종료된 바로 그 순간의 프로세스 메모리 상태를 고스란히 저장해둔 파일입니다.

Useful for debugging.<br>개발자 및 운영자가 gdb 디버거를 마운트하여 종료 위치와 스택 트레이스를 분석하는 데 매우 유용합니다.

---

## Restart Policy

Systemd can automatically restart failed services.<br>Systemd는 데몬이 예기치 않게 비정상 중단되면, 소스 수정 없이 자동으로 가용한 상태로 다시 띄워주는 정책을 갖고 있습니다.

Example:

```ini
Restart=always
```

---

# Common Root Causes

## OOM Event

Examples<br>예시

- Memory leak<br>지속적으로 메모리를 점유해 반환하지 않는 누수
- Insufficient memory<br>기본 시스템의 물리 메모리 절대 용량 부족
- Unexpected workload spike<br>갑작스러운 동시 접속자 수 증가

---

## Application Bug

Examples<br>예시

- Segmentation fault<br>주소 접근 오류로 인한 세그멘테이션 폴트
- Null pointer dereference<br>애플리케이션 코드 내 Null 포인터 참조 오류
- Logic errors<br>기타 처리 불능 예외 로직 에러

---

## Dependency Failure

Examples<br>예시

- Database unavailable<br>데이터베이스 서버 응답 불능
- Storage unavailable<br>공유 디스크 스토리지 분리 및 장애
- Network outage

---

## Configuration Error

Examples<br>예시

- Invalid configuration<br>잘못 표기된 설정 정보 및 포트 점유
- Startup failure<br>의존 서비스 미구동으로 인한 초기 기동 실패

---

## Recent Deployment

Examples<br>예시

- New release introduces crash condition<br>배포된 새 버전의 치명적인 메모리 누수나 버그 결함 유입

---

# Common Interview Follow-up

### Q1

The process disappeared from ps output.

What would you do?

Expected Answer<br>예상 답변

Review logs and determine whether OOM or a crash occurred.

---

### Q2

How do you determine whether the process was killed by the OOM Killer?

Expected Answer<br>예상 답변

Review kernel logs.

Example:

```bash
dmesg | grep -i oom
```

---

### Q3

What is a core dump?

Expected Answer<br>예상 답변

Memory snapshot captured when a process crashes.

---

### Q4

How would you investigate a segmentation fault?

Expected Answer<br>예상 답변

Review logs, core dumps, and application diagnostics.

---

### Q5

Service restarted automatically.

Would you still investigate?

Expected Answer<br>예상 답변

Yes.

Automatic recovery restores service but does not identify the root cause.

---

# Real Production Example

Application memory leak

↓

Memory usage increases

↓

OOM Killer terminates process

↓

Systemd restarts service

↓

Service recovers

↓

Root Cause Analysis identifies memory leak

↓

Application patch deployed

This is a very common production scenario.

---

# Personal Notes

Strong Interview Message<br>면접에서 전달할 강력한 메시지

Restoring service and identifying the root cause are separate activities.

Both are important.

---

Strong Interview Quote<br>면접관에게 전할 강렬한 한마디

"My first priority is service restoration. My second priority is understanding why the process failed."

This sounds very SRE-oriented.<br>이것은 매우 SRE다운(가용성 우선 및 체계적 분석) 태도를 보여줍니다.

---

# Related Topics

[linux-q01-server-slow.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q01-server-slow.md)

[linux-q02-cpu-100.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q02-cpu-100.md)

[linux-q03-memory-leak.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q03-memory-leak.md)

[linux-q04-disk-full.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q04-disk-full.md)

---

## Status

Studying
