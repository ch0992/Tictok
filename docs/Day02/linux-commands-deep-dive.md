# Linux Command Deep Dive

## Essential Troubleshooting Commands

### Importance

★★★★★

### Frequency

★★★★★

### Goal

Understand:

- When to use each command
- What information it provides
- How it helps identify bottlenecks
- Common interview follow-up questions

---

# 1. top

### Purpose<br>목적

Real-time system overview.

Provides:

- CPU usage
- Memory usage
- Load average
- Running processes

---

### Why Use It?

Usually the first command executed during troubleshooting.

Provides a quick overview of system health.

---

### What Are You Looking For?

- CPU %
- Memory usage
- Load average
- High-resource processes
- Zombie processes

---

### Interview Question

Why do you start with top?

### Recommended Answer

Because it provides a high-level overview of system utilization and helps quickly identify whether the bottleneck is CPU, memory, or a specific process.

---

# 2. htop

### Purpose<br>목적

Enhanced version of top.

---

### Advantages

- Better visualization
- Tree view
- Easier process management

---

### Interview Note

Same purpose as top.

Mostly a usability improvement.

---

# 3. ps

### Purpose<br>목적

Inspect running processes.

---

### Common Commands

```bash
ps aux
ps aux --sort=-%cpu
ps aux --sort=-%mem
```

---

### Why Use It?

Identify:

- CPU-heavy processes
- Memory-heavy processes

---

### Example

```bash
ps aux --sort=-%cpu | head
```

Find top CPU consumers.

---

# 4. free

### Purpose<br>목적

Memory overview.

---

### Common Command

```bash
free -h
```

---

### Most Important Fields

```text
total
used
available
buff/cache
```

---

### Interview Trap

Memory usage = 95%

Is it necessarily a problem?

Answer:

No.

Available memory is more important than used memory.

Linux aggressively uses memory for cache.

---

# 5. vmstat

### Purpose<br>목적

System-wide performance metrics.

---

### Common Command

```bash
vmstat 1
```

---

### Why Use It?

Observe:

- CPU
- Memory
- Swap
- Context switching
- Processes

in one view.

---

### Important Fields

```text
r
b
si
so
wa
```

---

### Meanings

r

Processes waiting for CPU

b

Processes blocked

si

Swap In

so

Swap Out

wa

IO Wait

---

### Interview Question

High wa means?

Answer

CPU is waiting on storage operations.

Investigate disk performance.

---

# 6. iostat

### Purpose<br>목적

Storage performance analysis.

---

### Common Command

```bash
iostat -x 1
```

---

### Why Use It?

Determine whether storage is the bottleneck.

---

### Important Fields

%util

await

svctm

---

### Interview Question

CPU low

Load Average high

What next?

Answer

Investigate storage with iostat.

---

# 7. sar

### Purpose<br>목적

Historical performance analysis.

---

### Common Command

```bash
sar -u
sar -r
sar -n DEV
```

---

### Why Use It?

View performance history.

Useful when issue already occurred.

---

### Example

CPU spike happened 2 hours ago.

Use sar to investigate historical metrics.

---

# 8. ss

### Purpose<br>목적

Network connection analysis.

---

### Common Command

```bash
ss -tulpn
```

---

### Why Use It?

Inspect:

- Open ports
- Connections
- Listening services

---

### Modern Replacement

Preferred over netstat.

---

# 9. lsof

### Purpose<br>목적

List Open Files.

---

### Common Command

```bash
lsof
lsof -p <pid>
```

---

### Critical Use Case

Deleted but open files.

```bash
lsof | grep deleted
```

---

### Interview Favorite

Disk Full

df = 100%

du = 50%

Why?

Deleted files still open.

---

# 10. journalctl

### Purpose<br>목적

Systemd log analysis.

---

### Common Commands

```bash
journalctl -xe
journalctl -u nginx
journalctl -u kubelet
```

---

### Why Use It?

Investigate:

- Service crashes
- Startup failure<br>의존 서비스 미구동으로 인한 초기 기동 실패s
- OOM events

---

# Command Selection Cheat Sheet

## CPU Issue

```bash
top
htop
ps
mpstat
```

---

## Memory Issue

```bash
free
vmstat
ps
pmap
```

---

## Disk Issue

```bash
df
du
iostat
lsof
```

---

## Network Issue

```bash
ss
sar -n
tcpdump
```

---

## Service Crash

```bash
systemctl
journalctl
dmesg
```

---

# Common Interview Scenarios

### Scenario 1

Server Slow

Start With

```bash
top
```

---

### Scenario 2

CPU 100%

Use

```bash
top
ps
mpstat
```

---

### Scenario 3

Memory Growth

Use

```bash
free
vmstat
ps
```

---

### Scenario 4

Disk Full

Use

```bash
df
du
lsof
```

---

### Scenario 5

Process Crash

Use

```bash
systemctl
journalctl
dmesg
```

---

# Personal Notes

Strong Interview Message<br>면접에서 전달할 강력한 메시지

I select commands based on the suspected bottleneck.

I do not run commands randomly.

---

Strong Interview Quote<br>면접관에게 전할 강렬한 한마디

"The command itself is not important. Understanding what question I am trying to answer is what matters."

This sounds very senior-level and SRE-oriented.

---

## Status

Studying
