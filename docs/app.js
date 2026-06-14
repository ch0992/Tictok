
// SRE Study App - Advanced Interactive Layouts Controller Logic
document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentCategory: localStorage.getItem('study_app_current_category') || 'Dashboard',
    currentFileId: null,
    searchQuery: '',
    activeRecall: localStorage.getItem('active_recall_enabled') === 'true',
    quickRecall: localStorage.getItem('quick_recall_enabled') === 'true',
    theme: localStorage.getItem('study_app_theme') || 'dark',
    statusMap: JSON.parse(localStorage.getItem('study_app_status_map') || '{}'),
    checkboxMap: JSON.parse(localStorage.getItem('study_app_checkbox_map') || '{}'),
    terminalActiveTab: 'top',
    cpuActiveMetric: 'user'
  };

  // DOM Elements
  const el = {
    sidebar: document.getElementById('sidebar'),
    menuToggle: document.getElementById('menuToggle'),
    themeToggle: document.getElementById('themeToggle'),
    activeRecallToggle: document.getElementById('activeRecallToggle'),
    quickRecallToggle: document.getElementById('quickRecallToggle'),
    searchInput: document.getElementById('searchInput'),
    navMenu: document.getElementById('navMenu'),
    mainContent: document.getElementById('mainContent'),
    contentArea: document.getElementById('contentArea'),
    topNavTabs: document.getElementById('topNavTabs')
  };

  // Simulated Terminal Data
  const terminalSimData = {
    top: {
      command: 'top',
      output: `top - 12:45:04 up 14 days,  3:12,  2 users,  load average: <span class="console-highlight">8.52, 6.24, 3.12<span class="console-tooltip"><h4>Load Average</h4>시스템의 1분, 5분, 15분 대기 프로세스 수 평균입니다. CPU 코어 개수와 비교하여 병목 여부를 결정합니다.</span></span>
Tasks: 284 total,   2 running, 282 sleeping,   0 stopped,   0 zombie
%Cpu(s): <span class="console-highlight">88.2 us<span class="console-tooltip"><h4>User CPU (us)</h4>애플리케이션(유저 공간) 코드 실행에 소요된 CPU 비율입니다. 루프 버그나 트래픽 급증을 시사합니다.</span></span>, <span class="console-highlight">10.5 sy<span class="console-tooltip"><h4>System CPU (sy)</h4>커널 공간 연산(시스템 콜, 네트워킹, I/O)에 소요된 CPU 비율입니다. 과도한 컨텍스트 스위칭 등을 의심합니다.</span></span>,  0.0 ni,  0.0 id,  <span class="console-highlight">1.3 wa<span class="console-tooltip"><h4>IOWait (wa)</h4>디스크 I/O 응답을 대기하는 CPU 비율입니다. 높다면 디스크 성능 이슈 또는 병목을 의미합니다.</span></span>,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :  64382.4 total,   2112.5 free,  48240.2 used,  14029.7 buff/cache
MiB Swap:  16384.0 total,  11280.4 free,   5103.6 used.  12140.4 avail Mem 

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
28410 appuser   20   0   14.8g   9.2g   2.1g R  <span class="console-highlight">98.5<span class="console-tooltip"><h4>PID 28410 %CPU</h4>특정 단일 프로세스가 CPU 코어 하나를 가득 채우고 있음을 나타냅니다. (Single-threaded loop)</span></span>  14.3  12:41.05 python3
 1242 nginx     20   0    1.2g   0.1g   0.0g S   1.5   0.2   4:12.82 nginx`
    },
    free: {
      command: 'free -h',
      output: `              total        used        free      shared  buff/cache   <span class="console-highlight correct-flag">available<span class="console-tooltip"><h4>Available Memory (가장 중요)</h4>Swap 없이 새로운 프로세스를 실행할 때 즉시 할당 가능한 예측 메모리량입니다. 면접 시 free가 아닌 이 값을 강조하세요!</span></span>
Mem:           62Gi        48Gi       2.1Gi       1.2Gi        12Gi        <span class="console-highlight">12Gi<span class="console-tooltip"><h4>12Gi Available</h4>실제 여유 공간(free)은 2.1Gi에 불과하지만, 버퍼/캐시(12Gi) 중 즉시 회수하여 사용 가능한 양을 포함하므로 시스템 메모리는 충분합니다.</span></span>
Swap:          16Gi       4.9Gi        11Gi`
    },
    iostat: {
      command: 'iostat -x 1',
      output: `avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           4.10    0.00    2.50   <span class="console-highlight">68.20<span class="console-tooltip"><h4>High IOWait</h4>CPU가 디스크 I/O 연산 완료를 대기하느라 블로킹된 시간의 백분율입니다. 68%는 매우 심각한 스토리지 병목을 의미합니다.</span></span>    0.00   25.20

Device:         rrqm/s   wrqm/s     r/s     w/s    rkB/s    wkB/s aqu-sz  <span class="console-highlight correct-flag">await<span class="console-tooltip"><h4>await (대기 지연 시간)</h4>I/O 요청이 디스크에 들어가 완료될 때까지 걸린 평균 시간(ms)입니다. 10ms 이상이면 디스크 큐가 지연되고 있음을 뜻합니다.</span></span>  svctm  <span class="console-highlight correct-flag">%util<span class="console-tooltip"><h4>%util (디스크 사용률)</h4>디스크가 입출력을 처리하고 있던 시간 비율입니다. 90% 이상이면 디스크 처리 용량이 한계에 다다랐음을 가리킵니다.</span></span>
sdb               0.00    12.00  420.00  180.00  48200.0  12400.0   8.52  <span class="console-highlight">22.50<span class="console-tooltip"><h4>await 22.5ms</h4>평균 대기 지연 시간이 22.5ms에 도달했습니다. 애플리케이션의 디스크 Read/Write 성능 저하의 핵심 원인입니다.</span></span>   1.40  <span class="console-highlight">92.50<span class="console-tooltip"><h4>%util 92.5%</h4>스토리지가 포화 상태입니다. 백업 배치 작업 정지, DB 튜닝, 또는 SSD 디스크 확장 등의 조치가 필요합니다.</span></span>`
    },
    lsof: {
      command: 'lsof | grep deleted',
      output: `COMMAND   PID USER   FD   TYPE DEVICE   SIZE/OFF   NODE NAME
python3 <span class="console-highlight">28410<span class="console-tooltip"><h4>프로세스 ID</h4>해당 파일을 잡고 있는 앱 프로세스 ID입니다. 이 프로세스를 reload/restart하면 디스크 공간이 즉시 확보됩니다.</span></span> appuser    4w   REG    8,1 <span class="console-highlight">256.4G<span class="console-tooltip"><h4>미회수 용량</h4>삭제(rm) 되었으나 메모리 핸들이 닫히지 않아 디스크 용량을 차지하고 있는 크기(256GB)입니다.</span></span> 294810 <span class="console-highlight">/var/log/app.log (deleted)<span class="console-tooltip"><h4>(deleted) 파일</h4>디스크 상에서는 삭제되어 보이지 않지만, 백엔드 프로세스가 쓰기 연결을 쥐고 있어 OS가 해제하지 못하는 디스크 공간입니다.</span></span>`
    }
  };

  // Simulated CPU Metric Data
  const cpuMetricData = {
    user: {
      label: 'User CPU (us)',
      percentage: '92.5%',
      console: `top - 12:51:02
%Cpu(s): 92.5 us,  3.2 sy,  0.0 ni,  4.3 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st

  PID USER      %CPU  %MEM     TIME+ COMMAND
12844 appuser   91.8   4.2   2:14.05 node /app/server.js`,
      cause: '애플리케이션 무한 루프, 비효율적인 정렬 알고리즘, 대용량 트래픽 급증 및 JSON 파싱 부하.'
    },
    system: {
      label: 'System CPU (sy)',
      percentage: '82.1%',
      console: `top - 12:51:02
%Cpu(s):  5.2 us, 82.1 sy,  0.0 ni,  2.7 id,  8.0 wa,  0.0 hi,  2.0 si,  0.0 st

  PID USER      %CPU  %MEM     TIME+ COMMAND
  284 root      78.4   0.1   0:45.12 [kworker/u32:2]`,
      cause: '과도한 시스템 콜(System Call), 잦은 컨텍스트 스위칭(Context Switching), 네트워크 소켓 폴링(Polling) 루프, 커널 내 드라이버 오동작.'
    },
    iowait: {
      label: 'IOWait (wa)',
      percentage: '74.5%',
      console: `top - 12:51:02
%Cpu(s):  2.1 us,  4.4 sy,  0.0 ni, 19.0 id, 74.5 wa,  0.0 hi,  0.0 si,  0.0 st

  PID USER      %CPU  %MEM     TIME+ COMMAND
29811 db_user    3.5  32.4  15:12.82 postgres: writer process`,
      cause: '느린 스토리지 레이턴시, 디스크 용량 포화, 인덱싱 없는 대규모 DB 쿼리 스캔, 또는 배치 라이트 작업으로 인한 스토리지 대기 지연.'
    },
    steal: {
      label: 'Steal Time (st)',
      percentage: '35.4%',
      console: `top - 12:51:02
%Cpu(s): 12.0 us,  2.6 sy,  0.0 ni, 50.0 id,  0.0 wa,  0.0 hi,  0.0 si, 35.4 st

  PID USER      %CPU  %MEM     TIME+ COMMAND
 1084 appuser    8.5   2.1   1:05.10 python3 app.py`,
      cause: '가상화 환경(VM, AWS EC2 등)에서 하이퍼바이저가 해당 VM의 CPU 사이클을 박탈하여 다른 인접 VM(Noisy Neighbor)에 할당하는 현상.'
    }
  };

  const slowServerData = {
    cpu: {
      label: 'CPU Saturation (CPU 포화)',
      console: `$ uptime
 12:45:01 up 14 days,  3:12,  load average: 12.50, 8.24, 4.12

$ vmstat 1 3
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 8  0      0 2112.5 1402.5 1202.4    0    0     0     0 1200 4500 95  5  0  0  0`,
      analysis: 'Load Average가 가용한 CPU 코어 수(예: 4코어)보다 훨씬 높은 12.50에 도달했습니다. vmstat 분석 결과 대기 큐(r)에 8개의 프로세스가 계속 대기 중이며, us(유저 스페이스) CPU 점유율이 95%에 달해 연산 자원이 완전히 고갈된 CPU Saturation 상태입니다.'
    },
    memory: {
      label: 'Memory Pressure (메모리 압박)',
      console: `$ free -h
              total        used        free      shared  buff/cache   available
Mem:           16Gi        15Gi       120Mi       1.2Gi       800Mi       250Mi
Swap:         4.0Gi       3.8Gi       200Mi

$ vmstat 1 3
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 2  1 3800.5  120.2  140.5  659.8  256  512   512  1024 1500 8000 10 25  0 65  0`,
      analysis: '가용 메모리(available)가 250MiB로 위험한 수준입니다. 특히 vmstat 지표 상 물리 메모리와 스왑 영역 간의 페이지 전송인 si(Swap-in) 및 so(Swap-out)가 끊임없이 발생하여 IOWait(wa)가 65%까지 상승한 메모리 스래싱(Thrashing) 상태입니다.'
    },
    disk: {
      label: 'Disk I/O Saturation (디스크 I/O 포화)',
      console: `$ iostat -xz 1 1
Device:         rrqm/s   wrqm/s     r/s     w/s    rkB/s    wkB/s aqu-sz  await  svctm  %util
sda               0.00    42.00  850.00  420.00  85200.0  42400.0  12.50  35.20   0.80  98.50`,
      analysis: '스토리지 디바이스 sda의 I/O 사용률(%util)이 98.5%에 도달해 디스크 성능이 한계에 직면했습니다. 평균 입출력 지연 시간(await) 또한 35.2ms로 크게 늘어나 전체 애플리케이션의 블로킹 및 응답 속도 저하를 유발하는 주원인입니다.'
    },
    network: {
      label: 'Network Bottleneck (네트워크 대역폭 포화)',
      console: `$ ss -s
Total: 15400
TCP:   15200 (estab 12000, closed 200, orphaned 12, timewait 3000)

$ sar -n DEV 1 1
12:45:01 PM     IFACE   rxpck/s   txpck/s    rxkB/s    txkB/s
12:45:02 PM      eth0  85000.00  92000.00  12500.00  95000.00`,
      analysis: '물리 네트워크 eth0의 대역폭 전송량(txkB/s)이 95MB/s(대략 800Mbps)에 달해 회선 대역폭 포화에 근접했습니다. TCP established 커넥션이 12,000개로 수직 상승하여 포트 고갈 및 패킷 지연이 발생하고 있습니다.'
    }
  };

  const memoryLeakData = {
    growth: {
      label: 'Memory Leak Timeline (메모리 증가 추이)',
      console: `[Process Memory Consumption Trend Over 24 Hours]

Timestamp   RSS (Physical)   VSZ (Virtual)    Swap Used   State
-----------------------------------------------------------------
00:00 KST   1.2 GiB          4.5 GiB          120 MiB     [OK] Healthy
04:00 KST   2.5 GiB          6.2 GiB          240 MiB     [OK] Growing
08:00 KST   4.8 GiB          8.5 GiB          512 MiB     [WARNING] Swap Active
12:00 KST   8.2 GiB          12.0 GiB         1.2 GiB     [WARNING] Latency Up
16:00 KST   14.5 GiB         18.5 GiB         2.8 GiB     [CRITICAL] Thrashing
20:00 KST   15.8 GiB         20.2 GiB         3.9 GiB     [CRITICAL] Out of Swap
20:05 KST   --> [ KILLED BY KERNEL OOM KILLER (Exit Code 137) ] <--`,
      analysis: '시간 경과에 따라 프로세스의 물리 메모리 사용량(RSS)이 회수되지 않고 점진적으로 계단식 우상향을 그리는 전형적인 메모리 누수(Memory Leak) 프로파일입니다. 결국 시스템 가용 자원이 고갈되자 스왑 공간까지 전부 잠식하여 OOM 강제 종료를 유발했습니다.'
    },
    pmap: {
      label: 'pmap Memory Mapping (pmap 메모리 맵)',
      console: `$ pmap -x 28410
Address           Kbytes     RSS    Dirty Mode  Mapping
0000000000400000     384     384       0 r-x--  app_server
00007f30a0000000 8520000 8120000 8120000 rw---  [anon] <--- (익명 매핑 팽창)
00007f31c0000000    2048    1204       0 r----  libc.so
----------------  ------  ------  ------
total kB         8654200 8245800 8235200`,
      analysis: 'pmap 분석 결과 특정 익명 메모리 영역([anon])이 무려 8.1GiB의 물리 메모리(RSS)와 Dirty 영역을 점유하고 있습니다. Dirty는 프로세스에 의해 수정되어 물리 메모리상에 보관 중인 실데이터로, 이 힙 메모리 세그먼트가 늘어나는 현상이 바로 메모리 누수의 증거입니다.'
    },
    oom: {
      label: 'dmesg OOM Killer Logs (OOM 시스템 로그)',
      console: `$ dmesg -T | grep -i oom
[Sat Jun 13 20:05:12 2026] oom-kill:constraint=CONSTRAINT_NONE,nodemask=(null),cpuset=/,oom_memcg=no,task_memforce=no
[Sat Jun 13 20:05:12 2026] Out of memory: Killed process 28410 (app_server) total-vm:20200kB, anon-rss:15800kB, file-rss:0kB
[Sat Jun 13 20:05:12 2026] oom_reaper: reaped process 28410 (app_server), now anon-rss:0kB`,
      analysis: '가용 가상 메모리 주소가 소진되자 커널이 시스템 셧다운을 방지하기 위해 oom-kill 연산을 개시했습니다. oom_score가 가장 나빴던 PID 28410 (app_server) 프로세스를 강제로 SIGKILL(9) 하고 시스템 전체 메모리를 강제 환수한 이력이 로그에 포착되었습니다.'
    }
  };

  const processCrashData = {
    status: {
      label: 'Step 1: systemctl status (데몬 상태 검사)',
      console: `$ systemctl status nginx
● nginx.service - The NGINX HTTP and reverse proxy server
   Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled)
   Active: active (running) since Sat 2026-06-13 13:00:20 KST; 10s ago
  Process: 12845 ExecStart=/usr/sbin/nginx (code=exited, status=0/SUCCESS)
  Process: 29810 ExecStop=/usr/sbin/nginx -s stop (code=killed, signal=SEGV, status=139)`,
      analysis: 'Nginx 프로세스가 비정상 종료(Segfault - exit code 139)되었으나, systemd의 자동 실패 복구 정책에 의해 방금 10초 전에 새로운 PID 12845로 다시 자동 실행된 상태입니다. 실무 모니터링 시 서비스가 복구되어 가동 중이더라도 중단 원인을 파헤쳐야 합니다.'
    },
    kernel: {
      label: 'Step 2: journalctl logs (로그 역추적)',
      console: `$ journalctl -u nginx -n 20 --no-pager
Jun 13 13:00:02 web-srv-01 nginx[29810]: 2026/06/13 13:00:02 [alert] 29810: worker process 29812 exited on signal 11 (Segmentation fault) (core dumped)
Jun 13 13:00:02 web-srv-01 systemd[1]: nginx.service: Main process exited, code=killed, status=11/SEGV
Jun 13 13:00:02 web-srv-01 systemd[1]: nginx.service: Failed with result 'signal'.`,
      analysis: '저널 로그에서 Nginx의 특정 워커 스레드가 커널로부터 Signal 11 (Segmentation Fault - 주소 침범) 신호를 받아 다운되었음을 알 수 있습니다. 이 과정에서 메모리 정보를 담은 코어 파일이 덤프되었음도 로그에 명시되어 있습니다.'
    },
    coredump: {
      label: 'Step 3: coredumpctl & gdb (코어 덤프 디버깅)',
      console: `$ coredumpctl list
TIME                            PID   UID   GID SIG EXE     SIZE
Sat 2026-06-13 13:00:02 KST   29812  1001  1001  11 nginx 245.2M

$ gdb /usr/sbin/nginx /var/lib/systemd/coredump/core.nginx.29812
Program terminated with signal 11, Segmentation fault.
#0  ngx_http_process_request (r=0x0) at src/http/ngx_http_request.c:1240
1240:     if (r->connection->ssl) {`,
      analysis: 'coredumpctl을 기동해 당시 덤프 파일로 gdb 디버거를 연결한 모습입니다. ngx_http_request.c의 1240번 라인에서 r 객체가 0x0(Null)인데 SSL 포인터를 해제하려던 중 메모리 소유권 위반(Null Pointer Dereference) 에러로 사망했음을 최종 확진했습니다.'
    },
    systemd: {
      label: 'Step 4: Restart Policy (데몬 복구 구성)',
      console: `$ cat /etc/systemd/system/nginx.service.d/override.conf
[Service]
Restart=always
RestartSec=5s
StartLimitIntervalSec=300s
StartLimitBurst=5`,
      analysis: '장애 시 시스템 수준에서 서비스를 무중단 복구하도록 systemd 설정을 튜닝합니다. Restart=always와 더불어, 프로세스 결함으로 무한 재시작되면서 CPU를 백퍼센트 차지하지 않도록 5분(300초) 내 5번 이상 재기동 실패 시 완전 차단(Burst Limit)을 걸어둡니다.'
    }
  };

  const OVERVIEW_DATA = {
    // --- Linux Troubleshooting Scenarios ---
    "linux-q01-server-slow": {
      title: "서버 성능 저하 및 응답 지연 진단",
      icon: "fa-solid fa-gauge-simple-high",
      summary: "서비스 운영 중 서버가 갑자기 느려지는 현상이 발생했습니다. 어떤 리소스가 병목이며, 장애 근본 원인이 어디에 있는지를 빠르게 찾아내는 모니터링 분석 능력을 시험합니다.",
      questions: [
        "서버가 갑자기 느려졌을 때 최초 실행하는 3가지 진단 명령은?",
        "Load Average 수치가 의미하는 바와 CPU Core 수의 상관관계는?",
        "CPU 사용량은 낮은데 Load Average만 매우 높은 원인은?"
      ],
      skills: [
        "top / htop을 활용한 CPU, Load Average, 프로세스 우선순위 확인",
        "vmstat을 활용한 컨텍스트 스위칭 및 메모리 스와핑(si, so) 분석",
        "iostat -x 1을 활용한 스토리지 대기(%util, await)와 I/O 병목 식별"
      ]
    },
    "linux-q02-cpu-100": {
      title: "CPU 점유율 100% 임계치 도달 대응",
      icon: "fa-solid fa-fire-flame-simple",
      summary: "특정 프로세스가 CPU 자원을 전체 점유하여 서비스 중단을 유발하고 있습니다. CPU 과점유를 유발한 스레드를 식별하고 프로세스를 진단하는 복구 시나리오입니다.",
      questions: [
        "User Space (us) vs Kernel Space (sy) CPU 과점유의 근본적 차이는?",
        "프로세스 내부에서 특정 스레드가 CPU를 100% 쓰고 있는지 확인하는 방법은?",
        "IOWait (wa) 수치가 높을 때 취할 수 있는 구체적인 해결 단계는?"
      ],
      skills: [
        "top -H를 사용한 프로세스 내 개별 스레드 CPU 사용량 모니터링",
        "ps aux --sort=-%cpu | head 명령을 통한 TOP CPU 점유 프로세스 탐색",
        "strace, gstack을 활용하여 커널 영역에서 스레드가 멈춘 원인 분석"
      ]
    },
    "linux-q03-memory-leak": {
      title: "지속적인 메모리 증가 및 OOM(Out of Memory) 진단",
      icon: "fa-solid fa-memory",
      summary: "시간이 지남에 따라 가용 메모리가 계속 감소하여 서비스 프로세스가 OOM Killer에 의해 강제 종료될 위기입니다. 정상적인 버퍼/캐시 사용과 비정상적인 메모리 누수를 감지해야 합니다.",
      questions: [
        "Linux free 명령에서 'used'와 'available'의 차이점은 무엇인가?",
        "메모리 누수(Memory Leak)가 의심되는 프로세스의 실제 메모리 할당(pmap) 확인법은?",
        "시스템이 메모리 고갈로 어떤 프로세스를 종료했는지 dmesg를 통해 확인하는 법은?"
      ],
      skills: [
        "free -h를 사용한 가용 메모리(available)와 버퍼/캐시(buff/cache) 모니터링",
        "pmap -x <pid>를 사용한 프로세스의 가상 메모리 맵 및 물리 메모리(RSS) 점유 확인",
        "dmesg | grep -i oom / journalctl을 사용한 OOM Killer 실행 기록 추적"
      ]
    },
    "linux-q04-disk-full": {
      title: "디스크 사용률 100% 및 삭제 파일 FD 점유 상황 조치",
      icon: "fa-solid fa-hard-drive",
      summary: "디스크 사용률이 100%에 다다랐으나, 불필요한 대용량 로그 파일을 삭제(rm)했는데도 공간이 확보되지 않는 실무 단골 장애 시나리오입니다. 파일 서술자(FD) 회수법을 익힙니다.",
      questions: [
        "df -h 명령에서는 디스크가 100%인데, du -sh에서는 용량이 남는 현상의 원인은?",
        "이미 삭제된 파일이지만 프로세스가 연결을 끊지 않고 있는 파일 탐색법은?",
        "원인 프로세스를 재시작하지 않고 디스크 공간을 즉시 회수하는 우회 명령은?"
      ],
      skills: [
        "df -h 및 du -ah / | sort -rh 조합을 통한 디스크 사용량 분석 및 원인 파일 식별",
        "lsof | grep deleted 명령을 활용해 열린 채 삭제된 파일 서술자(FD) 식별",
        "echo '' > /proc/<pid>/fd/<fd_num> 리디렉션을 통한 무중단 파일 데이터 비우기"
      ]
    },
    "linux-q05-process-crash": {
      title: "중요 서비스 프로세스 갑작스러운 다운 대응",
      icon: "fa-solid fa-skull-crossbones",
      summary: "Nginx, Kubelet 같은 핵심 서비스 데몬이 예기치 않게 종료되어 서비스 중단이 발생했습니다. 서비스 신속 복구와 다운 원인 규명(RCA)을 체계적으로 진행해야 합니다.",
      questions: [
        "크리티컬 프로세스 종료 시 SRE로서 복구와 원인 분석의 우선순위는 어떻게 두는가?",
        "프로세스가 OS 시그널(예: SIGKILL, SIGSEGV)로 강제 종료되었는지 어떻게 진단하는가?",
        "비정상 종료된 프로세스의 Core Dump 수집 및 디버깅 설정 방법은?"
      ],
      skills: [
        "systemctl status, journalctl -u를 통한 시스템 로그 및 서비스 종료 사유 분석",
        "dmesg, /var/log/messages를 분석하여 커널 수준의 종료 원인(OOM, Panic 등) 판별",
        "gdb를 활용한 Core Dump 파일 역추적 및 프로세스 비정상 종료 시나리오 분석"
      ]
    },
    "linux-commands-deep-dive": {
      title: "SRE 실무 필수 진단 커맨드 Deep Dive",
      icon: "fa-solid fa-toolbox",
      summary: "Linux 환경에서 트러블슈팅의 뼈대가 되는 10가지 기본 진단 도구들의 실무적인 사용 타이밍과 결과 분석, 면접 질문 대비 가이드입니다.",
      questions: [
        "모니터링 시 top과 htop의 강점 차이는 무엇인가?",
        "lsof와 ss(netstat) 명령의 SRE 실무적 쓰임새는 어떻게 다른가?",
        "시스템의 역사적 기록(sar)을 분석하여 과거 특정 시간대 장애를 밝히는 방법은?"
      ],
      skills: [
        "top/htop, ps, free, vmstat을 조합한 시스템 리소스 종합 프로파일링",
        "iostat, sar, ss, lsof를 활용한 디스크/네트워크 인터페이스 병목 입체적 격리",
        "journalctl을 활용한 프로세스 생명주기 및 시스템 에러 이벤트 통합 탐색"
      ]
    },

    // --- Coding Practice Problems ---
    "coding-day01-top3-ip": {
      title: "대용량 접속 로그 파일 내 최다 방문 IP 집계",
      icon: "fa-solid fa-file-invoice",
      summary: "수백 MB에서 수십 GB에 이르는 대용량 웹 서버 로그 파일에서 가장 요청이 잦은 상위 3개 IP 주소와 빈도를 효율적으로 집계하는 코딩 문제입니다.",
      questions: [
        "100GB 이상의 로그 파일을 다룰 때 메모리 초과를 방지하는 파일 읽기 전략은?",
        "상위 K개 결과를 정렬할 때 heapq(힙)을 사용하면 전체 정렬보다 나은 이유는?",
        "스트리밍 방식으로 전송되는 로그를 처리할 때의 시간 복잡도 설계 방식은?"
      ],
      skills: [
        "Python collections.Counter를 활용한 고성능 주소 빈도 누적 집계",
        "제너레이터를 활용하여 한 줄씩 파일을 읽어들이는 메모리 절약형(Line Streaming) I/O",
        "가장 빈번한 아이템 추출 시 nlargest() 또는 dict 정렬 기법을 적용한 O(N log K) 최적화"
      ]
    },
    "coding-day02-error-count": {
      title: "서비스 로그 기반 ERROR 빈도 그룹화 및 집계",
      icon: "fa-solid fa-triangle-exclamation",
      summary: "시스템 로그 파일에서 에러 수준의 메시지를 파싱하여 각 서비스별(Nginx, App, DB 등) 발생 빈도를 합산하는 실무형 문자열 데이터 파싱 연습입니다.",
      questions: [
        "특정 로그 라인이 불완전하거나 비정상 데이터 포맷을 가질 때의 예외 처리 방식은?",
        "다수의 키-값 누적을 유연하게 처리하기 위한 defaultdict 활용법은?",
        "정규표현식(re) 대신 문자열 split()을 활용하는 것이 유리한 상황은?"
      ],
      skills: [
        "with open 컨텍스트 매니저를 통한 무결한 파일 I/O 스트림 제어",
        "collections.defaultdict를 사용한 복합 키 구조 기반의 카테고리별 누적 카운트",
        "try-except 구문을 통한 예외 로그 필터링 및 프로덕션 급 예외 방어 설계"
      ]
    },
    "coding-day03-json-metrics": {
      title: "구조화된 JSON 로그 분석 및 서비스 메트릭 연산",
      icon: "fa-solid fa-diagram-project",
      summary: "다양한 마이크로서비스에서 흘러오는 비정형/정형 JSON 로그 스트림을 해석하여 서비스별 총 요청 수, 지연시간 평균, 에러 집계를 도출하는 실무형 파서 설계입니다.",
      questions: [
        "JSON 파싱 에러(json.JSONDecodeError)가 발생했을 때 로깅 및 우회 전략은?",
        "대량의 로그 연산 시 메모리에 모든 지연시간 리스트를 유지하지 않고 평균을 구하는 O(1) 공식은?",
        "JSON 내 필수 필드가 누락(KeyError)된 경우의 방어적 설계 방식은?"
      ],
      skills: [
        "json.loads() 및 json.JSONDecodeError 예외 처리를 통한 불량 데이터 파싱 복원력 확보",
        "누적합(Sum)과 개수(Count)를 활용한 저메모리 실시간 평균 지연 시간(Average Latency) 계산",
        "Dictionary `.get()` 메서드 및 Default Value 바인딩을 적용한 견고한 필드 에러 방어"
      ]
    },
    "coding_preparation_master_plan": {
      title: "SRE / Platform Engineering 코딩 면접 마스터 플랜",
      icon: "fa-solid fa-map",
      summary: "알고리즘 대회식 하드코딩이 아닌, 인프라 자동화와 데이터 집계, 시스템 파일 처리에 중점을 둔 SRE 스타일 코딩 시험의 전반적인 학습 지도와 핵심 합격 전략을 제시합니다.",
      questions: [
        "SRE 코딩 인터뷰가 LeetCode형 소프트웨어 개발자 인터뷰와 다른 핵심 초점은?",
        "면접관 앞에서 라이브 코딩을 진행할 때 반드시 발휘해야 하는 SRE형 의사소통은?",
        "시간 복잡도 외에 공간 복잡도(Memory footprint)를 중요시하는 이유는 무엇인가?"
      ],
      skills: [
        "파일 I/O, 데이터 파싱, Counter, defaultdict, heapq 등 SRE 필수 Python 기본 모듈 완벽 적응",
        "현실적인 디스크/메모리 하드웨어 제약 상황(예: 대용량 로그)에서의 솔루션 최적화 연습",
        "문제 조건 정의, 에지 케이스 분석, 예외 처리 설계 등을 논리적으로 면접관에게 설명하는 면접 기법"
      ]
    }
  };

  // Initialize UI Settings
  initSettings();

  // Event Listeners
  el.menuToggle.addEventListener('click', toggleSidebar);
  el.themeToggle.addEventListener('change', toggleTheme);
  el.activeRecallToggle.addEventListener('change', toggleActiveRecall);
  el.quickRecallToggle.addEventListener('change', toggleQuickRecall);
  el.searchInput.addEventListener('input', handleSearch);

  // Top Category Nav Switcher
  el.topNavTabs.querySelectorAll('.top-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.topNavTabs.querySelectorAll('.top-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentCategory = btn.dataset.category;
      localStorage.setItem('study_app_current_category', state.currentCategory);
      
      if (state.quickRecall) {
        state.quickRecall = false;
        el.quickRecallToggle.checked = false;
        toggleQuickRecallClass(false);
      }

      if (state.currentCategory === 'Dashboard') {
        state.currentFileId = null;
        renderNavigation();
        renderDashboardLayout();
      } else {
        renderNavigation();
        
        const categoryFiles = STUDY_DATA.filter(d => d.category === state.currentCategory);
        if (categoryFiles.length > 0) {
          const lastViewed = localStorage.getItem(`last_viewed_file_${state.currentCategory}`);
          const fileExists = categoryFiles.some(d => d.id === lastViewed);
          loadDocument(fileExists ? lastViewed : categoryFiles[0].id);
        } else {
          renderEmptyState();
        }
      }
    });
  });

  // Close sidebar on mobile when clicking main content
  el.mainContent.addEventListener('click', (e) => {
    if (window.innerWidth <= 900 && el.sidebar.classList.contains('open') && !el.menuToggle.contains(e.target)) {
      el.sidebar.classList.remove('open');
    }
  });

  // Render Initial Navigation
  renderNavigation();

  // Load Initial Document
  if (state.quickRecall) {
    renderQuickRecallDeck();
  } else if (state.currentCategory === 'Dashboard') {
    renderDashboardLayout();
  } else {
    const categoryFiles = STUDY_DATA.filter(d => d.category === state.currentCategory);
    if (categoryFiles.length > 0) {
      const lastViewed = localStorage.getItem(`last_viewed_file_${state.currentCategory}`);
      const fileExists = categoryFiles.some(d => d.id === lastViewed);
      loadDocument(fileExists ? lastViewed : categoryFiles[0].id);
    } else {
      renderDashboardLayout();
    }
  }

  // --- Core Functions ---

  function initSettings() {
    el.topNavTabs.querySelectorAll('.top-tab-btn').forEach(btn => {
      if (btn.dataset.category === state.currentCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    el.activeRecallToggle.checked = state.activeRecall;
    el.quickRecallToggle.checked = state.quickRecall;
    toggleQuickRecallClass(state.quickRecall);
    
    if (state.theme === 'light') {
      document.body.classList.add('light-theme');
      el.themeToggle.checked = true;
    }
  }

  function toggleSidebar() {
    el.sidebar.classList.toggle('open');
  }

  function toggleTheme(e) {
    if (e.target.checked) {
      document.body.classList.add('light-theme');
      state.theme = 'light';
    } else {
      document.body.classList.remove('light-theme');
      state.theme = 'dark';
    }
    localStorage.setItem('study_app_theme', state.theme);
  }

  function toggleActiveRecall(e) {
    state.activeRecall = e.target.checked;
    localStorage.setItem('active_recall_enabled', state.activeRecall);
    if (state.currentFileId) {
      loadDocument(state.currentFileId);
    }
  }

  function toggleQuickRecall(e) {
    state.quickRecall = e.target.checked;
    localStorage.setItem('quick_recall_enabled', state.quickRecall);
    toggleQuickRecallClass(state.quickRecall);
    
    if (state.quickRecall) {
      renderQuickRecallDeck();
    } else {
      if (state.currentFileId && state.currentCategory !== 'Dashboard') {
        loadDocument(state.currentFileId);
      } else {
        renderNavigation();
        if (state.currentCategory === 'Dashboard') {
          renderDashboardLayout();
        } else {
          const categoryFiles = STUDY_DATA.filter(d => d.category === state.currentCategory);
          if (categoryFiles.length > 0) {
            loadDocument(categoryFiles[0].id);
          } else {
            renderEmptyState();
          }
        }
      }
    }
  }

  function toggleQuickRecallClass(enabled) {
    if (enabled) {
      document.body.classList.add('quick-recall-mode');
    } else {
      document.body.classList.remove('quick-recall-mode');
    }
  }

  function handleSearch(e) {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderNavigation();
  }

  function getStatus(fileId) {
    if (state.statusMap[fileId]) {
      return state.statusMap[fileId];
    }
    const item = STUDY_DATA.find(d => d.id === fileId);
    return item ? (item.status || 'Studying') : 'Studying';
  }

  function updateStatus(fileId, newStatus) {
    state.statusMap[fileId] = newStatus;
    localStorage.setItem('study_app_status_map', JSON.stringify(state.statusMap));
    const badge = document.querySelector(`.nav-item[data-id="${fileId}"] .nav-badge`);
    if (badge) {
      badge.className = `nav-badge badge-${newStatus.toLowerCase()}`;
      badge.textContent = newStatus;
    }
  }

  function getSequencePrefix(id) {
    if (id.startsWith('fq')) {
      const m = id.match(/^fq(\d+)/);
      return m ? `FQ${m[1]}. ` : '';
    }
    if (id.startsWith('q')) {
      const m = id.match(/^q(\d+)/);
      return m ? `Q${m[1]}. ` : '';
    }
    if (id.startsWith('linux-q')) {
      const m = id.match(/^linux-q(\d+)/);
      return m ? `Linux ${parseInt(m[1])}. ` : '';
    }
    if (id === 'linux-commands-deep-dive') {
      return 'Linux 6. ';
    }
    if (id.startsWith('network-q')) {
      const m = id.match(/^network-q(\d+)/);
      return m ? `Network ${parseInt(m[1])}. ` : '';
    }
    if (id.startsWith('cloud-q')) {
      const m = id.match(/^cloud-q(\d+)/);
      return m ? `Cloud ${parseInt(m[1])}. ` : '';
    }
    if (id.startsWith('k8s-q')) {
      const m = id.match(/^k8s-q(\d+)/);
      return m ? `K8s ${parseInt(m[1])}. ` : '';
    }
    if (id.startsWith('gpu-q')) {
      const m = id.match(/^gpu-q(\d+)/);
      return m ? `GPU ${parseInt(m[1])}. ` : '';
    }
    if (id.startsWith('sd-q')) {
      const m = id.match(/^sd-q(\d+)/);
      return m ? `SysDesign ${parseInt(m[1])}. ` : '';
    }
    if (id.startsWith('coding-day')) {
      const m = id.match(/^coding-day(\d+)/);
      return m ? `Coding ${parseInt(m[1])}. ` : '';
    }
    if (id.includes('plan')) {
      return 'Plan. ';
    }
    if (id.includes('deep-dive')) {
      return 'Deep Dive. ';
    }
    return '';
  }

  function getDocumentDisplayTitle(doc) {
    let title = doc.title;
    if (OVERVIEW_DATA[doc.id]) {
      title = OVERVIEW_DATA[doc.id].title;
    } else if (doc.sections && doc.sections.length > 0) {
      const firstSec = doc.sections[0];
      const skipTitles = ["goal", "theme", "general", "importance", "frequency", "probability", "status"];
      if (firstSec.title && !skipTitles.includes(firstSec.title.toLowerCase())) {
        title = firstSec.title;
      }
    }

    title = title
      .replace(/^(?:Follow-up\s+)?Question\s+\d+\s*-\s*/gi, '')
      .replace(/^(?:Follow-up\s+)?Question\s+\d+\s*:\s*/gi, '')
      .replace(/^Linux\s+Interview\s+Question\s+\d+\s*-\s*/gi, '')
      .replace(/^Linux\s+Interview\s+Question\s+\d+\s*:\s*/gi, '')
      .replace(/^Coding\s+Day\s+\d+\s*-\s*/gi, '')
      .replace(/^Day\s+\d+\s*-\s*/gi, '')
      .replace(/Interview Question\s+\d+\s*-\s*/gi, '')
      .replace(/Interview Question\s+\d+\s*:\s*/gi, '')
      .trim();

    return getSequencePrefix(doc.id) + title;
  }

  function buildInterlinearHTML(englishHTML, koreanHTML) {
    if (!englishHTML) return koreanHTML || '';
    if (!koreanHTML) return '';

    const divEng = document.createElement('div');
    divEng.innerHTML = englishHTML;
    
    const divKor = document.createElement('div');
    divKor.innerHTML = koreanHTML;
    
    const engNodes = Array.from(divEng.children);
    const korNodes = Array.from(divKor.children);
    
    let combinedHTML = '';
    const maxLen = Math.max(engNodes.length, korNodes.length);
    
    for (let i = 0; i < maxLen; i++) {
      const engNode = engNodes[i];
      const korNode = korNodes[i];
      
      if (engNode) {
        combinedHTML += `<div class="interlinear-eng" style="font-size: 0.92rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 4px;">${engNode.outerHTML}</div>`;
      }
      if (korNode) {
        combinedHTML += `<div class="interlinear-kor" style="font-size: 0.98rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 24px; font-weight: 500;">${korNode.outerHTML}</div>`;
      }
    }
    
    return combinedHTML;
  }

  function convertToInterlinear(htmlContent) {
    if (!htmlContent) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const targets = tempDiv.querySelectorAll('p, li, h3, h4, h5');
    targets.forEach(node => {
      const html = node.innerHTML.trim();
      if (html.includes('<br>')) {
        const parts = html.split('<br>').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          let newHTML = '';
          for (let i = 0; i < parts.length; i += 2) {
            const eng = parts[i];
            const kor = parts[i+1];
            if (eng) {
              newHTML += `<span class="interlinear-eng" style="display:block; font-size: 0.92rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 4px;">${eng}</span>`;
            }
            if (kor) {
              newHTML += `<span class="interlinear-kor" style="display:block; font-size: 0.98rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 8px; font-weight: 500;">${kor}</span>`;
            }
          }
          node.innerHTML = newHTML;
        }
      }
    });
    
    return tempDiv.innerHTML;
  }

  function renderNavigation() {
    el.navMenu.innerHTML = '';
    
    if (state.currentCategory === 'Dashboard') {
      el.navMenu.innerHTML = `
        <div class="category-group">
          <div class="category-title">Workstation Hub</div>
          <button class="nav-item active">
            <span><i class="fa-solid fa-chart-pie" style="margin-right:8px;"></i> Overall Metrics</span>
          </button>
          <div style="padding: 16px; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
            SRE Workstation Dashboard가 활성화되어 있습니다. 전체 면접 준비 현황, 학습 연속일, 카테고리별 마스터 점수를 한눈에 점검해 볼 수 있습니다.
          </div>
        </div>
      `;
      return;
    }

    const filteredData = STUDY_DATA.filter(item => {
      if (item.category !== state.currentCategory) return false;
      const titleMatches = item.title.toLowerCase().includes(state.searchQuery);
      const codeMatches = item.sections.some(s => s.content.toLowerCase().includes(state.searchQuery));
      return titleMatches || codeMatches;
    });

    if (filteredData.length === 0) {
      el.navMenu.innerHTML = '<div class="empty-state"><div class="empty-state-title">검색 결과가 없습니다</div></div>';
      return;
    }

    // Sort in ascending order of sequence prefix or ID, grouping follow-up questions
    filteredData.sort((a, b) => {
      const getWeight = (id) => {
        if (id.includes('plan')) {
          return 0;
        }
        if (id.startsWith('q')) {
          const m = id.match(/^q(\d+)/);
          return m ? parseInt(m[1]) * 10 : 1000;
        }
        if (id.startsWith('fq')) {
          const m = id.match(/^fq(\d+)/);
          // Group fq items right after Q1 (weights 11 to 16)
          return m ? 10 + parseInt(m[1]) : 1000;
        }
        if (id.startsWith('linux-q')) {
          const m = id.match(/^linux-q(\d+)/);
          return m ? parseInt(m[1]) : 500;
        }
        if (id === 'linux-commands-deep-dive') {
          return 6;
        }
        if (id.startsWith('coding-day')) {
          const m = id.match(/^coding-day(\d+)/);
          return m ? parseInt(m[1]) : 500;
        }
        return 9999;
      };

      return getWeight(a.id) - getWeight(b.id);
    });

    const listDiv = document.createElement('div');
    listDiv.className = 'category-group';
    const categoryLabel = {
      "Behavioral": "Behavioral Questions",
      "Linux": "Linux Scenarios",
      "Networking": "Networking Scenarios",
      "Cloud": "Cloud Engineering",
      "Kubernetes": "Kubernetes Scenarios",
      "GPU & AI Infrastructure": "GPU & AI Infrastructure Scenarios",
      "Coding": "Coding Exercises",
      "System Design": "System Design Scenarios"
    }[state.currentCategory] || "Documents";

    const title = document.createElement('div');
    title.className = 'category-title';
    title.textContent = categoryLabel;
    listDiv.appendChild(title);

    filteredData.forEach(item => {
      const itemBtn = document.createElement('button');
      itemBtn.className = 'nav-item';
      if (item.id === state.currentFileId) {
        itemBtn.classList.add('active');
      }
      itemBtn.dataset.id = item.id;
      
      const displayTitle = getDocumentDisplayTitle(item);
      
      const titleSpan = document.createElement('span');
      titleSpan.textContent = displayTitle;
      titleSpan.style.flex = '1';
      titleSpan.style.whiteSpace = 'normal';
      titleSpan.style.wordBreak = 'break-word';
      titleSpan.style.paddingRight = '8px';
      titleSpan.style.lineHeight = '1.3';
      itemBtn.appendChild(titleSpan);

      const status = getStatus(item.id);
      const badgeSpan = document.createElement('span');
      badgeSpan.className = `nav-badge badge-${status.toLowerCase()}`;
      badgeSpan.textContent = status;
      itemBtn.appendChild(badgeSpan);

      itemBtn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        itemBtn.classList.add('active');
        loadDocument(item.id);
        if (window.innerWidth <= 900) {
          el.sidebar.classList.remove('open');
        }
      });

      listDiv.appendChild(itemBtn);
    });
    el.navMenu.appendChild(listDiv);
  }

  function loadDocument(fileId) {
    state.currentFileId = fileId;
    localStorage.setItem(`last_viewed_file_${state.currentCategory}`, fileId);

    const doc = STUDY_DATA.find(d => d.id === fileId);
    if (!doc) return;

    el.contentArea.classList.remove('wide-layout');

    // Layout routers
    if (doc.category === "Behavioral" && doc.sections.length > 2) {
      renderBehavioralLayout(doc);
    } else if (doc.category === "Linux" && doc.sections.length > 2) {
      renderLinuxLayout(doc);
    } else if (doc.category === "Coding" && doc.id !== 'coding_preparation_master_plan') {
      renderCodingLayout(doc);
    } else {
      renderGeneralLayout(doc);
    }

    // Syntax highlighting trigger
    if (window.hljs) {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }

    bindCopyButtons();
  }

  // --- Specialized Renderers ---

  // 1. BEHAVIORAL INTERVIEW RENDERER (Includes Flip Cards for Follow-ups)
  function renderBehavioralLayout(doc) {
    const currentStatus = getStatus(doc.id);

    const intent = doc.sections.find(s => s.title.includes("Intent"));
    const english = doc.sections.find(s => s.title.includes("English") || s.title.includes("Answer"));
    const korean = doc.sections.find(s => s.title.includes("Korean"));
    const expressions = doc.sections.find(s => s.title.includes("Expressions"));
    const followups = doc.sections.find(s => s.title.includes("Follow-up"));
    const notes = doc.sections.find(s => s.title.includes("Notes"));

    let html = buildHeaderHTML(doc, currentStatus);

    // Main Answer split tab card
    html += `
      <div class="study-card">
        <div class="card-tabs">
          <button class="tab-btn active" id="behTabEng">Recommended English Answer</button>
          <button class="tab-btn" id="behTabKor">Korean Summary</button>
        </div>
        <div class="card-body">
          <div class="tab-content active" id="behContentEng">
            ${wrapActiveRecall(english ? english.content : '')}
          </div>
          <div class="tab-content" id="behContentKor">
            ${buildInterlinearHTML(english ? english.content : '', korean ? korean.content : '')}
          </div>
        </div>
      </div>
    `;

    // Intent accordion
    if (intent) {
      html += buildAccordion("Interviewer's Intent (What they actually look for)", intent.content);
    }

    // Interactive Follow-up Question Flip Cards
    if (followups) {
      html += `<h2 style="font-family: var(--font-heading); margin-top:28px; font-size:1.40rem;"><i class="fa-solid fa-graduation-cap" style="color:hsl(var(--accent)); margin-right:8px;"></i> Interactive Follow-up Practice</h2>`;
      html += parseFollowupCards(followups.content);
    }

    // Expressions
    if (expressions) {
      html += `
        <div class="study-card" style="margin-top: 24px;">
          <div class="card-tabs"><span class="tab-btn active" style="cursor:default">Key Speaking Expressions</span></div>
          <div class="card-body">${expressions.content}</div>
        </div>
      `;
    }

    // Notes
    if (notes) {
      html += buildAccordion("Personal Notes & Positioning Strategy", notes.content);
    }

    el.contentArea.innerHTML = html;

    // Tabs listener
    const tEng = document.getElementById('behTabEng');
    const tKor = document.getElementById('behTabKor');
    const cEng = document.getElementById('behContentEng');
    const cKor = document.getElementById('behContentKor');

    if (tEng && tKor) {
      tEng.addEventListener('click', () => {
        tEng.classList.add('active');
        tKor.classList.remove('active');
        cEng.classList.add('active');
        cKor.classList.remove('active');
      });
      tKor.addEventListener('click', () => {
        tKor.classList.add('active');
        tEng.classList.remove('active');
        cKor.classList.add('active');
        cEng.classList.remove('active');
      });
    }

    // Flip card listeners
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });

    bindStatusSelector(doc.id);
  }

  // 2. LINUX TROUBLESHOOTING RENDERER (Terminal Simulator, CPU gauges, Deleted files infographic)
  function renderLinuxLayout(doc) {
    el.contentArea.classList.add('wide-layout');
    const currentStatus = getStatus(doc.id);

    const intent = doc.sections.find(s => s.title.includes("Intent"));
    const flowSection = doc.sections.find(s => s.title.includes("Flow"));
    const commandsSection = doc.sections.find(s => s.title.includes("Commands"));
    const english = doc.sections.find(s => s.title.includes("English") || s.title.includes("Answer"));
    const korean = doc.sections.find(s => s.title.includes("Korean"));
    const causes = doc.sections.find(s => s.title.includes("Causes"));
    const followups = doc.sections.find(s => s.title.includes("Follow-up"));
    const notes = doc.sections.find(s => s.title.includes("Notes"));
    const situation = doc.sections.find(s => s.title.includes("Situation"));
    const taskSec = doc.sections.find(s => s.title.includes("Task"));
    const actionsSec = doc.sections.find(s => s.title.includes("Action"));
    const resultSec = doc.sections.find(s => s.title.includes("Result"));

    let html = buildHeaderHTML(doc, currentStatus);

    // 0. Sleek Interview Question Card
    const interviewQuestion = doc.sections.find(s => s.title.toLowerCase().includes("interview question"));
    if (interviewQuestion) {
      html += `
        <div class="question-card" style="background: var(--card-bg); border-left: 4px solid hsl(var(--accent)); padding: 24px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid var(--border-color); border-left-width: 4px;">
          <div style="font-family: var(--font-heading); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: hsl(var(--accent)); margin-bottom: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-circle-question" style="font-size: 1rem;"></i> Interview Question (실제 질문)
          </div>
          <div class="question-text" style="font-size: 1.15rem; font-weight: 500; line-height: 1.6; color: var(--text-primary);">
            ${interviewQuestion.content}
          </div>
        </div>
      `;
    }

    html += buildOverviewCard(doc.id);

    // 1. Core Concepts & Background Knowledge Accordion (renders unrendered sections early)
    const renderedKeywords = [
      'intent', 'flow', 'commands', 'english', 'answer', 'korean', 'causes',
      'follow-up', 'notes', 'situation', 'task', 'action', 'result',
      'status', 'importance', 'frequency', 'probability', 'difficulty'
    ];

    const unrenderedSections = doc.sections.filter(s => {
      const titleLower = s.title.toLowerCase();
      // Skip sections that match rendered keywords
      if (renderedKeywords.some(kw => titleLower.includes(kw))) {
        return false;
      }
      // Skip the first section (intro question title) and "interview question"
      if (doc.sections.length > 0 && s.title === doc.sections[0].title) {
        return false;
      }
      if (titleLower === 'interview question') {
        return false;
      }
      return true;
    });

    if (unrenderedSections.length > 0) {
      let backgroundHTML = '';
      unrenderedSections.forEach(sec => {
        backgroundHTML += `
          <h3 style="font-family: var(--font-heading); margin-top: 24px; margin-bottom: 12px; font-size: 1.15rem; color: hsl(var(--accent)); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">${sec.title}</h3>
          <div style="margin-bottom: 24px;">
            ${convertToInterlinear(sec.content)}
          </div>
        `;
      });
      html += buildAccordion("Core Concepts & Background Knowledge (핵심 배경지식 및 관련 개념)", backgroundHTML);
    }

    // A. Visual Flowchart Nodes
    if (flowSection) {
      const flowText = flowSection.content.replace(/<[^>]*>/g, '').trim();
      const steps = flowText.split(/↓|&darr;/g).map(s => s.trim()).filter(Boolean);
      
      if (steps.length > 1) {
        html += '<h2 style="font-family: var(--font-heading); margin-bottom:12px; font-size:1.30rem;"><i class="fa-solid fa-route" style="color:hsl(var(--accent)); margin-right:8px;"></i> Troubleshooting Investigation Roadmap</h2>';
        let flowHTML = '<div class="flowchart-container">';
        steps.forEach((step, idx) => {
          flowHTML += `<div class="flowchart-node">${step}</div>`;
          if (idx < steps.length - 1) {
            flowHTML += '<div class="flowchart-arrow"><i class="fa-solid fa-arrow-right"></i></div>';
          }
        });
        flowHTML += '</div>';
        html += flowHTML;
      }
    }

    // B. SPECIALIZED LINUX COMPONENT RENDER ROUTING
    if (doc.id === 'linux-commands-deep-dive') {
      // RENDER COMPONENT 1: Interactive Terminal Simulator
      html += `
        <h2 style="font-family: var(--font-heading); margin-bottom:12px; font-size:1.30rem;"><i class="fa-solid fa-terminal" style="color:#10b981; margin-right:8px;"></i> Monitored Console Sandbox (Hover metrics for explanations)</h2>
        <div class="mock-terminal-wrapper">
          <div class="terminal-tab-bar" id="termTabBar">
            <button class="terminal-tab active" data-tab="top">top</button>
            <button class="terminal-tab" data-tab="free">free -h</button>
            <button class="terminal-tab" data-tab="iostat">iostat -x 1</button>
            <button class="terminal-tab" data-tab="lsof">lsof | grep deleted</button>
          </div>
          <div class="terminal-screen">
            <div class="terminal-prompt" style="color:#10b981; font-weight:bold; margin-bottom:12px;" id="termCommandHeader">top</div>
            <pre><code id="terminalConsoleOutput">${terminalSimData.top.output}</code></pre>
          </div>
        </div>
      `;
    } else if (doc.id === 'linux-q01-server-slow') {
      // RENDER COMPONENT 4: Interactive Bottleneck Diagnostic Sandbox
      html += `
        <h2 style="font-family: var(--font-heading); margin-bottom:12px; font-size:1.30rem;"><i class="fa-solid fa-gauge-simple-high" style="color:hsl(var(--accent)); margin-right:8px;"></i> Interactive Bottleneck Diagnostic Sandbox (시스템 병목 진단)</h2>
        <div class="cpu-dial-grid" id="slowServerGrid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 20px;">
          <div class="cpu-dial-card active" data-bottleneck="cpu" style="padding: 16px;">
            <div class="dial-percentage" style="font-size: 1.4rem;"><i class="fa-solid fa-microchip"></i></div>
            <div class="dial-label" style="margin-top: 4px;">CPU Saturation</div>
          </div>
          <div class="cpu-dial-card" data-bottleneck="memory" style="padding: 16px;">
            <div class="dial-percentage" style="font-size: 1.4rem;"><i class="fa-solid fa-memory"></i></div>
            <div class="dial-label" style="margin-top: 4px;">Memory Pressure</div>
          </div>
          <div class="cpu-dial-card" data-bottleneck="disk" style="padding: 16px;">
            <div class="dial-percentage" style="font-size: 1.4rem;"><i class="fa-solid fa-hard-drive"></i></div>
            <div class="dial-label" style="margin-top: 4px;">Disk I/O Saturation</div>
          </div>
          <div class="cpu-dial-card" data-bottleneck="network" style="padding: 16px;">
            <div class="dial-percentage" style="font-size: 1.4rem;"><i class="fa-solid fa-network-wired"></i></div>
            <div class="dial-label" style="margin-top: 4px;">Network Saturation</div>
          </div>
        </div>

        <div class="layout-split" style="margin-bottom: 28px;">
          <div class="layout-left" style="flex:1 1 500px;">
            <div class="mock-terminal-wrapper" style="margin-bottom: 0; height:100%;">
              <div class="terminal-tab-bar"><span class="terminal-tab active" id="slowTerminalTitle">Simulated uptime / vmstat output</span></div>
              <div class="terminal-screen" style="min-height: 220px;">
                <pre><code id="slowConsoleOutput" style="color:#e2e8f0;">${slowServerData.cpu.console}</code></pre>
              </div>
            </div>
          </div>
          <div class="layout-right" style="flex:1 1 300px;">
            <div class="study-card" style="margin-bottom:0; height:100%;">
              <div class="card-tabs"><span class="tab-btn active" style="cursor:default">장애 지표 분석 & 대책</span></div>
              <div class="card-body" id="slowAnalysisText" style="line-height:1.6; font-size:0.9rem;">
                ${slowServerData.cpu.analysis}
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (doc.id === 'linux-q02-cpu-100') {
      // RENDER COMPONENT 2: Interactive CPU Metric Dials
      html += `
        <h2 style="font-family: var(--font-heading); margin-bottom:12px; font-size:1.30rem;"><i class="fa-solid fa-gauge" style="color:hsl(var(--accent)); margin-right:8px;"></i> CPU Utilization Metric Inspector</h2>
        <div class="cpu-dial-grid" id="cpuDialGrid">
          <div class="cpu-dial-card active" data-metric="user">
            <div class="dial-percentage">92%</div>
            <div class="dial-label">User CPU (us)</div>
          </div>
          <div class="cpu-dial-card" data-metric="system">
            <div class="dial-percentage">82%</div>
            <div class="dial-label">System CPU (sy)</div>
          </div>
          <div class="cpu-dial-card" data-metric="iowait">
            <div class="dial-percentage">74%</div>
            <div class="dial-label">IOWait (wa)</div>
          </div>
          <div class="cpu-dial-card" data-metric="steal">
            <div class="dial-percentage">35%</div>
            <div class="dial-label">Steal Time (st)</div>
          </div>
        </div>

        <div class="layout-split" style="margin-bottom: 28px;">
          <div class="layout-left" style="flex:1 1 500px;">
            <div class="mock-terminal-wrapper" style="margin-bottom: 0; height:100%;">
              <div class="terminal-tab-bar"><span class="terminal-tab active">Simulated top output</span></div>
              <div class="terminal-screen" style="min-height: 200px;">
                <pre><code id="cpuConsoleOutput" style="color:#e2e8f0;">${cpuMetricData.user.console}</code></pre>
              </div>
            </div>
          </div>
          <div class="layout-right" style="flex:1 1 300px;">
            <div class="study-card" style="margin-bottom:0; height:100%;">
              <div class="card-tabs"><span class="tab-btn active" style="cursor:default">장애 근본 원인 분석</span></div>
              <div class="card-body" id="cpuCauseText" style="line-height:1.6; font-size:0.9rem;">
                ${cpuMetricData.user.cause}
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (doc.id === 'linux-q03-memory-leak') {
      // RENDER COMPONENT 5: Interactive Memory Leak Analyzer
      html += `
        <h2 style="font-family: var(--font-heading); margin-bottom:12px; font-size:1.30rem;"><i class="fa-solid fa-memory" style="color:hsl(var(--accent)); margin-right:8px;"></i> Interactive Memory Leak Analyzer (메모리 누수 분석기)</h2>
        <div class="cpu-dial-grid" id="memoryLeakGrid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 20px;">
          <div class="cpu-dial-card active" data-view="growth" style="padding: 16px;">
            <div class="dial-percentage" style="font-size: 1.4rem;"><i class="fa-solid fa-chart-line"></i></div>
            <div class="dial-label" style="margin-top: 4px;">Leak Timeline</div>
          </div>
          <div class="cpu-dial-card" data-view="pmap" style="padding: 16px;">
            <div class="dial-percentage" style="font-size: 1.4rem;"><i class="fa-solid fa-map-location-dot"></i></div>
            <div class="dial-label" style="margin-top: 4px;">pmap Allocation</div>
          </div>
          <div class="cpu-dial-card" data-view="oom" style="padding: 16px;">
            <div class="dial-percentage" style="font-size: 1.4rem;"><i class="fa-solid fa-skull"></i></div>
            <div class="dial-label" style="margin-top: 4px;">OOM Killer Logs</div>
          </div>
        </div>

        <div class="layout-split" style="margin-bottom: 28px;">
          <div class="layout-left" style="flex:1 1 500px;">
            <div class="mock-terminal-wrapper" style="margin-bottom: 0; height:100%;">
              <div class="terminal-tab-bar"><span class="terminal-tab active" id="memoryTerminalTitle">Simulated Memory Diagnostic Command</span></div>
              <div class="terminal-screen" style="min-height: 220px;">
                <pre><code id="memoryConsoleOutput" style="color:#e2e8f0;">\${memoryLeakData.growth.console}</code></pre>
              </div>
            </div>
          </div>
          <div class="layout-right" style="flex:1 1 300px;">
            <div class="study-card" style="margin-bottom:0; height:100%;">
              <div class="card-tabs"><span class="tab-btn active" style="cursor:default">메모리 상태 분석 & 트러블슈팅</span></div>
              <div class="card-body" id="memoryAnalysisText" style="line-height:1.6; font-size:0.9rem;">
                \${memoryLeakData.growth.analysis}
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (doc.id === 'linux-q04-disk-full') {
      // RENDER COMPONENT 3: Interactive File Lifecycle Infographic (Deleted Open Files)
      html += `
        <h2 style="font-family: var(--font-heading); margin-bottom:12px; font-size:1.30rem;"><i class="fa-solid fa-circle-exclamation" style="color:#ef4444; margin-right:8px;"></i> Deleted Open Files Lifecycle Infographic</h2>
        <div class="timeline-wrapper">
          <div class="timeline-step active" data-step="1">
            <div class="timeline-number-box">1</div>
            <div class="timeline-info-box">
              <div class="timeline-step-title">로그 파일 급증 (Log Expansion)</div>
              <div class="timeline-step-desc">실행 중인 프로세스(예: Nginx, App)가 /var/log/app.log 등의 특정 로그파일에 과도한 쓰기를 실행해 디스크 용량이 찼다는 알람이 발생합니다.</div>
            </div>
          </div>
          <div class="timeline-step-detail" id="stepDetail1" style="display:block;">
            <h4>재현 및 터미널 출력 확인 명령</h4>
            <pre><code>$ df -h /dev/sda1
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       500G  500G     0 100% /</code></pre>
          </div>

          <div class="timeline-step" data-step="2">
            <div class="timeline-number-box">2</div>
            <div class="timeline-info-box">
              <div class="timeline-step-title">단순 삭제 실행 (rm 파일 삭제)</div>
              <div class="timeline-step-desc">단순 복구를 위해 <code>rm /var/log/app.log</code> 명령어를 실행해 디스크 상에서 로그 파일을 강제로 삭제합니다.</div>
            </div>
          </div>
          <div class="timeline-step-detail" id="stepDetail2">
            <h4>파일은 삭제되었으나 용량은 반환되지 않는 상황</h4>
            <pre><code>$ rm /var/log/app.log
$ du -sh /var/log/app.log
du: cannot access '/var/log/app.log': No such file or directory
$ df -h /dev/sda1
/dev/sda1       500G  500G     0 100% /   # 여전히 용량이 100% 임!</code></pre>
          </div>

          <div class="timeline-step" data-step="3">
            <div class="timeline-number-box">3</div>
            <div class="timeline-info-box">
              <div class="timeline-step-title">파일 기술자(FD) 메모리 점유 현상</div>
              <div class="timeline-step-desc">파일은 지워졌으나 해당 로그를 작성 중이던 프로세스가 닫기(close) 동작을 하지 않아, OS 레벨에서 파일의 실제 디스크 블록을 해제하지 못하는 상태입니다.</div>
            </div>
          </div>
          <div class="timeline-step-detail" id="stepDetail3">
            <h4>lsof 커맨드를 사용한 비회수 삭제 파일 찾기</h4>
            <pre><code>$ lsof | grep deleted
app_server 28410 appuser   4w   REG    8,1 256.4G 294810 /var/log/app.log (deleted)
# 프로세스(28410)가 여전히 파일 서술자를 열어놓고 있음.</code></pre>
          </div>

          <div class="timeline-step" data-step="4">
            <div class="timeline-number-box">4</div>
            <div class="timeline-info-box">
              <div class="timeline-step-title">장애 원인 조치 (Resolution)</div>
              <div class="timeline-step-desc">해당 프로세스(PID: 28410)를 재시작하여 파일 서술자 연결을 해제하거나, <code>/proc</code> 시스템 내 파일 지시자를 직접 비워서 용량을 안전하게 즉각 회수합니다.</div>
            </div>
          </div>
          <div class="timeline-step-detail" id="stepDetail4">
            <h4>프로세스 중지 없이 쉘 프롬프트에서 직접 비우는 명령</h4>
            <pre><code>$ echo "" > /proc/28410/fd/4
$ df -h /dev/sda1
/dev/sda1       500G  244G  256G  49% /   # 디스크 블록 용량이 즉시 확보됨!</code></pre>
          </div>
        </div>
      `;
    } else if (doc.id === 'linux-q05-process-crash') {
      // RENDER COMPONENT 6: Process Crash Debugger
      html += `
        <h2 style="font-family: var(--font-heading); margin-bottom:12px; font-size:1.30rem;"><i class="fa-solid fa-skull-crossbones" style="color:hsl(var(--accent)); margin-right:8px;"></i> Process Crash Debugger (프로세스 크래시 디버거)</h2>
        <div class="cpu-dial-grid" id="processCrashGrid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 20px;">
          <div class="cpu-dial-card active" data-step="status" style="padding: 16px;">
            <div class="dial-percentage" style="font-size: 1.4rem;"><i class="fa-solid fa-heart-crack"></i></div>
            <div class="dial-label" style="margin-top: 4px;">1. Service Status</div>
          </div>
          <div class="cpu-dial-card" data-step="kernel" style="padding: 16px;">
            <div class="dial-percentage" style="font-size: 1.4rem;"><i class="fa-solid fa-file-waveform"></i></div>
            <div class="dial-label" style="margin-top: 4px;">2. Journal Logs</div>
          </div>
          <div class="cpu-dial-card" data-step="coredump" style="padding: 16px;">
            <div class="dial-percentage" style="font-size: 1.4rem;"><i class="fa-solid fa-bug"></i></div>
            <div class="dial-label" style="margin-top: 4px;">3. Core Dump/GDB</div>
          </div>
          <div class="cpu-dial-card" data-step="systemd" style="padding: 16px;">
            <div class="dial-percentage" style="font-size: 1.4rem;"><i class="fa-solid fa-shield-halved"></i></div>
            <div class="dial-label" style="margin-top: 4px;">4. Restart Policy</div>
          </div>
        </div>

        <div class="layout-split" style="margin-bottom: 28px;">
          <div class="layout-left" style="flex:1 1 500px;">
            <div class="mock-terminal-wrapper" style="margin-bottom: 0; height:100%;">
              <div class="terminal-tab-bar"><span class="terminal-tab active" id="crashTerminalTitle">Crash Investigation Step Output</span></div>
              <div class="terminal-screen" style="min-height: 220px;">
                <pre><code id="crashConsoleOutput" style="color:#e2e8f0;">\${processCrashData.status.console}</code></pre>
              </div>
            </div>
          </div>
          <div class="layout-right" style="flex:1 1 300px;">
            <div class="study-card" style="margin-bottom:0; height:100%;">
              <div class="card-tabs"><span class="tab-btn active" style="cursor:default">크래시 원인 및 복구 분석</span></div>
              <div class="card-body" id="crashAnalysisText" style="line-height:1.6; font-size:0.9rem;">
                \${processCrashData.status.analysis}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // 4. Tabbed Response Summary panels (to prevent document from becoming too long)
    let answerHTML = '';
    if (english || korean) {
      answerHTML += `
        <div class="study-card" style="margin-top: 24px; margin-bottom: 32px;">
          <div class="card-tabs">
            <button class="tab-btn active" id="linuxTabEng">Recommended SRE Response</button>
            <button class="tab-btn" id="linuxTabKor">Korean Summary</button>
          </div>
          <div class="card-body">
            <div class="tab-content active" id="linuxContentEng">
              ${english ? wrapActiveRecall(english.content) : ''}
            </div>
            <div class="tab-content" id="linuxContentKor">
              ${buildInterlinearHTML(english ? english.content : '', korean ? korean.content : '')}
            </div>
          </div>
        </div>
      `;
    }
    html += answerHTML;

    // 5. Normal command list if no simulator matches
    if (commandsSection && doc.id !== 'linux-commands-deep-dive') {
      html += `
        <div class="study-card" style="margin-top: 24px;">
          <div class="card-tabs"><span class="tab-btn active" style="cursor:default">Troubleshooting Toolbelt Commands</span></div>
          <div class="card-body">${commandsSection.content}</div>
        </div>
      `;
    }

    // STAR Incident Case study
    if (situation || taskSec || actionsSec || resultSec) {
      let rcaHTML = '';
      if (situation) rcaHTML += situation.content;
      if (taskSec) rcaHTML += taskSec.content;
      if (actionsSec) rcaHTML += actionsSec.content;
      if (resultSec) rcaHTML += resultSec.content;
      html += buildAccordion("STAR Incident Case Study Breakdown", rcaHTML);
    }

    // Lower elements
    if (intent) html += buildAccordion("Interviewer's Intent", convertToInterlinear(intent.content));
    if (causes) html += buildAccordion("Common Root Causes", convertToInterlinear(causes.content));
    if (followups) {
      html += `<h2 style="font-family: var(--font-heading); margin-top:28px; font-size:1.30rem;"><i class="fa-solid fa-graduation-cap" style="color:hsl(var(--accent)); margin-right:8px;"></i> Interactive Follow-up Practice</h2>`;
      html += parseFollowupCards(followups.content);
    }
    if (notes) html += buildAccordion("Personal Notes & Study Tips", convertToInterlinear(notes.content));

    el.contentArea.innerHTML = html;

    // Interactive Bindings for Command Simulator (deep dive)
    if (doc.id === 'linux-commands-deep-dive') {
      const tabs = document.querySelectorAll('.terminal-tab');
      const commandHeader = document.getElementById('termCommandHeader');
      const consoleOutput = document.getElementById('terminalConsoleOutput');
      
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const key = tab.dataset.tab;
          commandHeader.textContent = terminalSimData[key].command;
          consoleOutput.innerHTML = terminalSimData[key].output;
          bindCopyButtons(); // re-bind inside terminal
        });
      });
    }

    // Interactive Bindings for CPU Metric dials (cpu 100)
    if (doc.id === 'linux-q02-cpu-100') {
      const dialCards = document.querySelectorAll('.cpu-dial-card');
      const cpuConsole = document.getElementById('cpuConsoleOutput');
      const cpuCause = document.getElementById('cpuCauseText');
      
      dialCards.forEach(card => {
        card.addEventListener('click', () => {
          dialCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          const key = card.dataset.metric;
          cpuConsole.textContent = cpuMetricData[key].console;
          cpuCause.textContent = cpuMetricData[key].cause;
        });
      });
    }

    // Interactive Bindings for Deleted Files timeline (disk full)
    if (doc.id === 'linux-q04-disk-full') {
      const steps = document.querySelectorAll('.timeline-step');
      steps.forEach(step => {
        step.addEventListener('click', () => {
          const stepNum = step.dataset.step;
          const activeDetail = document.getElementById(`stepDetail${stepNum}`);
          const isCurrentlyActive = step.classList.contains('active');
          
          // Toggle detail panel visibility
          document.querySelectorAll('.timeline-step-detail').forEach(d => d.style.display = 'none');
          steps.forEach(s => s.classList.remove('active'));
          
          if (!isCurrentlyActive) {
            step.classList.add('active');
            activeDetail.style.display = 'block';
          }
        });
      });
    }

    // Interactive Bindings for Slow Server Diagnostic Sandbox (slow server)
    if (doc.id === 'linux-q01-server-slow') {
      const dialCards = document.querySelectorAll('#slowServerGrid .cpu-dial-card');
      const slowConsole = document.getElementById('slowConsoleOutput');
      const slowAnalysis = document.getElementById('slowAnalysisText');
      const slowTerminalTitle = document.getElementById('slowTerminalTitle');
      
      dialCards.forEach(card => {
        card.addEventListener('click', () => {
          dialCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          const key = card.dataset.bottleneck;
          slowConsole.textContent = slowServerData[key].console;
          slowAnalysis.innerHTML = slowServerData[key].analysis;
          if (slowTerminalTitle) {
            if (key === 'cpu') slowTerminalTitle.textContent = 'Simulated uptime / vmstat output';
            if (key === 'memory') slowTerminalTitle.textContent = 'Simulated free / vmstat output';
            if (key === 'disk') slowTerminalTitle.textContent = 'Simulated iostat output';
            if (key === 'network') slowTerminalTitle.textContent = 'Simulated ss / sar output';
          }
          if (window.hljs) {
            hljs.highlightElement(slowConsole);
          }
        });
      });
    }

    // Interactive Bindings for Memory Leak Analyzer (memory leak)
    if (doc.id === 'linux-q03-memory-leak') {
      const dialCards = document.querySelectorAll('#memoryLeakGrid .cpu-dial-card');
      const memoryConsole = document.getElementById('memoryConsoleOutput');
      const memoryAnalysis = document.getElementById('memoryAnalysisText');
      const memoryTerminalTitle = document.getElementById('memoryTerminalTitle');
      
      dialCards.forEach(card => {
        card.addEventListener('click', () => {
          dialCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          const key = card.dataset.view;
          memoryConsole.textContent = memoryLeakData[key].console;
          memoryAnalysis.innerHTML = memoryLeakData[key].analysis;
          if (memoryTerminalTitle) {
            if (key === 'growth') memoryTerminalTitle.textContent = 'Simulated Process RSS Trend';
            if (key === 'pmap') memoryTerminalTitle.textContent = 'Simulated pmap -x output';
            if (key === 'oom') memoryTerminalTitle.textContent = 'Simulated dmesg OOM logs';
          }
          if (window.hljs) {
            hljs.highlightElement(memoryConsole);
          }
        });
      });
    }

    // Interactive Bindings for Process Crash Debugger (process crash)
    if (doc.id === 'linux-q05-process-crash') {
      const dialCards = document.querySelectorAll('#processCrashGrid .cpu-dial-card');
      const crashConsole = document.getElementById('crashConsoleOutput');
      const crashAnalysis = document.getElementById('crashAnalysisText');
      const crashTerminalTitle = document.getElementById('crashTerminalTitle');
      
      dialCards.forEach(card => {
        card.addEventListener('click', () => {
          dialCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          const key = card.dataset.step;
          crashConsole.textContent = processCrashData[key].console;
          crashAnalysis.innerHTML = processCrashData[key].analysis;
          if (crashTerminalTitle) {
            if (key === 'status') crashTerminalTitle.textContent = 'Simulated systemctl status output';
            if (key === 'kernel') crashTerminalTitle.textContent = 'Simulated journalctl logs';
            if (key === 'coredump') crashTerminalTitle.textContent = 'Simulated coredumpctl & gdb output';
            if (key === 'systemd') crashTerminalTitle.textContent = 'Simulated override.conf restart policy';
          }
          if (window.hljs) {
            hljs.highlightElement(crashConsole);
          }
        });
      });
    }

    // Tabs listener for SRE Response / Korean Summary
    const linuxTEng = document.getElementById('linuxTabEng');
    const linuxTKor = document.getElementById('linuxTabKor');
    const linuxCEng = document.getElementById('linuxContentEng');
    const linuxCKor = document.getElementById('linuxContentKor');

    if (linuxTEng && linuxTKor && linuxCEng && linuxCKor) {
      linuxTEng.addEventListener('click', () => {
        linuxTEng.classList.add('active');
        linuxTKor.classList.remove('active');
        linuxCEng.classList.add('active');
        linuxCKor.classList.remove('active');
      });
      linuxTKor.addEventListener('click', () => {
        linuxTKor.classList.add('active');
        linuxTEng.classList.remove('active');
        linuxCKor.classList.add('active');
        linuxCEng.classList.remove('active');
      });
    }

    // Follow-up card flip triggers
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });

    bindStatusSelector(doc.id);
  }

  // 3. CODING PRACTICE RENDERER (Split screens, Interactive Goal checklist, Code Line annotations)
  function renderCodingLayout(doc) {
    el.contentArea.classList.add('wide-layout');
    const currentStatus = getStatus(doc.id);

    const problem = doc.sections.find(s => s.title.includes("Problem"));
    const solution = doc.sections.find(s => s.title.includes("Solution"));
    const followups = doc.sections.find(s => s.title.includes("Follow-up"));
    const goals = doc.sections.find(s => s.title.includes("Goals"));
    const concepts = doc.sections.find(s => s.title.includes("Concepts"));

    let html = buildHeaderHTML(doc, currentStatus);
    html += buildOverviewCard(doc.id);

    // Annotate Code Block lines dynamically in JavaScript before rendering
    let solutionHTML = '';
    if (solution) {
      solutionHTML = addCodeAnnotations(solution.content);
    }

    let splitHTML = `
      <div class="layout-split">
        <!-- Left Side: Problem & Concepts -->
        <div class="layout-left">
          <div class="study-card" style="height: 100%;">
            <div class="card-tabs"><span class="tab-btn active" style="cursor:default">Problem Statement (문제 설명)</span></div>
            <div class="card-body">
              ${problem ? convertToInterlinear(problem.content) : '<p>No problem description.</p>'}
              ${concepts ? '<hr><h3>Key Concepts (핵심 개념)</h3>' + convertToInterlinear(concepts.content) : ''}
              ${followups ? '<hr><h3>Follow-up Questions (심화 면접 질문)</h3>' + convertToInterlinear(followups.content) : ''}
            </div>
          </div>
        </div>

        <!-- Right Side: Solution code & Checklist -->
        <div class="layout-right">
          <div class="study-card">
            <div class="card-tabs"><span class="tab-btn active" style="cursor:default">Expected Code Solution (Hover lines for explanation)</span></div>
            <div class="card-body">
              ${wrapActiveRecall(solutionHTML)}
            </div>
          </div>

          <!-- Goals checklist -->
          ${goals ? `
            <div class="study-card" style="margin-top: 24px;">
              <div class="card-tabs"><span class="tab-btn active" style="cursor:default">Interactive Learning Goals (학습 목표)</span></div>
              <div class="card-body" id="goalsChecklist">
                ${convertToInterlinear(goals.content)}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    html += splitHTML;
    el.contentArea.innerHTML = html;

    // Enable checkboxes and save status
    const checklist = document.getElementById('goalsChecklist');
    if (checklist) {
      const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((cb, idx) => {
        cb.disabled = false;
        const key = `${doc.id}_goal_${idx}`;
        cb.checked = state.checkboxMap[key] || false;
        cb.addEventListener('change', () => {
          state.checkboxMap[key] = cb.checked;
          localStorage.setItem('study_app_checkbox_map', JSON.stringify(state.checkboxMap));
        });
      });
    }

    bindStatusSelector(doc.id);
  }

  // 4. GENERAL RENDERER
  function renderGeneralLayout(doc) {
    const currentStatus = getStatus(doc.id);
    let html = buildHeaderHTML(doc, currentStatus);

    doc.sections.forEach(sec => {
      html += `
        <div class="study-card">
          <div class="card-tabs"><span class="tab-btn active" style="cursor:default">${sec.title}</span></div>
          <div class="card-body">
            ${convertToInterlinear(sec.content)}
          </div>
        </div>
      `;
    });

    el.contentArea.innerHTML = html;
    bindStatusSelector(doc.id);
  }

  // 5. INTERVIEW WORKSTATION DASHBOARD RENDERER
  function renderDashboardLayout() {
    el.contentArea.classList.remove('wide-layout');
    
    // Calculate D-Day dynamically for June 23, 2026 (US time)
    const targetDate = new Date('2026-06-23T00:00:00-04:00'); // US Eastern Time
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const dDayText = diffDays > 0 ? `D-${diffDays} Days` : (diffDays === 0 ? 'D-Day' : `D+${Math.abs(diffDays)} Days`);

    const getCatMetrics = (data) => {
      const total = data.length;
      if (total === 0) return { score: 0, completed: 0, total: 0 };
      let completed = 0;
      let reviewing = 0;
      data.forEach(item => {
        const status = state.statusMap[item.id] || item.status || 'Studying';
        if (status === 'Mastered') completed++;
        else if (status === 'Reviewing') reviewing++;
      });
      const score = Math.round(((completed + (reviewing * 0.5)) / total) * 100);
      return { score, completed, total };
    };

    const categories = [
      { id: 'Behavioral', label: 'Behavioral Questions', icon: 'fa-comments', color: '#6366f1' },
      { id: 'Linux', label: 'Linux Troubleshooting', icon: 'fa-terminal', color: '#10b981' },
      { id: 'Networking', label: 'Networking Scenarios', icon: 'fa-network-wired', color: '#0ea5e9' },
      { id: 'Cloud', label: 'Cloud Engineering', icon: 'fa-cloud', color: '#3b82f6' },
      { id: 'Kubernetes', label: 'Kubernetes Scenarios', icon: 'fa-cubes', color: '#8b5cf6' },
      { id: 'GPU & AI Infrastructure', label: 'GPU & AI Infrastructure', icon: 'fa-microchip', color: '#ec4899' },
      { id: 'Coding', label: 'Coding Practice', icon: 'fa-code', color: '#f59e0b' },
      { id: 'System Design', label: 'System Design', icon: 'fa-sitemap', color: '#10b981' }
    ];

    let totalScoreSum = 0;
    let activeCategoriesCount = 0;
    let categoryHtml = '';

    categories.forEach(cat => {
      const data = STUDY_DATA.filter(d => d.category === cat.id);
      const metrics = getCatMetrics(data);
      if (data.length > 0) {
        totalScoreSum += metrics.score;
        activeCategoriesCount++;
      }
      
      categoryHtml += `
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 6px;">
            <span style="font-weight: 500; color: var(--text-primary);"><i class="fa-solid ${cat.icon}" style="color: ${cat.color}; margin-right:6px; width: 16px; text-align: center;"></i> ${cat.label}</span>
            <span style="font-weight: bold; color: var(--text-primary);">${metrics.score}% (${metrics.completed}/${metrics.total} 마스터)</span>
          </div>
          <div class="progress-bar-wrapper" style="height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
            <div style="height: 100%; width: ${metrics.score}%; background: ${cat.color}; border-radius: 4px; transition: width 0.3s;"></div>
          </div>
        </div>
      `;
    });

    const overallScore = activeCategoriesCount > 0 ? Math.round(totalScoreSum / activeCategoriesCount) : 0;
    
    let html = `
      <div class="item-title-section">
        <span class="item-path">DCS SRE Operations / Cockpit</span>
        <h1 class="item-title"><i class="fa-solid fa-gauge-high" style="color: hsl(var(--accent));"></i> Interview Workstation Dashboard</h1>
      </div>

      <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-top: 24px;">
        <!-- Left Side: Readiness Score Circle -->
        <div class="study-card" style="margin-bottom: 0;">
          <div class="card-tabs"><span class="tab-btn active" style="cursor:default">Overall Readiness Score</span></div>
          <div class="card-body" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 16px;">
            <div class="radial-gauge-container" style="position: relative; width: 160px; height: 160px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, var(--card-bg) 60%, transparent 62%); border-radius: 50%;">
              <div class="radial-progress-bar" style="position: absolute; top:0; left:0; right:0; bottom:0; border-radius: 50%; background: conic-gradient(hsl(var(--accent)) ${overallScore}%, var(--border-color) ${overallScore}%); z-index: 1;"></div>
              <div class="radial-inner-circle" style="position: absolute; top: 12px; left: 12px; right: 12px; bottom: 12px; border-radius: 50%; background: var(--card-bg); z-index: 2; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color);">
                <span style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 700; color: var(--text-primary);">${overallScore}%</span>
              </div>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <span class="meta-badge stars" style="font-size: 0.85rem;"><i class="fa-solid fa-award"></i> SRE Weight-Adjusted Readiness</span>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 8px; max-width: 240px; line-height: 1.4;">등록된 모든 카테고리별 마스터 점수의 종합 평균 지표입니다.</p>
            </div>
          </div>
        </div>

        <!-- Right Side: Category Metrics & Recommendations -->
        <div class="study-card" style="margin-bottom: 0;">
          <div class="card-tabs"><span class="tab-btn active" style="cursor:default">Category Breakdown & Progress</span></div>
          <div class="card-body" style="padding: 24px; max-height: 320px; overflow-y: auto;">
            \${categoryHtml}

            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 20px 0;">

            <!-- Streaks & Date Countdown -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: center;">
              <div style="background: rgba(239, 68, 68, 0.05); border: 1px dashed rgba(239, 68, 68, 0.2); border-radius: 8px; padding: 12px;">
                <div style="font-size: 0.78rem; text-transform: uppercase; color: #ef4444; font-weight: bold; letter-spacing: 0.5px;">ByteDance D-Day</div>
                <div style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">\${dDayText}</div>
              </div>
              <div style="background: rgba(245, 158, 11, 0.05); border: 1px dashed rgba(245, 158, 11, 0.2); border-radius: 8px; padding: 12px;">
                <div style="font-size: 0.78rem; text-transform: uppercase; color: #f59e0b; font-weight: bold; letter-spacing: 0.5px;">Study Streak</div>
                <div style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;"><i class="fa-solid fa-fire" style="color: #f59e0b; margin-right: 4px;"></i> 12 Days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="study-card" style="margin-top: 24px;">
        <div class="card-tabs"><span class="tab-btn active" style="cursor:default"><i class="fa-solid fa-graduation-cap"></i> Recommended Next Study Path (SRE 가중 추천 학습 경로)</span></div>
        <div class="card-body" style="padding: 24px; line-height: 1.6;">
          <h3 style="font-family: var(--font-heading); font-size:1.1rem; color: hsl(var(--accent)); margin-bottom:12px;"><i class="fa-solid fa-circle-exclamation"></i> 현재 취약 분야 집중 권장 사항</h3>
          <p style="font-size:0.92rem; color: var(--text-primary); margin-bottom:16px;">
            전체 진행률 분석 결과, <strong>Linux Troubleshooting (가중치 50%)</strong> 영역 중 마스터하지 못한 질문이 있습니다.
            특히 면접 빈출 문항인 <a href="#" id="dashRecLink" style="color: hsl(var(--accent)); font-weight:bold; text-decoration:underline;">[Linux 3] 지속적인 메모리 증가 및 OOM(Out of Memory) 진단</a> 문제 학습을 마스터(Mastered) 상태로 완료하시는 것을 적극 추천드립니다.
          </p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="top-tab-btn" id="dashGoLinuxBtn" style="border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 6px; background: var(--card-bg); color: var(--text-primary); cursor: pointer; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-terminal"></i> 리눅스 트러블슈팅 풀이 시작</button>
            <button class="top-tab-btn" id="dashGoRecallBtn" style="border: 1px solid hsl(var(--accent)); padding: 8px 16px; border-radius: 6px; background: rgba(var(--accent), 0.1); color: hsl(var(--accent)); cursor: pointer; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-bolt"></i> 퀵 리콜 모드로 최종 벼락치기</button>
          </div>
        </div>
      </div>
    `;
    
    el.contentArea.innerHTML = html;
    
    const dashRecLink = document.getElementById('dashRecLink');
    if (dashRecLink) {
      dashRecLink.addEventListener('click', (e) => {
        e.preventDefault();
        const linuxBtn = el.topNavTabs.querySelector(`[data-category="Linux"]`);
        if (linuxBtn) linuxBtn.click();
        setTimeout(() => loadDocument('linux-q03-memory-leak'), 50);
      });
    }
    const dashGoLinuxBtn = document.getElementById('dashGoLinuxBtn');
    if (dashGoLinuxBtn) {
      dashGoLinuxBtn.addEventListener('click', () => {
        const linuxBtn = el.topNavTabs.querySelector(`[data-category="Linux"]`);
        if (linuxBtn) linuxBtn.click();
      });
    }
    const dashGoRecallBtn = document.getElementById('dashGoRecallBtn');
    if (dashGoRecallBtn) {
      dashGoRecallBtn.addEventListener('click', () => {
        el.quickRecallToggle.click();
      });
    }
  }

  // 6. QUICK RECALL FLASHCARDS SYSTEM
  let recallIndex = 0;
  let recallCards = [];
  let recallIsFlipped = false;

  function renderQuickRecallDeck() {
    el.contentArea.classList.remove('wide-layout');
    
    recallCards = STUDY_DATA.filter(d => {
      const status = state.statusMap[d.id] || d.status || 'Studying';
      return status !== 'Mastered';
    });
    if (recallCards.length === 0) {
      recallCards = STUDY_DATA;
    }
    
    if (recallIndex >= recallCards.length) {
      recallIndex = 0;
    }
    
    const currentCard = recallCards[recallIndex];
    const status = getStatus(currentCard.id);
    
    let html = `
      <div class="item-title-section">
        <span class="item-path">Quick Recall Session / Flashcards</span>
        <h1 class="item-title"><i class="fa-solid fa-bolt" style="color: #f59e0b;"></i> Last-Minute Review Mode (${recallIndex + 1} / ${recallCards.length})</h1>
      </div>
      
      <div class="flashcard-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; margin-top: 24px; gap: 24px;">
        <div class="flashcard-element ${recallIsFlipped ? 'flipped' : ''}" id="flashcardElement" style="perspective: 1000px; width: 100%; max-width: 600px; height: 320px; cursor: pointer;">
          <div class="flashcard-inner" style="position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.6s; transform-style: preserve-3d; transform: ${recallIsFlipped ? 'rotateY(180deg)' : 'none'};">
            <!-- Front: Question -->
            <div class="flashcard-front" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
              <span style="font-family: var(--font-heading); font-size: 0.8rem; text-transform: uppercase; color: hsl(var(--accent)); font-weight: bold; margin-bottom: 16px;">${currentCard.category} Interview Question</span>
              <h2 style="font-size: 1.35rem; font-weight: 600; line-height: 1.5; color: var(--text-primary);">${getDocumentDisplayTitle(currentCard)}</h2>
              <div style="margin-top: 32px; font-size: 0.8rem; color: var(--text-secondary);"><i class="fa-solid fa-reply"></i> Click Card or Press SPACE to reveal answer</div>
            </div>
            <!-- Back: Key Summary -->
            <div class="flashcard-back" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.15); transform: rotateY(180deg); overflow-y: auto;">
              <span style="font-family: var(--font-heading); font-size: 0.8rem; text-transform: uppercase; color: #10b981; font-weight: bold; margin-bottom: 12px;">Recommended Answer Points</span>
              <div style="font-size: 0.95rem; text-align: left; color: var(--text-primary); max-height: 200px; overflow-y: auto; line-height: 1.6;">
                ${convertToInterlinear(getAnswerSummary(currentCard))}
              </div>
              <div style="margin-top: 16px; font-size: 0.78rem; color: var(--text-secondary);">Keyboard Shortcuts: [1] Mastered [2] Reviewing [3] Studying</div>
            </div>
          </div>
        </div>

        <!-- Navigation & Status Selector Buttons -->
        <div style="display: flex; gap: 16px; align-items: center; justify-content: center; flex-wrap: wrap;">
          <button class="top-tab-btn" id="prevRecallBtn" style="border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 6px; background: var(--card-bg); color: var(--text-primary); cursor: pointer;"><i class="fa-solid fa-arrow-left"></i> Previous</button>
          <div style="display: flex; gap: 8px;">
            <button class="top-tab-btn" id="markMasteredBtn" style="border: 1px solid #10b981; background: ${status === 'Mastered' ? '#10b981' : 'rgba(16, 185, 129, 0.1)'}; color: ${status === 'Mastered' ? '#fff' : '#10b981'}; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.82rem;">[1] Mastered</button>
            <button class="top-tab-btn" id="markReviewingBtn" style="border: 1px solid #f59e0b; background: ${status === 'Reviewing' ? '#f59e0b' : 'rgba(245, 158, 11, 0.1)'}; color: ${status === 'Reviewing' ? '#fff' : '#f59e0b'}; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.82rem;">[2] Reviewing</button>
            <button class="top-tab-btn" id="markStudyingBtn" style="border: 1px solid #ef4444; background: ${status === 'Studying' ? '#ef4444' : 'rgba(239, 68, 68, 0.1)'}; color: ${status === 'Studying' ? '#fff' : '#ef4444'}; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.82rem;">[3] Studying</button>
          </div>
          <button class="top-tab-btn" id="nextRecallBtn" style="border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 6px; background: var(--card-bg); color: var(--text-primary); cursor: pointer;">Next <i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    `;
    
    el.contentArea.innerHTML = html;
    
    const cardEl = document.getElementById('flashcardElement');
    if (cardEl) {
      cardEl.addEventListener('click', () => {
        recallIsFlipped = !recallIsFlipped;
        const inner = cardEl.querySelector('.flashcard-inner');
        if (inner) {
          inner.style.transform = recallIsFlipped ? 'rotateY(180deg)' : 'none';
        }
        cardEl.classList.toggle('flipped', recallIsFlipped);
      });
    }
    
    const prevRecallBtn = document.getElementById('prevRecallBtn');
    if (prevRecallBtn) {
      prevRecallBtn.addEventListener('click', () => {
        recallIsFlipped = false;
        recallIndex = (recallIndex - 1 + recallCards.length) % recallCards.length;
        renderQuickRecallDeck();
      });
    }
    
    const nextRecallBtn = document.getElementById('nextRecallBtn');
    if (nextRecallBtn) {
      nextRecallBtn.addEventListener('click', () => {
        recallIsFlipped = false;
        recallIndex = (recallIndex + 1) % recallCards.length;
        renderQuickRecallDeck();
      });
    }
    
    const bindMarkBtn = (id, newStatus) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          updateStatus(currentCard.id, newStatus);
          renderQuickRecallDeck();
        });
      }
    };
    
    bindMarkBtn('markMasteredBtn', 'Mastered');
    bindMarkBtn('markReviewingBtn', 'Reviewing');
    bindMarkBtn('markStudyingBtn', 'Studying');
  }

  function getAnswerSummary(doc) {
    const english = doc.sections.find(s => s.title.includes("English") || s.title.includes("Answer") || s.title.includes("Solution"));
    const korean = doc.sections.find(s => s.title.includes("Korean"));
    
    let engHTML = english ? english.content : '';
    let korHTML = korean ? korean.content : '';
    
    if (engHTML || korHTML) {
      return buildInterlinearHTML(engHTML, korHTML) || engHTML || korHTML;
    }
    
    if (doc.sections.length > 1) {
      return doc.sections[1].content;
    }
    return 'No answer content available.';
  }

  // --- Sub-parsers & Annotators ---

  function parseFollowupCards(htmlContent) {
    // Splits expected follow-up questions from a list into a interactive 3D flip card grid
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const questions = Array.from(div.querySelectorAll('li, p')).map(el => el.textContent).filter(Boolean);
    
    // Fallback if formatting is non-standard
    if (questions.length === 0) return htmlContent;
    
    let gridHTML = '<div class="flip-card-grid">';
    
    // Match question index to simulated answers
    const mockFollowupAnswers = {
      0: "프로젝트 진행 방식과 플랫폼 사용 기술, 아키텍처 설계 과정을 언급합니다.",
      1: "GPU 인프라와 VAST Storage 구성, VM과 Bare Metal의 가상화 성능 차이 분석을 기술적으로 답합니다.",
      2: "장애 발생 단계부터 vmstat, iostat 등의 도구를 사용한 데이터 기반 트러블슈팅 접근을 강조합니다.",
      3: "대규모 트래픽 분산을 위해 클러스터 크기를 확장하고 컨테이너를 수천 개 단위로 수용했던 스케일을 예시로 듭니다.",
      4: "글로벌 딜리버리(TikTok)의 복잡성과 거대 클라우드 환경에서 Reliability를 수립하기 위한 목적을 정렬합니다."
    };

    questions.forEach((q, idx) => {
      const ans = mockFollowupAnswers[idx] || "데이터 기반 문제 분석 절차와 다부서 협업, 재발 방지를 위한 모니터링 수립으로 조치했음을 설명합니다.";
      gridHTML += `
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <h3>${q}</h3>
              <div class="flip-hint">Click to flip & see study hint</div>
            </div>
            <div class="flip-card-back">
              <h4>면접 답변 키 포인트</h4>
              <p>${ans}</p>
            </div>
          </div>
        </div>
      `;
    });
    gridHTML += '</div>';
    return gridHTML;
  }

  function addCodeAnnotations(htmlContent) {
    // Wrap key programming symbols with hover tooltips directly inside raw HTML code block
    let annotated = htmlContent;
    
    const tooltipMapping = [
      {
        pattern: /collections\.Counter/g,
        info: "<h4>collections.Counter</h4><p>요소의 빈도를 측정하는 최적화된 해시 맵 클래스입니다. O(N)의 시간 복잡도를 가져 리스트 정렬 기반의 카운팅보다 효율적입니다.</p>"
      },
      {
        pattern: /defaultdict\(int\)/g,
        info: "<h4>defaultdict(int)</h4><p>존재하지 않는 키를 호출할 때 자동으로 0으로 초기화하는 딕셔너리입니다. 불필요한 'key in dict' 조건문을 생략하여 코드가 깔끔해집니다.</p>"
      },
      {
        pattern: /json\.loads/g,
        info: "<h4>json.loads</h4><p>JSON 형식의 문자열을 파이썬 딕셔너리로 구문 분석합니다. 대용량 로그 처리 시 malformed(깨진) 데이터가 섞여 있을 때 try-except 예외 처리를 꼭 명시하세요.</p>"
      },
      {
        pattern: /sorted\(/g,
        info: "<h4>sorted()</h4><p>Timsort 알고리즘을 사용한 파이썬 정렬 내장 함수입니다. 시간 복잡도는 O(N log N)입니다. 대용량 데이터 정렬 시의 메모리 오버헤드를 대비해야 합니다.</p>"
      }
    ];

    tooltipMapping.forEach(m => {
      annotated = annotated.replace(m.pattern, (match) => {
        return `<span class="code-line-annotated has-annotation">${match}<span class="code-annotation-bubble">${m.info}</span></span>`;
      });
    });

    return annotated;
  }

  // --- HTML Layout Helper Snippets ---

  function buildHeaderHTML(doc, currentStatus) {
    let metaBadgesHTML = '';
    if (doc.importance) {
      metaBadgesHTML += `<span class="meta-badge stars"><i class="fa-solid fa-star"></i> 중요도: ${doc.importance}</span>`;
    }
    if (doc.frequency) {
      metaBadgesHTML += `<span class="meta-badge stars"><i class="fa-solid fa-fire"></i> 빈도: ${doc.frequency}</span>`;
    }
    if (doc.probability) {
      metaBadgesHTML += `<span class="meta-badge"><i class="fa-solid fa-chart-line"></i> 출제 확률: ${doc.probability}</span>`;
    }

    return `
      <div class="item-title-section">
        <span class="item-path">${doc.path}</span>
        <h1 class="item-title">${getDocumentDisplayTitle(doc)}</h1>
        <div class="item-meta-row">
          ${metaBadgesHTML}
          <div class="meta-badge status-select-wrapper">
            <select id="statusSelect">
              <option value="Studying" ${currentStatus === 'Studying' ? 'selected' : ''}>Studying</option>
              <option value="Reviewing" ${currentStatus === 'Reviewing' ? 'selected' : ''}>Reviewing</option>
              <option value="Mastered" ${currentStatus === 'Mastered' ? 'selected' : ''}>Mastered</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }

  function wrapActiveRecall(htmlContent) {
    if (!state.activeRecall) return htmlContent;
    return `
      <div class="recall-container" onclick="this.classList.add('revealed')">
        <div class="blur-target">
          ${htmlContent}
        </div>
      </div>
    `;
  }

  function buildAccordion(title, contentHTML) {
    return `
      <details class="study-accordion">
        <summary>${title}</summary>
        <div class="accordion-content">
          ${contentHTML}
        </div>
      </details>
    `;
  }

  function bindStatusSelector(docId) {
    const statusSelect = document.getElementById('statusSelect');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        updateStatus(docId, e.target.value);
      });
    }
  }



  function buildOverviewCard(fileId) {
    const data = OVERVIEW_DATA[fileId];
    if (!data) return '';

    const qList = data.questions.map(q => `<li>${q}</li>`).join('');
    const sList = data.skills.map(s => `<li>${s}</li>`).join('');

    return `
      <div class="overview-card">
        <div class="overview-card-header">
          <div class="overview-card-icon">
            <i class="${data.icon}"></i>
          </div>
          <h3 class="overview-card-title">${data.title}</h3>
        </div>
        <div class="overview-card-grid">
          <div class="overview-col">
            <span class="overview-col-label">시나리오 요약 (Scenario Summary)</span>
            <p class="overview-col-value">${data.summary}</p>
          </div>
          <div class="overview-col">
            <span class="overview-col-label">대비 핵심 면접 질문 (Prep Questions)</span>
            <ul class="overview-col-list">${qList}</ul>
          </div>
          <div class="overview-col">
            <span class="overview-col-label">평가 핵심 SRE 역량 (SRE Skills)</span>
            <ul class="overview-col-list">${sList}</ul>
          </div>
        </div>
      </div>
    `;
  }

  function bindCopyButtons() {
    const preBlocks = el.contentArea.querySelectorAll('pre');
    preBlocks.forEach(pre => {
      if (pre.querySelector('.copy-btn')) return;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = 'Copy';
      
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const codeElement = pre.querySelector('code');
        const codeText = codeElement ? codeElement.innerText : pre.innerText.replace('Copy', '');
        
        navigator.clipboard.writeText(codeText.trim()).then(() => {
          copyBtn.textContent = 'Copied!';
          copyBtn.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
          copyBtn.style.color = '#34d399';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.style.backgroundColor = '';
            copyBtn.style.color = '';
          }, 2000);
        });
      });

      pre.appendChild(copyBtn);
    });
  }

  // Keyboard Navigation for Quick Recall
  document.addEventListener('keydown', (e) => {
    if (!state.quickRecall) return;
    
    if (e.code === 'Space') {
      e.preventDefault();
      const cardEl = document.getElementById('flashcardElement');
      if (cardEl) {
        cardEl.click();
      }
    } else if (e.code === 'Digit1' || e.code === 'Numpad1') {
      const btn = document.getElementById('markMasteredBtn');
      if (btn) btn.click();
    } else if (e.code === 'Digit2' || e.code === 'Numpad2') {
      const btn = document.getElementById('markReviewingBtn');
      if (btn) btn.click();
    } else if (e.code === 'Digit3' || e.code === 'Numpad3') {
      const btn = document.getElementById('markStudyingBtn');
      if (btn) btn.click();
    } else if (e.code === 'ArrowRight') {
      const btn = document.getElementById('nextRecallBtn');
      if (btn) btn.click();
    } else if (e.code === 'ArrowLeft') {
      const btn = document.getElementById('prevRecallBtn');
      if (btn) btn.click();
    }
  });
});


