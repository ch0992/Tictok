# Linux Interview Question 04

## Disk Usage Reached 100%

### Difficulty

Medium

### Importance

★★★★★

### Frequency

★★★★★

---

## Interview Question

A Linux server reports that disk utilization has reached 100%.

How would you investigate and resolve the issue?

---

## Interviewer's Intent

The interviewer wants to evaluate:<br>면접관은 다음 사항을 평가하고자 합니다:

- Linux filesystem knowledge<br>Linux 파일 시스템 아키텍처 및 내부 구조에 대한 이해
- Storage troubleshooting skills<br>스토리지 공간 포화 및 관련 입출력 장애 해결 능력
- Production incident handling<br>실제 대용량 상용 환경의 스토리지 장애 대응력
- Root Cause Analysis
- Operational experience<br>로그 로테이션, 백업 정책 등 실무 인프라 운영 능력

The interviewer wants to know whether you understand:<br>면접관은 당신이 다음 사항들을 명확히 알고 있는지 평가하고자 합니다:

- Filesystem usage<br>파일 시스템 전반의 사용률 모니터링
- Inode exhaustion<br>파일 생성 정보 공간(Inode)의 고갈 현상
- Storage latency<br>디스크 스토리지의 입출력 지연 속도
- Log growth<br>로그 파일의 급격한 용량 팽창
- Deleted but open files<br>디스크에서 삭제되었으나 프로세스 메모리가 잡고 있는 파일

---

## Recommended Answer (English)

When a disk reaches 100% utilization, I first verify whether the issue is related to storage capacity, inode exhaustion, or storage performance.

My first step is to identify which filesystem is affected using df -h.

Next, I determine what is consuming space using du and filesystem-level analysis.

I would look for:

- Log files
- Temporary files
- Backup files
- Application-generated data

If storage usage appears normal but the filesystem still reports full, I would investigate inode usage using df -i.

I would also check for deleted files that are still being held open by running processes.

In production environments, this is a surprisingly common cause of disk space issues.

Finally, I would identify the root cause, recover space safely, and implement preventive measures such as log rotation, retention policies, or monitoring alerts.

---

## Korean Summary

디스크가 100%라고 해서 바로 파일이 가득 찼다고 판단하지 않습니다.

먼저 확인해야 하는 것은:

- 실제 용량 부족
- inode 부족
- Storage 문제

입니다.

우선 df -h로 어떤 파일시스템이 영향을 받는지 확인합니다.

그 후 du를 사용하여 어떤 디렉터리가 공간을 사용하는지 분석합니다.

또한 inode 부족 여부도 반드시 확인합니다.

특히 운영 환경에서는

삭제된 파일이 프로세스에 의해 계속 열려 있어 공간이 회수되지 않는 경우가 자주 발생합니다.

최종적으로 원인을 파악하고,

- Log Rotation
- Retention Policy
- Monitoring

등을 통해 재발 방지 대책을 수립합니다.

---

# Investigation Flow

Disk Alert

↓

df -h

↓

Identify Filesystem

↓

du Analysis

↓

Check Inodes

↓

Check Deleted Files

↓

Determine Root Cause

↓

Cleanup

↓

Prevention

---

# Key Commands

## Filesystem Usage

```bash
df -h
```

Purpose<br>목적

Identify which filesystem is full.<br>어느 파일 시스템과 마운트 지점이 꽉 찼는지 경로를 식별합니다.

Example

```bash
Filesystem      Size  Used Avail Use% /dev/sda1       500G  500G     0 100% 
```

---

## Directory Usage

```bash
du -sh *
du -sh /var/*
```

Purpose<br>목적

Identify space-consuming directories.<br>어느 디렉토리 및 폴더가 대부분의 공간을 사용하고 있는지 추적합니다.

---

## Top Consumers

```bash
du -ah / | sort -rh | head -20
```

Purpose<br>목적

Find largest files.<br>스토리지를 가장 많이 잡아먹고 있는 상위 대용량 파일들을 명확히 색출합니다.

---

## Inode Usage

```bash
df -i
```

Purpose<br>목적

Check inode exhaustion.<br>디스크 공간 용량은 남았으나 파일 메타데이터 공간(Inode)이 고갈되었는지 점검합니다.

---

## Deleted Open Files

```bash
lsof | grep deleted
```

Purpose<br>목적

Identify deleted files still held open.<br>디스크 경로에서는 삭제(rm)되었으나 백엔드 프로세스가 열린 채 디스크 핸들을 잡고 있어 반환되지 않는 파일을 색출합니다.

---

# Important Concepts

## Filesystem Full

Storage capacity exhausted.<br>스토리지 물리적 볼륨 용량이 한계에 도달한 상황입니다.

Most common scenario.<br>실무에서 가장 흔히 발생하는 일반적인 디스크 풀 장애 유형입니다.

---

## Inode Exhaustion

Filesystem has free space but cannot create files.<br>디스크 물리적 공간 용량은 충분히 남아 있으나, 시스템에 새로운 파일을 더 이상 생성하지 못하는 특이 현상입니다.

Common when:<br>주로 다음과 같은 경우에 다량 발생합니다:

- Millions of small files<br>수백만 개의 자잘한 소형 임시 파일 생성 시
- Log directories<br>수많은 개별 세션 로그 파일 적재 시
- Cache directories<br>파일 기반의 대용량 웹 캐시 파일 적재 시

---

## Deleted But Open Files

Very common production issue.<br>실제 인프라 상용 환경에서 빈번하게 발생하는 골칫거리 장애 현상입니다.

Scenario

1. Log file grows<br>어플리케이션 로그 파일 용량이 비정상적으로 급증합니다.

2. File deleted<br>운영자가 임시방편으로 로그 파일을 강제 삭제(rm)합니다.

3. Process still holds file descriptor<br>로그를 작성하던 백엔드 애플리케이션 프로세스가 close()를 하지 않고 FD(파일 서술자)를 계속 열고 있습니다.

4. Space not reclaimed<br>OS가 실제 파일 블록에 할당된 디스크 섹터 링크를 해제하지 않아 물리 공간이 반환되지 않습니다.

5. Filesystem remains full<br>디스크 상에는 파일이 안 보이지만 파일 시스템은 여전히 100% 용량 풀 상태를 유지합니다.

Solution

Restart process or close file handle.<br>해당 프로세스를 Graceful Restart 하거나 디렉토리 리디렉션을 통해 파일 핸들을 닫아 스페이스를 회수해야 합니다.

---

# Common Root Causes

## Log Growth

Examples<br>예시

- Application logs<br>애플리케이션 구동 로그 파일
- Debug logs<br>과도하게 활성화된 디버그(Debug) 레벨 로그
- Audit logs<br>시스템 보안 및 감사용 파일

---

## Backup Files

Examples<br>예시

- Old backups<br>과거에 압축한 구버전 백업 파일 아카이브
- Database dumps<br>DB에서 내보낸 대용량 SQL 백업 파일 덤프

---

## Core Dumps

Examples<br>예시

```bash
core.*
```

Large crash dump files.<br>애플리케이션 비정상 종료 시 시스템이 메모리 상태를 내려받은 대형 파일입니다.

---

## Container Logs

Examples<br>예시

Kubernetes

Docker

Container runtime logs<br>컨테이너 엔진 데몬이 쌓는 표준 입출력(stdout) 로그 덤프

---

## Inode Exhaustion

Examples<br>예시

Millions of tiny files.<br>수백만 개의 자잘한 임시 및 세션 파일들이 누적되는 케이스입니다.

---

# Common Interview Follow-up

### Q1

df shows 100% usage.

du only shows 50%.

Why?

Expected Answer<br>예상 답변

Deleted files may still be held open by processes.

Investigate using:

```bash
lsof | grep deleted
```

---

### Q2

Filesystem has free space but applications cannot create files.

Why?

Expected Answer<br>예상 답변

Possible inode exhaustion.

Check:

```bash
df -i
```

---

### Q3

How would you identify the largest files?

Expected Answer<br>예상 답변

Use:

```bash
du -ah / | sort -rh
```

---

### Q4

What is an inode?

Expected Answer<br>예상 답변

Metadata structure describing files and directories.

---

### Q5

How would you prevent future disk-full incidents?

Expected Answer<br>예상 답변

- Log rotation
- Retention policies
- Monitoring alerts
- Capacity planning

---

# Real Production Example

Application logging bug

↓

Log file grows to hundreds of GB

↓

Filesystem reaches 100%

↓

Application latency increases

↓

Services fail

↓

Root Cause

Log rotation misconfiguration

This is a common production incident.

---

# Personal Notes

Strong Interview Message<br>면접에서 전달할 강력한 메시지

Disk Full is a symptom.<br>디스크 용량 초과는 장애 현상(Symptom)일 뿐입니다.

The real goal is to identify what consumed the space and why.<br>우리가 진짜 도출해야 할 목표는 무엇이 소중한 스토리지 공간을 점유했는지, 그리고 그 원인은 무엇인지 파악하는 것입니다.

---

Strong Interview Quote<br>면접관에게 전할 강렬한 한마디

"My first objective is to determine whether the issue is capacity-related, inode-related, or caused by deleted files still being held open."<br>"저의 첫 번째 장애 판별 기준은 이것이 단순 물리 용량 포화인지, 아니면 파일 노드(Inode) 고갈인지, 혹은 파일 삭제 후 소켓/메모리 FD(파일 서술자) 해제 누수로 인한 미반환 공간 때문인지를 가려내는 것입니다."

This demonstrates real operational experience.<br>이 답변은 풍부한 실제 인프라 운영 경험을 보여줍니다.

---

# Related Topics

[linux-q01-server-slow.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q01-server-slow.md)

[linux-q02-cpu-100.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q02-cpu-100.md)

[linux-q03-memory-leak.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q03-memory-leak.md)

[linux-q05-process-crash.md](file:///Users/yg/workspace/tictok/docs/Day02/linux-q05-process-crash.md)

---

## Status

Studying
