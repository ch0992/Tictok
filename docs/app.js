
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

  const tcpHandshakeData = {
    syn: {
      clientState: 'SYN_SENT',
      serverState: 'LISTEN',
      arrow: 'client-to-server',
      packetDesc: 'SYN',
      activeStep: 1,
      console: `20:04:18.102941 IP 192.168.1.10.49152 &gt; 10.0.0.5.80: <span class="console-highlight correct-flag">Flags [S]<span class="console-tooltip">S = SYN (Synchronize). 클라이언트가 서버에 새로운 가상 연결 세션 수립을 요청함을 뜻하는 제어 플래그입니다.</span></span>, <span class="console-highlight">seq 1000<span class="console-tooltip">초기 시퀀스 번호(Initial Sequence Number): 패킷의 정렬 상태 및 수신 확인용으로 양측이 임의로 생성하는 32비트 고유 일련번호의 시작점입니다.</span></span>, <span class="console-highlight">win 64240<span class="console-tooltip">윈도우 크기(Window Size): 수신측에서 승인(ACK)을 보내기 전까지 한번에 받을 수 있는 메모리 버퍼의 최대 바이트 용량입니다.</span></span>, options [mss 1460,sackOK,TS val 1002941 ecr 0]`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #0ea5e9; margin-right: 6px;"></i><strong>클라이언트가 SYN 패킷을 전송합니다. (Step 1)</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>동작 메커니즘:</strong> Client는 무작위 초기 시퀀스 번호(ISN: 1000)를 결정하고 <code>SYN</code> 플래그를 ON하여 전송합니다.</li>
          <li style="margin-bottom: 6px;"><strong>소켓 상태:</strong> 클라이언트는 패킷을 보냄과 동시에 <code>CLOSED</code>에서 <code>SYN_SENT</code> 상태로 대기하며, 서버는 <code>LISTEN</code> 상태에서 패킷을 감지합니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 트러블슈팅 Point:</strong> 이 단계에서 무응답 타임아웃이 나면 <strong>방화벽(Security Group, Network ACL)</strong> 정책이나 서버 포트 리스닝 여부를 가장 먼저 확인해야 합니다.</li>
        </ul>
      `
    },
    synack: {
      clientState: 'SYN_SENT',
      serverState: 'SYN_RCVD',
      arrow: 'server-to-client',
      packetDesc: 'SYN-ACK',
      activeStep: 2,
      console: `20:04:18.103482 IP 10.0.0.5.80 &gt; 192.168.1.10.49152: <span class="console-highlight correct-flag">Flags [S.]<span class="console-tooltip">S. = SYN-ACK. 클라이언트의 접속 요청을 승인(ACK)하고, 서버측 시퀀스 번호도 동기화(SYN)하겠다는 다중 플래그입니다.</span></span>, <span class="console-highlight">seq 4000<span class="console-tooltip">서버측 초기 시퀀스 번호(Server ISN): 서버가 자신의 데이터 수신 흐름 정렬을 위해 생성한 고유 시작 시퀀스 번호입니다.</span></span>, <span class="console-highlight">ack 1001<span class="console-tooltip">승인 번호(Ack Number): 클라이언트의 시퀀(1000) 패킷을 완벽히 수신했음을 나타내며, 다음으로 받길 원하는 1001번 시퀀스를 가리킵니다.</span></span>, win 65535, options [mss 1460,sackOK,TS val 2003482 ecr 1002941]`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #10b981; margin-right: 6px;"></i><strong>서버가 SYN-ACK 패킷으로 답장합니다. (Step 2)</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>동작 메커니즘:</strong> Server는 클라이언트 시퀀스에 1을 더한 <code>ack=1001</code>과 서버 자신의 초기 시퀀스 번호(<code>seq=4000</code>)가 합쳐진 패킷을 보냅니다.</li>
          <li style="margin-bottom: 6px;"><strong>소켓 상태:</strong> 서버는 연결 요청을 메모리에 적재하며 <code>SYN_RCVD</code> 상태로 대기합니다. 클라이언트는 여전히 <code>SYN_SENT</code>입니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 트러블슈팅 Point:</strong> 서버 소켓이 <code>SYN_RCVD</code>(또는 SYN_RECV) 상태로 과점유되어 있다면 <strong>SYN Flooding</strong> 공격일 가능성이 매우 높습니다. <code>tcp_syncookies = 1</code> 설정과 백로그 큐 확장이 필수 조치입니다.</li>
        </ul>
      `
    },
    ack: {
      clientState: 'ESTABLISHED',
      serverState: 'SYN_RCVD',
      arrow: 'client-to-server',
      packetDesc: 'ACK',
      activeStep: 3,
      console: `20:04:18.103910 IP 192.168.1.10.49152 &gt; 10.0.0.5.80: <span class="console-highlight correct-flag">Flags [.]<span class="console-tooltip">. = ACK 플래그를 지칭합니다. SYN 등의 다른 제어 플래그 없이 순수 수신 완료 응답만을 전송할 때 tcpdump에선 점(.)으로 표기됩니다.</span></span>, <span class="console-highlight">ack 4001<span class="console-tooltip">서버 시퀀스(4000)를 성공적으로 수신하였음을 증명하며, 다음 패킷인 4001번 데이터를 수신할 준비가 되었음을 의미합니다.</span></span>, win 64240, options [nop,nop,TS val 1003910 ecr 2003482]`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #f59e0b; margin-right: 6px;"></i><strong>클라이언트가 마지막 ACK 패킷을 보냅니다. (Step 3)</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>동작 메커니즘:</strong> Client는 서버의 SYN-ACK 수신 후, 서버 시퀀스 4000에 1을 더한 <code>ack=4001</code>을 설정하여 확인 패킷을 최종 회신합니다.</li>
          <li style="margin-bottom: 6px;"><strong>소켓 상태:</strong> 클라이언트는 이 패킷을 발송하는 즉시 <code>ESTABLISHED</code> 상태로 전입하고, 서버는 이 패킷을 수령해야 <code>ESTABLISHED</code>가 됩니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 트러블슈팅 Point:</strong> 이 패킷 유실 시 <strong>Half-Open Connection</strong> 상태가 생기며 서버는 SYN-ACK 재전송 루프를 돕니다. 방화벽의 아웃바운드 필터나 회선의 패킷 드롭 여부를 봐야 합니다.</li>
        </ul>
      `
    },
    established: {
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      arrow: 'bidirectional',
      packetDesc: 'ESTABLISHED (HTTP GET)',
      activeStep: 4,
      console: `20:04:18.104250 IP 192.168.1.10.49152 &gt; 10.0.0.5.80: Flags [P.], seq 1001:1081, ack 4001, win 64240: <span class="console-highlight correct-flag">HTTP GET /index.html<span class="console-tooltip">실제 애플리케이션 데이터(HTTP Request)가 3-Way Handshake 완료 직후 전송되는 시뮬레이션 로그입니다.</span></span>
20:04:18.104621 IP 10.0.0.5.80 &gt; 192.168.1.10.49152: Flags [.], ack 1081, win 65535 (HTTP Response ACK)`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-check" style="color: #10b981; margin-right: 6px;"></i><strong>연결 수립이 완료되어 양방향 데이터 통신을 개시합니다.</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>동작 메커니즘:</strong> 세션이 최종적으로 성립되었으므로 3계층/4계층 채널 세팅을 완료하고 HTTP GET 등의 Application Layer 실제 데이터 트래픽을 즉시 교환합니다.</li>
          <li style="margin-bottom: 6px;"><strong>소켓 상태:</strong> 통신 양단 모두 <code>ESTABLISHED</code> 상태를 단단히 유지합니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 트러블슈팅 Point:</strong> 커넥션 수립은 정상이나 데이터 통신에 실패(예: HTTP 504 Gateway Timeout)하는 경우에는 네트워크 레벨보다는 WAS/DB 병목, Web Server 스레드 풀 고갈 장애일 가능성이 매우 높으므로 애플리케이션 분석으로 빠르게 넘어가야 합니다.</li>
        </ul>
      `
    }
  };

  const dnsLifecycleData = {
    dns: {
      activeStep: 1,
      console: `; &lt;&lt;&gt;&gt; DiG 9.10.6 &lt;&lt;&gt;&gt; +trace www.google.com
;; global options: +cmd
.           518400  IN  <span class="console-highlight">NS<span class="console-tooltip">NS (Name Server) Record: 도메인의 DNS 쿼리를 처리할 권한이 있는 네임서버 목록을 지정합니다. 여기선 루트 네임서버(.)를 지칭합니다.</span></span>  a.root-servers.net.
.           518400  IN  NS  b.root-servers.net.
;; Received 525 bytes from 192.168.1.1#53 in 12 ms

com.        172800  IN  NS  a.gtld-servers.net.
com.        172800  IN  NS  b.gtld-servers.net.
;; Received 1173 bytes from a.root-servers.net#53 in 24 ms

google.com. 172800  IN  NS  ns1.google.com.
google.com. 172800  IN  NS  ns2.google.com.
;; Received 830 bytes from a.gtld-servers.net#53 in 28 ms

www.google.com. 300 IN  <span class="console-highlight">A<span class="console-tooltip">A (Address) Record: 도메인 네임을 IPv4 주소로 변환하는 가장 핵심적인 레코드입니다.</span></span>  <span class="console-highlight correct-flag">142.250.196.142<span class="console-tooltip">최종 확인된 구글 서버의 IPv4 주소입니다. 브라우저는 이제 이 IP 주소를 대상으로 L4 TCP 연결을 시도하게 됩니다.</span></span>
;; Received 50 bytes from ns1.google.com#53 in 15 ms`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #0ea5e9; margin-right: 6px;"></i><strong>도메인명을 IP 주소로 변환하는 DNS Resolution 단계입니다.</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>탐색 순서:</strong> Local Cache $\rightarrow$ OS Hosts $\rightarrow$ Local DNS Resolver $\rightarrow$ Root DNS 서버 (.) $\rightarrow$ TLD (.com) 네임서버 $\rightarrow$ Google 권한 있는 네임서버(Authoritative NS) 순으로 재귀 조회가 수행됩니다.</li>
          <li style="margin-bottom: 6px;"><strong>핵심 메커니즘:</strong> 최종적으로 Google 네임서버가 구글 서버의 A 레코드 IP(<code>142.250.196.142</code>)를 리턴합니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 트러블슈팅:</strong> 도메인 접속 불가 시 <code>dig +trace 도메인</code>을 사용하여 어느 단계의 네임서버가 쿼리에 응답하지 않거나 잘못된 CNAME/A 정보를 주는지 즉각 식별해 내야 합니다.</li>
        </ul>
      `
    },
    tcp: {
      activeStep: 2,
      console: `12:51:02.102941 IP 192.168.1.10.49152 &gt; 142.250.196.142.443: <span class="console-highlight correct-flag">Flags [S]<span class="console-tooltip">SYN: 클라이언트가 서버에 L4 포트 443(HTTPS) 연결 수립을 요청합니다.</span></span>, seq 1000, win 64240, options [mss 1460,sackOK]
12:51:02.122482 IP 142.250.196.142.443 &gt; 192.168.1.10.49152: <span class="console-highlight correct-flag">Flags [S.]<span class="console-tooltip">SYN-ACK: 구글 서버가 접속 수락 응답과 함께 자신의 시퀀스 번호를 교환합니다.</span></span>, seq 5000, ack 1001, win 65535, options [mss 1460,sackOK]
12:51:02.141910 IP 192.168.1.10.49152 &gt; 142.250.196.142.443: <span class="console-highlight correct-flag">Flags [.]<span class="console-tooltip">ACK: 클라이언트가 최종 확인 패킷을 회신하여 3-Way Handshake를 마칩니다.</span></span>, ack 5001, win 64240`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #10b981; margin-right: 6px;"></i><strong>L4 전송 계층 소켓 채널을 여는 TCP 3-Way Handshake 단계입니다.</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>포트 설정:</strong> URL에 <code>https://</code> 프로토콜을 사용하고 있으므로 클라이언트는 구글 서버의 <strong>TCP 443</strong> 포트를 향해 접속을 요청(SYN)합니다.</li>
          <li style="margin-bottom: 6px;"><strong>양방향 신뢰성 확보:</strong> SYN $\rightarrow$ SYN-ACK $\rightarrow$ ACK 단계를 순서대로 거치며 초기 시퀀스 번호를 동기화하여 패킷 소실이나 순서가 꼬이는 현상을 원천 방어합니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 트러블슈팅:</strong> 만약 TCP 핸드쉐이크가 중간에 끊기거나 SYN 재전송 루프에 빠진다면 클라이언트 측 라우터의 아웃바운드 ACL 및 서버 측 인바운드 보안 그룹에서 443 포트가 차단되지 않았는지 검사해야 합니다.</li>
        </ul>
      `
    },
    tls: {
      activeStep: 3,
      console: `$ openssl s_client -connect www.google.com:443 -tls1_3
CONNECTED(00000003)
---
Certificate chain
 0 s:CN = www.google.com
   i:C = US, O = Google Trust Services, <span class="console-highlight">CN = GTS CA 1C3<span class="console-tooltip">인증서 서명 체인: 구글 서버가 전송한 인증서를 발급한 공인 CA 기관 정보입니다. 브라우저는 이 CA 정보가 로컬 루트 인증서 저장소에 존재하는지 교차 검증합니다.</span></span>
---
New, <span class="console-highlight correct-flag">TLSv1.3<span class="console-tooltip">TLSv1.3 프로토콜: 대칭 키 생성 단계를 극도로 최적화하여 1-RTT(1 Round Trip Time) 만에 보안 세션을 맺는 최신 보안 레이어입니다.</span></span>, Cipher is <span class="console-highlight">TLS_AES_256_GCM_SHA384<span class="console-tooltip">Cipher Suite (암호화 스위트): 세션 보안에 사용될 대칭 암호화 알고리즘(AES_256_GCM)과 해시 함수(SHA384) 규격입니다.</span></span>
Server public key is 256 bit
Secure Renegotiation IS NOT supported
Compression: NONE
Expansion: NONE
No ALPN negotiated
Early data was not sent
Verify return code: 0 (ok)
---`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #f59e0b; margin-right: 6px;"></i><strong>암호화된 안전 터널을 수립하는 TLS Cryptographic Handshake 단계입니다.</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>암호화 협상 (Client/Server Hello):</strong> 브라우저와 구글 서버가 지원 가능한 TLS 규격(TLS 1.3 권장) 및 암호화 조합(Cipher Suite) 목록을 교환 및 합의합니다.</li>
          <li style="margin-bottom: 6px;"><strong>인증서 신뢰 검증:</strong> 서버가 송부한 공개키 인증서가 공인 발급 기관(CA) 서명을 지녔는지, 만료일은 지나지 않았는지 확인해 중간자 공격(MITM)을 방어합니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 트러블슈팅:</strong> 보안 에러 또는 SSL handshake 실패가 난다면 서버측 도메인 인증서 갱신 누락(Expired Certificate) 여부, 클라이언트의 오래된 브라우저 버전으로 인한 프로토콜 호환 불일치를 dig나 openssl을 통해 규명해야 합니다.</li>
        </ul>
      `
    },
    http: {
      activeStep: 4,
      console: `$ curl -I https://www.google.com
<span class="console-highlight correct-flag">HTTP/2 200<span class="console-tooltip">HTTP Status Code 200 OK: 서버가 클라이언트의 요청을 성공적으로 처리하고 본문 데이터를 회신함을 알립니다. 최신 HTTP/2 다중화 규격을 적용하고 있습니다.</span></span>
content-type: text/html; charset=UTF-8
date: Sat, 14 Jun 2026 01:07:35 GMT
expires: -1
cache-control: private, max-age=0
<span class="console-highlight">strict-transport-security<span class="console-tooltip">HSTS (Strict-Transport-Security): 이후 이 도메인으로의 모든 통신은 HTTP가 아닌 안전한 HTTPS로만 강제 전환하여 접속하도록 명시하는 보안 헤더입니다.</span></span>: max-age=31536000
server: gws
x-xss-protection: 0
x-frame-options: SAMEORIGIN`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #8b5cf6; margin-right: 6px;"></i><strong>암호화 터널 안에서 HTTP 요청(Request) 및 응답(Response)을 처리합니다.</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>L7 요청 전송:</strong> 브라우저는 <code>GET / HTTP/2</code> 메시지를 발송하여 구글 검색 메인 페이지의 HTML 자원을 요청합니다.</li>
          <li style="margin-bottom: 6px;"><strong>헤더 옵션 조율:</strong> 구글 웹 서버(GWS)는 요청을 즉시 수락하여 캐시 제어 조건(private, max-age=0), HSTS 보안 규정 및 HTML 본문 텍스트 스트림을 함께 반환합니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 트러블슈팅:</strong> L4/L5 네트워크는 정상인데 <strong>HTTP 5xx Server Error</strong>나 <strong>504 Gateway Timeout</strong>이 발생하는 경우, 백엔드 애플리케이션의 메모리 누수, 스레드 풀 잠김, 또는 연동 DB 쿼리 병목을 조사해야 합니다.</li>
        </ul>
      `
    },
    render: {
      activeStep: 5,
      console: `[Browser DevTools Performance Timeline]
1. Parse HTML (Received HTML stream from server, building DOM tree)
2. Send Requests (Encountered &lt;link rel="stylesheet"&gt;, fetch style.css)
3. CSSOM Tree (Finished parsing styles, building style hierarchy)
4. Layout (Compute exact positions and sizes of all visual nodes)
5. Paint (Drawing pixels to graphics cards buffer)
6. <span class="console-highlight correct-flag">Composite Layers<span class="console-tooltip">레이어 합성(Composite): 각 부분을 레이어화하여 GPU 하드웨어 가속을 통해 빠르게 합치는 마지막 페인팅 최적화 단계입니다.</span></span> (Page fully interactive!)`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-check" style="color: #10b981; margin-right: 6px;"></i><strong>웹 서버로부터 전달받은 리소스를 사용자 화면에 그립니다 (Rendering).</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>DOM & CSSOM 트리 빌드:</strong> 서버가 준 HTML과 CSS 소스를 한 줄씩 읽으며 객체 트리(DOM, CSSOM)로 재조합합니다.</li>
          <li style="margin-bottom: 6px;"><strong>페인트 및 래스터화 (Layout & Paint):</strong> 객체 트리를 렌더 트리로 결합해 각 엘리먼트의 정확한 크기와 위치를 정한 뒤 모니터 화면에 그래픽 연산으로 그려냅니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE / FE 최적화 Point:</strong> 첫 페이지 진입 후 화면이 나타나기까지의 속도를 개선하기 위해 <strong>핵심 렌더링 경로(CRP)</strong>를 최적화(LCP 지표 개선)하고, 브로킹 스크립트(JS)의 <code>async / defer</code> 배치 및 리소스 사전 압축/지연 로딩 설정을 적용해야 합니다.</li>
        </ul>
      `
    }
  };

  const latencySimData = {
    packet_loss: {
      activeStep: 1,
      console: `$ ping -c 10 142.250.196.142
PING 142.250.196.142 (142.250.196.142): 56 data bytes
64 bytes from 142.250.196.142: icmp_seq=0 ttl=56 time=12.4 ms
Request timeout for icmp_seq=1
64 bytes from 142.250.196.142: icmp_seq=2 ttl=56 time=12.2 ms
Request timeout for icmp_seq=3
64 bytes from 142.250.196.142: icmp_seq=4 ttl=56 time=12.5 ms
Request timeout for icmp_seq=5
64 bytes from 142.250.196.142: icmp_seq=6 ttl=56 time=12.3 ms
Request timeout for icmp_seq=7
64 bytes from 142.250.196.142: icmp_seq=8 ttl=56 time=12.6 ms
Request timeout for icmp_seq=9

--- 142.250.196.142 ping statistics ---
10 packets transmitted, 5 packets received, <span class="console-highlight">50.0% packet loss<span class="console-tooltip">Packet Loss (패킷 유실률): 송신한 10개의 패킷 중 5개가 소실되었음을 보여줍니다. WAN 구간이나 스위치 버퍼 오버플로우로 인해 심각한 전송 장애가 발생하고 있습니다.</span></span>, time 9014ms
rtt min/avg/max/mdev = 12.235/12.411/12.612/0.135 ms

$ tcpdump -i eth0 -n -vv 'tcp[tcpflags] & (tcp-syn|tcp-fin) == 0'
20:04:18.102941 IP 192.168.1.10.49152 &gt; 142.250.196.142.443: Flags [.], seq 1001:2461, ack 5001, win 64240, options [nop,nop,TS val 1002941 ecr 2003482]
20:04:18.303112 IP 192.168.1.10.49152 &gt; 142.250.196.142.443: <span class="console-highlight correct-flag">Flags [P.], seq 1001:2461, ack 5001, retrans 1<span class="console-tooltip">TCP Retransmission: 송신 측에서 타이머(RTO)가 만료될 때까지 ACK가 오지 않아 seq 1001 패킷을 재전송(retrans 1)하는 상태입니다. 이 재전송 루프로 인해 RTT 지연이 극대화됩니다.</span></span>, win 64240, options [nop,nop,TS val 1003141 ecr 2003482]
20:04:18.312401 IP 142.250.196.142.443 &gt; 192.168.1.10.49152: Flags [.], ack 2461, win 65535, options [nop,nop,TS val 2003601 ecr 1003141, <span class="console-highlight">sack 1 {1001:2461}<span class="console-tooltip">SACK (Selective Acknowledgment): 수신측이 일부 소실된 시퀀스를 제외하고 정상 수신된 데이터 구간(1001~2461)을 특정하여 알려주는 옵션으로, 불필요한 전체 재전송을 막고 유실된 패킷만 선택 전송하도록 돕습니다.</span></span>]`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-triangle-exclamation" style="color: #ef4444; margin-right: 6px;"></i><strong>네트워크 링크 상에서 패킷 드롭이 발생하는 시나리오입니다.</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>현상 매핑:</strong> <code>ping</code> 결과에서 극심한 패킷 드롭(50%)이 식별되며, <code>tcpdump</code>로 캡처한 TCP 패킷에서 동일한 시퀀스 범위의 <code>Retransmission</code>(재전송) 로그가 빈번하게 발견됩니다.</li>
          <li style="margin-bottom: 6px;"><strong>지연 발생 기전:</strong> 패킷이 유실되면 수신측이 정상 ACK를 보내지 못하므로 송신자는 RTO(재전송 타임아웃) 시간 동안 통신을 중단하고 대기했다가 다시 데이터를 보내 전체 통신 속도가 수 초씩 멈추는 지연이 누적됩니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 대응 방안:</strong> 스위치 인터페이스의 드롭 카운터(CRC 에러 등)를 분석하고, 물리 케이블/SFP 지빅 불량 검사 및 네트워크 장비 버퍼 포화(Congestion) 상태를 모니터링하여 병목 스위치 포트를 보정합니다.</li>
        </ul>
      `
    },
    db_lock: {
      activeStep: 2,
      console: `$ psql -c "SELECT pid, age(clock_timestamp(), query_start), state, query FROM pg_stat_activity WHERE state != 'idle';"
  pid  |       age       |   state   |             query             
-------+-----------------+-----------+------------------------------------------------------------
 28192 | 00:00:15.394121 | <span class="console-highlight">active<span class="console-tooltip">Active: 해당 커넥션에서 쿼리가 현재 실행 중이며 리소스를 점유하고 있음을 의미합니다. 처리 시간이 수초~수십초 이상 지속되면 정상 동작이 아닙니다.</span></span>    | UPDATE users SET balance = balance - 100 WHERE id = 1042;
 28241 | 00:00:15.019482 | <span class="console-highlight correct-flag">active<span class="console-tooltip">Active (Waiting): state상으로는 active이나 내부적으로 테이블 락(Exclusive Lock)을 획득하기 위해 blocked된 상태입니다.</span></span>    | UPDATE users SET balance = balance + 100 WHERE id = 1042;

$ psql -c "SELECT blocked_locks.pid AS blocked_pid, blocking_locks.pid AS blocking_pid, blocked_activity.query AS blocked_statement FROM pg_catalog.pg_locks blocked_locks JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid WHERE NOT blocked_locks.granted;"
 blocked_pid | blocking_pid |                     blocked_statement                     
-------------+--------------+-----------------------------------------------------------
       28241 |        28192 | UPDATE users SET balance = balance + 100 WHERE id = 1042;
(1 row) <span class="console-highlight">Lock Contention Detected<span class="console-tooltip">Lock Contention (락 경합): 선행 트랜잭션(28192)이 완료되지 않은 상태에서 동일한 레코드에 후행 트랜잭션(28241)이 쓰기를 시도하면서 대기가 걸렸습니다.</span></span>`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-triangle-exclamation" style="color: #f59e0b; margin-right: 6px;"></i><strong>데이터베이스 트랜잭션 Lock으로 인한 애플리케이션 행(Hang) 시나리오입니다.</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>현상 매핑:</strong> PostgreSQL 내 <code>pg_stat_activity</code> 확인 결과 특정 쿼리의 실행 시간(Age)이 15초 이상 유지되고 있으며, 다른 세션이 특정 레코드에 대해 exclusive lock 대기 상태로 대기열을 채우고 있습니다.</li>
          <li style="margin-bottom: 6px;"><strong>지연 발생 기전:</strong> 웹 애플리케이션 서버(WAS)가 DB 쿼리를 요청했으나 DB 단에서 행 수준 락 대기에 잠겨 응답을 주지 못하므로, WAS의 커넥션 풀(Connection Pool) 스레드가 풀 상태로 대기하다가 차례로 고갈되어 전체 클라이언트 응답이 타임아웃됩니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 대응 방안:</strong> 차단 원인을 유발한 DB 세션(PID 28192)을 강제 종료(<code>pg_terminate_backend(pid)</code>)하고, 소스코드 레벨에서 트랜잭션 유지 시간(Transaction lifetime)을 줄이며, 필요한 인덱스를 생성하여 데이터 조회 속도를 단축시킵니다.</li>
        </ul>
      `
    },
    storage: {
      activeStep: 3,
      console: `$ iostat -xz 1 3
Device:         rrqm/s   wrqm/s     r/s     w/s    rkB/s    wkB/s aqu-sz  await  svctm  %util
sdb               0.00     4.00    2.00  450.00     8.00 45000.00   8.50  <span class="console-highlight">85.42<span class="console-tooltip">await: I/O 요청이 디스크 대기열에서 대기하고 실제로 디바이스가 처리 완료하기까지 소요된 총 평균 시간(ms)입니다. 10ms 이상이면 디스크 대스크 병목으로 간주합니다.</span></span>   2.00  <span class="console-highlight correct-flag">100.00<span class="console-tooltip">%util: 디바이스가 입출력 요청을 처리하는 데 활성화되었던 시간 비율입니다. 100%에 도달했다는 것은 디바이스의 물리적 IOPS 한계에 도달해 디스크가 완전히 포화 상태임을 증명합니다.</span></span>

$ df -h
Filesystem            Size  Used Avail Use% Mounted on
/dev/sda1              40G   24G   16G  60% /
10.0.1.5:/data_share  1.0T  850G  150G  85% <span class="console-highlight">/mnt/shared_nfs<span class="console-tooltip">NFS Network Mount: 네트워크 공유 디렉토리 마운트 포트입니다. NFS 서버 측 디스크 과부하 및 대역폭 포화 시 I/O 시스템 콜을 대기시키는 주범이 됩니다.</span></span>

$ tail -n 5 /var/log/syslog
Jun 14 01:12:04 web-srv-01 kernel: [31940.12] <span class="console-highlight">nfs: server 10.0.1.5 not responding, still trying<span class="console-tooltip">NFS Server Not Responding: NFS 스토리지 공유 서버가 응답하지 않아 커널이 I/O 쓰기 동작을 완료하지 못하고 행이 걸려 있는 커널 수준의 경고 메시지입니다.</span></span>`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-triangle-exclamation" style="color: #ef4444; margin-right: 6px;"></i><strong>스토리지 성능 저하(IOPS 포화 및 NFS 지연) 시나리오입니다.</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>현상 매핑:</strong> <code>iostat</code> 분석 시 디스크 디바이스(sdb)의 <code>%util</code>이 100%에 고정되어 있고, 입출력 대기 시간인 <code>await</code>이 85ms를 넘는 비정상적인 수치를 가리킵니다. Syslog에는 NFS 마운트 지연 에러가 로깅되고 있습니다.</li>
          <li style="margin-bottom: 6px;"><strong>지연 발생 기전:</strong> 애플리케이션 코드가 파일 로그 기록이나 정적 자원 업로드를 시도할 때, 디스크 I/O가 완료될 때까지 커널에서 <code>Uninterruptible Sleep (D state)</code> 상태로 대기(Block)되어 웹 응답 레이턴시가 폭발적으로 누적됩니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 대응 방안:</strong> NFS 서버 스토리지 디바이스를 고성능 SSD(IOPS 프로비저닝 볼륨)로 업그레이드하고, 애플리케이션의 로깅 방식을 비동기(Asynchronous logging / Queue) 방식으로 교체하여 I/O 블로킹을 우회합니다.</li>
        </ul>
      `
    },
    rdma_fallback: {
      activeStep: 4,
      console: `$ cat /sys/class/infiniband/mlx5_0/ports/1/state
4: ACTIVE

$ cat /sys/class/infiniband/mlx5_0/ports/1/tc/1/pfc_enable
0 (disabled) <span class="console-highlight">-- [WARNING] PFC is disabled!<span class="console-tooltip">PFC (Priority Flow Control): 이더넷 상에서 무손실(Lossless) 전송을 보장하도록 특정 우선순위 클래스 트래픽에 멈춤 프레임을 보내 패킷 드롭을 방지하는 기술로, 이더넷 기반 RDMA(RoCE) 인프라 구축의 필수 요구조건입니다.</span></span>

$ cat /var/log/syslog | grep -i "roce"
Jun 14 01:14:02 gpu-node-01 kernel: [mlx5_core] <span class="console-highlight correct-flag">RoCE PFC verification failed: Lossless path status check FAILED<span class="console-tooltip">PFC 검증 실패: 스위치와 호스트 간 PFC 불일치로 무손실 데이터 경로가 파괴되었음을 커널 드라이버가 감지하고 관련 RDMA 가상 링크 수립을 거부했습니다.</span></span>
Jun 14 01:14:02 gpu-node-01 kernel: [mlx5_core] Warning: Falling back to standard TCP socket transport for GPU peer data.
Jun 14 01:14:03 gpu-node-01 app_gpu: Peer link latency degraded. Baseline 0.12ms (RDMA) -> 4.80ms (TCP socket). Performance dropped by 40x.`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-triangle-exclamation" style="color: #8b5cf6; margin-right: 6px;"></i><strong>PFC 설정 비활성화로 인해 RDMA 통신이 커널 TCP로 강제 Fallback된 시나리오입니다.</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>현상 매핑:</strong> InfiniBand/RoCE 호스트 포트 상태는 ACTIVE나, <code>pfc_enable</code> 스위치 측과 호스트 포트 측의 튜닝이 비활성화(0)되어 있으며 커널 로그에 RoCE PFC verification 실패 및 TCP socket Fallback 알림이 떠 있습니다.</li>
          <li style="margin-bottom: 6px;"><strong>지연 발생 기전:</strong> 무손실 전송이 불가능해지자 GPU 간 대용량 텐서(Tensor) 전송 시 메모리 복사 및 컨텍스트 스위칭이 없는 zero-copy RDMA 대신, CPU 개입과 복사 연산이 수반되는 커널 TCP 소켓을 경유해 통신 지연이 40배 폭증하고 분산 학습 스피드가 처참히 감소합니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 대응 방안:</strong> 네트워크 스위치 및 호스트 네트워크 인터페이스 카드(NIC) 양단에 PFC(Priority Flow Control) 및 ECN(Explicit Congestion Notification) 혼잡 제어 설정을 활성화하여 Lossless 이더넷 환경을 견고히 확립합니다.</li>
        </ul>
      `
    }
  };

  const loadBalancerSimData = {
    l4: {
      activeStep: 1,
      console: `# L4 Load Balancer routing relies on IP and Port (OSI Layer 4)
# It modifies the packet header directly (NAT) and forwards to upstream.

$ ipvsadm -Ln
IP Virtual Server version 1.2.1 (modules loaded)
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
TCP  <span class="console-highlight">10.0.0.10:443<span class="console-tooltip">L4 VIP (Virtual IP): 외부 사용자가 접속하는 로드 밸런서의 대표 IP 주소 및 포트(TCP 443)입니다.</span></span> rr
  -> <span class="console-highlight">10.0.0.21:443<span class="console-tooltip">Backend Server A IP: L4 로드 밸런서가 트래픽을 중계할 첫 번째 실물 백엔드 웹 서버의 IP 및 포트 주소입니다.</span></span>           Masq    1      0          0         
  -> <span class="console-highlight">10.0.0.22:443<span class="console-tooltip">Backend Server B IP: L4 로드 밸런서가 트래픽을 중계할 두 번째 실물 백엔드 웹 서버의 IP 및 포트 주소입니다.</span></span>           Masq    1      0          0         

# tcpdump trace on L4 LB interface:
# Packet arrived: Source 192.168.1.50:49210 &gt; Dest 10.0.0.10:443 (TCP SYN)
# Packet forwarded: Source 192.168.1.50:49210 &gt; Dest 10.0.0.21:443 (TCP SYN, <span class="console-highlight correct-flag">Dest IP Rewritten<span class="console-tooltip">DNAT (Destination NAT): L4 LB가 TCP 페이로드는 해독하지 않고 패킷 헤더의 Destination IP를 VIP(10.0.0.10)에서 백엔드 IP(10.0.0.21)로 바꾼 후 즉시 전달하는 메커니즘입니다.</span></span>)`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #0ea5e9; margin-right: 6px;"></i><strong>Layer 4 로드 밸런싱 (Transport Layer 패킷 중계)</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>동작 방식 (NAT):</strong> 클라이언트가 L4 LB의 가상 IP(10.0.0.10)로 TCP 연결을 요청하면, L4 LB는 <strong>IP 헤더의 목적지 주소만 실시간으로 Rewriting(DNAT)</strong>하여 백엔드로 바로 바이패스합니다.</li>
          <li style="margin-bottom: 6px;"><strong>커넥션 수립 개수:</strong> <strong>단 1개의 TCP 커넥션</strong>만 생성됩니다 (Client &leftrightarrow; Backend 직접 통신). L4 LB는 그 사이에서 패킷 헤더 주소만 빠르게 조작해 전달하는 역할만 수행합니다.</li>
          <li style="margin-bottom: 6px;"><strong>연산 특징:</strong> HTTP 페이로드(URL, 헤더, 쿠키)를 전혀 해석하지 않으므로 오버헤드가 극히 적고 대용량 포워딩 성능이 매우 뛰어납니다.</li>
          <li style="margin-bottom: 0;"><strong>장애 판별 Point:</strong> L4 장비가 정상인데 응답이 없다면 백엔드 웹 서버의 80/443 포트가 실제로 떠 있는지(<code>ss -tan</code> 리스닝 검사), 혹은 중간 스위치의 방화벽 정책을 검사해야 합니다.</li>
        </ul>
      `
    },
    l7: {
      activeStep: 2,
      console: `# L7 Load Balancer proxy pass config (OSI Layer 7 NGINX)
# It terminates TCP/SSL, parses HTTP, and routes based on Host/URL.

http {
    <span class="console-highlight">upstream<span class="console-tooltip">upstream block: L7 로드 밸런서가 역프록시(Reverse Proxy)하여 동적으로 요청을 중계할 백엔드 서버 그룹을 정의합니다.</span></span> api_servers {
        server 10.0.0.21:8080 max_fails=3 fail_timeout=10s;
        server 10.0.0.22:8080 max_fails=3 fail_timeout=10s;
        <span class="console-highlight">sticky cookie srv_id expires 1h<span class="console-tooltip">Sticky Session (세션 고정): 쿠키(srv_id)를 심어서 브라우저 요청이 항상 동일한 백엔드 인스턴스로 전달되도록 고정하는 기능으로, L7에서만 구현 가능합니다.</span></span>;
    }

    server {
        listen 443 ssl http2;
        server_name api.company.com;

        <span class="console-highlight">ssl_certificate /etc/ssl/certs/api.crt;<span class="console-tooltip">SSL/TLS Termination (인증서 종단): 사용자와의 HTTPS 연결을 L7 로드 밸런서에서 끊고 암호화를 해독(Decryption)하여, 백엔드 서버군에는 해독된 평문 HTTP 트래픽으로 안전하고 가볍게 전달하는 기법입니다.</span></span>
        
        location /users {
            <span class="console-highlight correct-flag">proxy_pass http://api_servers;<span class="console-tooltip">proxy_pass (역프록시 중계): /users 경로로 진입한 HTTP 요청을 분석하여 upstream 정의된 백엔드 서버 중 하나로 온전한 HTTP 요청 객체 형식으로 전달합니다. (두 번째 TCP 세션 실행)</span></span>
            proxy_set_header <span class="console-highlight">X-Forwarded-For<span class="console-tooltip">X-Forwarded-For: L7 LB가 백엔드 서버로 새로 TCP 연결을 맺을 때, 원래 접속을 시도한 클라이언트의 실제 IP(192.168.1.50)를 누락시키지 않기 위해 HTTP 헤더에 실어 전달하는 표준 속성입니다.</span></span> $proxy_add_x_forwarded_for;
        }
    }
}`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #8b5cf6; margin-right: 6px;"></i><strong>Layer 7 로드 밸런싱 (Application Layer 프록시 중계)</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>동작 방식 (Reverse Proxy):</strong> 클라이언트가 L7 LB와 TCP 핸드쉐이크 및 SSL 핸드쉐이크를 맺고 연결을 완전히 끊어냅니다 (TCP Session 1). 이후 들어오는 HTTP 요청 명세(URL, Header, Cookie)를 해석하여 알맞은 백엔드 서비스로 <strong>별도의 신규 TCP 세션을 열어(TCP Session 2)</strong> 프록싱합니다.</li>
          <li style="margin-bottom: 6px;"><strong>커넥션 수립 개수:</strong> <strong>총 2개의 독립된 TCP 커넥션</strong>이 유지됩니다 (Client &leftrightarrow; L7 LB, L7 LB &leftrightarrow; Backend).</li>
          <li style="margin-bottom: 6px;"><strong>지능형 기능:</strong> 특정 URL 경로(예: <code>/users</code>)에 따른 경로 분기, 세션 쿠키를 이용한 Sticky Session 유지, SSL/TLS 인증서 복호화(Termination) 등을 완벽히 수행할 수 있습니다.</li>
          <li style="margin-bottom: 0;"><strong>장애 판별 Point:</strong> 502 Bad Gateway 에러가 나타난다면 L7 LB는 살아 있으나 뒷단 upstream 백엔드 애플리케이션 데몬이 정지되었거나, WAS/컨테이너 네트워크 연동이 단절된 애플리케이션 계층 장애입니다.</li>
        </ul>
      `
    }
  };

  const packetLossSimData = {
    congestion: {
      activeStep: 1,
      console: `# Check link utilization and switch queue drops
$ tc -s qdisc show dev eth0
qdisc fq_codel 0: root refcnt 2 limit 10240 flows 1024 quantum 1514 
 <span class="console-highlight">sent 14.8G bytes 9812401 pkt (dropped 124801, overlimits 459102)</span><span class="console-tooltip">dropped: 큐 버퍼가 포화되어 커널 또는 스위치가 드롭한 패킷 개수입니다.<br>overlimits: 인터페이스 속도 한계를 초과하여 스케줄러가 전송을 보류하거나 버린 횟수입니다.</span>
 
# ethtool statistics check showing switch-level buffer drops
$ ethtool -S eth0 | grep -E "drop|overflow"
     rx_queue_drop: 0
     tx_queue_drop: 124801
     <span class="console-highlight">rx_buf_overflow: 8901<span class="console-tooltip">rx_buf_overflow: 랜카드 링 버퍼나 스위치 버퍼 오버플로우로 인해 유실된 RX 패킷 수로, 입력 패킷 속도가 처리 속도보다 빨라 발생합니다.</span></span>
     rx_fw_discards: 0`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #0ea5e9; margin-right: 6px;"></i><strong>네트워크 혼잡 (Link Saturation & Buffer Overflow)</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>발생 기전:</strong> 송신 속도가 수신 노드 혹은 중간 스위치 포트의 대역폭 한계(egress queue)를 초과하여 스위치 큐 버퍼가 포화되면, 신규 패킷을 그냥 폐기하는 <strong>꼬리 드롭(Tail Drop)</strong>이 발생합니다.</li>
          <li style="margin-bottom: 6px;"><strong>TCP 영향:</strong> 패킷이 누락되면서 수신 측은 중복 ACK를 보내고 송신 측은 Fast Retransmit 또는 RTO 시간 초과로 재전송을 가동하며, 혼잡 윈도우(CWND) 크기를 낮추어 전송 속도가 급감합니다.</li>
          <li style="margin-bottom: 6px;"><strong>진단 기법:</strong> <code>tc -s qdisc</code>에서 <code>dropped</code> 수치 증가세, 혹은 <code>ethtool -S</code>를 활용해 링 버퍼 오버플로우 카운터를 실시간 감시합니다.</li>
          <li style="margin-bottom: 0;"><strong>장애 대책:</strong> 큐 버퍼 크기 확장(txqueuelen 조정), BBR과 같은 고효율 혼잡 제어 알고리즘 도입, 또는 포트 본딩(LACP)으로 대역폭 자체를 증설합니다.</li>
        </ul>
      `
    },
    mtu: {
      activeStep: 2,
      console: `# Test with Jumbo Frames (9000 bytes) with Don't Fragment (DF) flag set
$ ping -M do -s 8972 10.0.0.21
PING 10.0.0.21 (10.0.0.21) 8972(9000) bytes of data.
<span class="console-highlight">ping: local error: Message too long, mtu=1500<span class="console-tooltip">Message too long (mtu=1500): 로컬 NIC의 MTU가 1500으로 설정되어 있어, DF(Don't Fragment) 플래그가 걸린 9000바이트 패킷을 전송할 수 없음을 나타냅니다.</span></span>

# Test from a source that allows sending, but drops silently in the middle (MTU Black Hole)
$ ping -M do -s 8972 10.0.0.22
PING 10.0.0.22 (10.0.0.22) 8972(9000) bytes of data.
From 10.0.0.1 icmp_seq=1 <span class="console-highlight">Packet needs fragmentation but DF set<span class="console-tooltip">Packet needs fragmentation: 경로상에 MTU 1500인 스위치가 DF가 켜진 9000바이트 패킷을 수신하여 드롭했음을 알리는 ICMP Type 3 Code 4 메시지입니다.</span></span>
--- 10.0.0.22 ping statistics ---
5 packets transmitted, 0 received, <span class="console-highlight correct-flag">100% packet loss</span>`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #f59e0b; margin-right: 6px;"></i><strong>MTU 크기 불일치 (Jumbo Frame & MTU Black Hole)</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>발생 기전:</strong> 서버는 점보 프레임(MTU 9000)으로 대용량 패킷을 송출했으나, 중간 스위치나 VPN 터널 장비가 표준 1500 바이트 크기 제한을 가졌을 때, <strong>단편화 금지(DF=1)</strong> 플래그가 선언되어 있다면 패킷을 전송하지 못하고 드롭합니다.</li>
          <li style="margin-bottom: 6px;"><strong>블랙홀 현상:</strong> 중간 라우터가 "Fragmentation Needed" ICMP 응답을 돌려줘야 하나, 중간 방화벽이 ICMP 메시지를 차단(Block)하면 송신 측은 유실 여부를 인지하지 못하고 연결이 끊기는 블랙홀 현상이 일어납니다.</li>
          <li style="margin-bottom: 6px;"><strong>진단 기법:</strong> <code>ping -M do -s &lt;size&gt;</code> 커맨드를 활용해 패킷 크기를 조절해가며 어느 경계 크기부터 무응답 유실이 발생하는지 파악합니다.</li>
          <li style="margin-bottom: 0;"><strong>장애 대책:</strong> 전송 경로 상의 모든 스위치 및 포트의 MTU 설정을 9000으로 균일화하거나, 서버 커널에서 MSS 조작(TCPMSS 클램핑)을 적용합니다.</li>
        </ul>
      `
    },
    crc: {
      activeStep: 3,
      console: `# Read network interface hardware error counters
$ ip -s link show dev eth0
2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether 52:54:00:fa:19:bc brd ff:ff:ff:ff:ff:ff
    RX: bytes  packets  errors  dropped overrun mcast   
    1840192801 12049102 <span class="console-highlight">8491</span>    0       <span class="console-highlight">182</span>     0       <span class="console-highlight">RX errors detected<span class="console-tooltip">RX errors & overrun: 물리 케이블 불량이나 NIC 수신 링 버퍼 가득 참(Overrun) 현상으로 커널이 정상적으로 읽어들이지 못한 에러 패킷 수입니다.</span></span>
    TX: bytes  packets  errors  dropped carrier collsns 
    9481029401 89102409 0       0       0       0       

# Check detail Ethernet stats via ethtool
$ ethtool -S eth0 | grep -E "crc|align|frame"
     <span class="console-highlight">rx_crc_errors: 8309<span class="console-tooltip">rx_crc_errors: 물리적인 패킷 손상이나 케이블 노이즈 등으로 인해 프레임의 체크섬(CRC) 검증이 실패하여 폐기된 에러 카운터입니다.</span></span>
     rx_align_errors: 182
     rx_frame_errors: 8491`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #ef4444; margin-right: 6px;"></i><strong>물리 에러 (CRC Checksum Failure & Faulty Cable)</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>발생 기전:</strong> 동축 또는 광케이블의 손상, SFP+ 트랜시버의 노화, 또는 커넥터 불량으로 인해 전송 도중 패킷 데이터 비트가 물리적으로 깨지면, 수신 측 NIC 하드웨어가 <strong>CRC 검증 실패</strong> 판정 후 패킷을 파기합니다.</li>
          <li style="margin-bottom: 6px;"><strong>특징적 징후:</strong> 네트워크 혼잡이 심하지 않음에도 특정 포트에서 무작위적인 패킷 손실이 지속되며, 핑 응답 시간이 불안정하고 연결이 간헐적으로 끊깁니다.</li>
          <li style="margin-bottom: 6px;"><strong>진단 기법:</strong> <code>ip -s link</code> 상의 RX errors 누적치 및 <code>ethtool -S</code> 명령어 출력 중 <code>rx_crc_errors</code> 카운터의 지속적인 실시간 증가세를 검사합니다.</li>
          <li style="margin-bottom: 0;"><strong>장애 대책:</strong> 에러가 발생한 물리 케이블을 교체하거나 광 모듈(SFP+) 청소 및 교체, 포트 스위치 모듈의 상태를 점검합니다.</li>
        </ul>
      `
    },
    rdma_fallback: {
      activeStep: 4,
      console: `# Check RoCE / IB link status and error counters
$ rdma link show
link mlx5_0/1 state ACTIVE physical_state LINK_UP netdev eth0

# Verify PFC (Priority Flow Control) switch drop logs
$ ethtool -S eth0 | grep -i "prio"
     tx_prio0_packets: 984019280
     rx_prio0_packets: 849102910
     <span class="console-highlight">rx_prio0_dropped: 410292<span class="console-tooltip">rx_prio0_dropped: RoCE 환경에서 PFC 우선순위 큐 포화나 무손실 전송 실패로 인해 드롭된 우선순위 0번 트래픽의 패킷 수입니다.</span></span>

# Kernel log shows fallback due to lossless configuration issues
$ dmesg | tail -n 3
[mlx5_core] <span class="console-highlight">RoCE PFC verification failed: Switch Lossless path status check FAILED<span class="console-tooltip">PFC Verification Failed: 스위치와 호스트 간 PFC(우선순위 흐름 제어) 튜닝 설정이 일치하지 않아 무손실 네트워크를 생성할 수 없어 커널이 RDMA 연결을 거부했습니다.</span></span>
[mlx5_core] Warning: Falling back to standard TCP socket transport for GPU peer data.
[app_gpu] Peer link latency degraded. Baseline 0.12ms (RDMA) -> 4.80ms (TCP socket). Performance dropped by 40x.`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #8b5cf6; margin-right: 6px;"></i><strong>RDMA/RoCE Congestion (PFC Fallback & AI Training Slowdown)</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>발생 기전:</strong> 대규모 AI 분산 학습 도중 GPU 노드 간 고속 전송을 지원하는 RoCE 망에 스위치 버퍼가 고갈되었으나, <strong>PFC(Priority Flow Control)</strong> 설정이 양단 간 불일치하거나 비활성화되어 패킷 드랍이 그대로 발생한 현상입니다.</li>
          <li style="margin-bottom: 6px;"><strong>TCP 폴백:</strong> RDMA 통신은 패킷 유실을 감당할 수 없으므로, 유실 감지 시 즉시 커널 계층의 일반 TCP 소켓 통신으로 강제 폴백(Fallback)됩니다.</li>
          <li style="margin-bottom: 6px;"><strong>성능 파장:</strong> CPU 복사 오버헤드와 커널 스택 처리 지연이 추가되어 전송 지연 시간(Latency)이 40배 가량 폭증하고 GPU 가동률(GPU Utility)이 급락하여 분산 학습 연산 속도가 처참하게 감소합니다.</li>
          <li style="margin-bottom: 0;"><strong>장애 대책:</strong> 리프-스파인 스위치 전 구간 및 NIC에 PFC(우선순위 기반 흐름 제어)와 ECN(명시적 혼잡 통보) 설정을 완전 정렬하여 Lossless Ethernet 환경을 견고하게 보장해야 합니다.</li>
        </ul>
      `
    }
  };

  const gpuSimData = {
    tcp: {
      console: `# Standard BSD Socket API flow for network data exchange
$ cat tcp_sender.c
void send_data(int sock, char *buf, size_t size) {
    // CPU context switch to kernel space
    // Memory Copy 1: User buffer to Kernel Socket Buffer
    <span class="console-highlight">write(sock, buf, size);<span class="console-tooltip">write(): 데이터를 전송하기 위한 BSD 소켓 API로, 호출 시 유저 영역에서 커널 영역으로 CPU 컨텍스트 스위칭이 유발되며 전송 버퍼로 데이터가 복사(Memory Copy 1)됩니다.</span></span>
}

# Kernel network stack serialization parameters
$ sysctl -a | grep -E "tcp_wmem|tcp_rmem"
net.ipv4.tcp_wmem = 4096	16384	4194304
net.ipv4.tcp_rmem = 4096	87380	6291456

# CPU load stats showing system overhead during heavy TCP I/O
$ mpstat -P ALL 1
CPU    %usr   <span class="console-highlight">%sys<span class="console-tooltip">%sys: OS 커널 네트워크 스택 연산(체크섬 계산, 패킷 분할, ACK 수신 대기) 및 소켓 복사 연산으로 인해 CPU 시스템 코스트가 24.8%까지 크게 치솟았습니다.</span></span>   %iowait   %idle
all    5.20  <span class="console-highlight">24.80</span>     1.50   68.50`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #0ea5e9; margin-right: 6px;"></i><strong>TCP 전송 매커니즘 (커널 스택 및 CPU 자원 오버헤드)</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>데이터 복사 오버헤드:</strong> 애플리케이션 버퍼 데이터를 커널 영역의 <strong>소켓 버퍼(Socket Buffer)</strong>로 1차 복사(CPU 복사)하고, 다시 NIC 링 버퍼로 2차 복사(DMA)하는 과정이 수반됩니다.</li>
          <li style="margin-bottom: 6px;"><strong>CPU 간섭 및 지연:</strong> 매 전송 요청마다 유저 스페이스와 커널 스페이스 간 <strong>컨텍스트 스위칭(Context Switch)</strong>이 발생하고, CPU가 패킷 패키징 및 체크섬 연산에 동원되어 CPU 부하가 폭증합니다.</li>
          <li style="margin-bottom: 6px;"><strong>성능 징후:</strong> GPU 간 분산 대량 통신 시 소켓 지연 시간(Latency)이 보통 10~50마이크로초 이상 발생하여 GPU가 연산을 중단하고 데이터 동기화를 대기하는 병목이 생성됩니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 참고 사항:</strong> TCP 소켓 통신을 사용할 경우 CPU 코어 중 일부가 네트워킹 소프트웨어 인터럽트(softirq) 처리에 100% 포화되는 현상이 빈발합니다.</li>
        </ul>
      `
    },
    rdma: {
      console: `# RDMA libibverbs APIs for Direct Memory Access (Kernel Bypass)
$ cat rdma_sender.c
// 1. Allocate Protection Domain & Register Memory Region (Zero-Copy Pinning)
struct ibv_pd *pd = ibv_alloc_pd(context);
struct ibv_mr *mr = <span class="console-highlight">ibv_reg_mr(pd, buf, size, IBV_ACCESS_LOCAL_WRITE | IBV_ACCESS_REMOTE_WRITE);<span class="console-tooltip">ibv_reg_mr(): 송수신 버퍼 메모리 주소를 등록하고 물리 RAM 메모리에 고정(Pinning)하여, OS 페이징 아웃을 방지하고 RNIC 장치가 DMA를 통해 다이렉트로 주소를 읽고 쓸 수 있도록 가상-물리 주소를 맵핑합니다.</span></span>

// 2. Post Send to Queue Pair directly bypassing OS kernel
struct ibv_send_wr wr, *bad_wr = NULL;
wr.wr.rdma.remote_addr = remote_addr;
wr.wr.rdma.rkey = remote_rkey;
<span class="console-highlight">ibv_post_send(qp, &wr, &bad_wr);<span class="console-tooltip">ibv_post_send(): OS 커널 네트워크 스택을 완전히 건너뛰고 RNIC 하드웨어의 송신 큐(Send Queue)에 직접 전송 요청(Work Request)을 등록하여 전송 속도 지연을 극단적으로 줄입니다. (Kernel Bypass)</span></span>

# CPU stats show near-zero system overhead during RDMA transfer
$ mpstat -P ALL 1
CPU    %usr   <span class="console-highlight">%sys<span class="console-tooltip">%sys: RDMA 동작 시 데이터 이동 연산 전체가 NIC 하드웨어로 오프로드(Offloading)되어 커널 스택 점유율이 0.15% 미만으로 거의 0에 수렴합니다.</span></span>   %iowait   %idle
all    1.10   <span class="console-highlight">0.15</span>     0.10   98.65`,
      analysis: `
        <p style="font-size: 0.95rem; margin-bottom: 12px;"><i class="fa-solid fa-circle-info" style="color: #8b5cf6; margin-right: 6px;"></i><strong>RDMA 전송 매커니즘 (커널 우회 및 하드웨어 가속)</strong></p>
        <ul style="margin-left: 16px; margin-bottom: 0;">
          <li style="margin-bottom: 6px;"><strong>Kernel Bypass:</strong> 애플리케이션이 libibverbs를 이용해 RNIC(RDMA NIC) 하드웨어에 직접 명령을 내리므로, 운영체제 <strong>컨텍스트 스위칭 및 네트워킹 시스템 콜이 완전히 생략</strong>됩니다.</li>
          <li style="margin-bottom: 6px;"><strong>Zero-Copy:</strong> 사전에 주소를 등록(Memory Registration)하여 메모리 영역을 물리적으로 고정(Pinning)한 뒤, RNIC 장치 간에 PCIe DMA를 통하여 원격 메모리로 데이터를 다이렉트로 복사합니다. 커널 내 버퍼 중간 복사가 전혀 없습니다.</li>
          <li style="margin-bottom: 6px;"><strong>초저지연 & 고성능:</strong> RTT 네이티브 네트워크 지연 시간이 1마이크로초 미만(sub-microsecond)으로 보장되며, 분산 학습 중인 수만 개의 GPU가 대규모 그래디언트를 통신 지연 없이 동기화할 수 있게 됩니다.</li>
          <li style="margin-bottom: 0;"><strong>SRE 참고 사항:</strong> 대규모 연산이 활성화된 분산 AI 네트워크 환경(예: RoCEv2)에서는 스위치의 PFC 혼잡 스택 설정 누락 등으로 인한 TCP 폴백을 방지하는 것이 가장 핵심 모니터링 가치입니다.</li>
        </ul>
      `
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
    },
    "network-q01-tcp-handshake": {
      title: "TCP 3-Way Handshake 기본 메커니즘 및 장애 조치",
      icon: "fa-solid fa-network-wired",
      summary: "네트워크 세션을 수립할 때 사용하는 TCP 3-way handshake의 동작 원리와 발생할 수 있는 주요 패킷 유실 상황 및 SRE 관점의 문제 해결 방안을 검증합니다.",
      questions: [
        "왜 TCP 핸드쉐이크는 2단계나 4단계가 아닌 3단계여야 하는가?",
        "SYN Flooding 공격의 원리와 이를 완화하기 위한 Linux 커널 설정은?",
        "마지막 ACK 패킷이 유실되었을 때 클라이언트와 서버의 상태 차이는?"
      ],
      skills: [
        "tcpdump를 활용한 실시간 TCP 핸드쉐이크 패킷(SYN, SYN-ACK, ACK) 캡처 및 필터링",
        "ss -tan 및 netstat을 통한 TCP 소켓 연결 상태(SYN_SENT, SYN_RECV, ESTABLISHED) 모니터링",
        "sysctl 커널 파라미터(tcp_syncookies, tcp_max_syn_backlog) 튜닝을 통한 네트워크 보안강화"
      ]
    },
    "network-q02-dns-resolution": {
      title: "도메인 접속 시 웹 통신 전 과정 흐름 및 장애 격리",
      icon: "fa-solid fa-globe",
      summary: "브라우저 주소창에 도메인을 입력하고 진입할 때 일어나는 DNS 조회, TCP, TLS, HTTP 트랜잭션 및 렌더링 생명주기와 계층별 트러블슈팅 방법을 평가합니다.",
      questions: [
        "DNS 조회의 재귀적(Recursive) 탐색 방식과 반복적(Iterative) 탐색 방식의 차이는?",
        "TLS 1.3 핸드쉐이크가 이전 버전에 비해 연결 지연시간(RTT)을 단축할 수 있는 이유는?",
        "HTTP 응답 코드가 502 Bad Gateway인 경우, 로드 밸런서와 백엔드 서버 중 어디를 디버깅해야 하는가?"
      ],
      skills: [
        "dig +trace를 활용한 도메인 위임 및 네임서버 조회 경로 추적",
        "openssl s_client를 사용한 TLS 협상 상태 및 인증서 신뢰 체인 유효성 분석",
        "curl -v 헤더 분석 및 브라우저 CRP(Critical Rendering Path) 단계별 로딩 최적화"
      ]
    },
    "network-q03-high-latency": {
      title: "사용자 서비스 지연 및 다차원 인프라 병목 격리",
      icon: "fa-solid fa-gauge-simple-high",
      summary: "애플리케이션 레이어부터 분산 GPU 클러스터의 RDMA 전송망까지 발생 가능한 다차원 지연(Latency) 현상을 정량 메트릭과 로그 분석을 통해 구간별로 격리하고 원인을 해결합니다.",
      questions: [
        "지연 발생 시 네트워크 회선의 유실률인지 애플리케이션의 연산 병목인지 진단하는 기준은?",
        "PostgreSQL DB 트랜잭션 락 경합 시 lock 대기 쿼리와 blocking 쿼리를 매핑하는 방법은?",
        "AI 분산 GPU 클러스터에서 RoCE RDMA 통신이 일반 커널 TCP로 Fallback되어 지연이 생기는 원인은?"
      ],
      skills: [
        "ping, traceroute, tcpdump 및 SACK 옵션을 통한 WAN 패킷 소실 및 TCP 재전송 분석",
        "pg_stat_activity 및 pg_locks 조인을 활용한 DB 데드락 및 트랜잭션 exclusive lock 경합 식별",
        "iostat -xz 및 df -h를 활용한 디스크 IOPS 포화도 및 NFS 파일 시스템 마운트 블로킹 분석",
        "RoCE PFC/ECN 혼잡 제어 및 sysfs 설정을 조율한 초고속 RDMA 무손실 전송 상태 교정"
      ]
    },
    "network-q04-l4-vs-l7-load-balancer": {
      title: "L4 vs L7 로드 밸런서 매커니즘 차이 및 프록싱 구조",
      icon: "fa-solid fa-code-branch",
      summary: "전송 계층(L4)과 애플리케이션 계층(L7) 로드 밸런서의 동작 방식 차이, TCP 세션 종단 유무, HTTP 페이로드 기반 라우팅 및 SSL 복호화 등의 아키텍처적 장단점을 검증합니다.",
      questions: [
        "L4 로드 밸런서의 패킷 레벨 포워딩(NAT/DSR)과 L7 로드 밸런서의 Reverse Proxy 중 RTT 지연이 더 낮은 방식은?",
        "L7 Ingress Controller가 SSL/TLS Termination(종단)을 수행할 때 백엔드 애플리케이션이 얻는 성능상 이점은?",
        "클라이언트의 원본 IP를 유실하지 않기 위해 L7 로드 밸런서가 백엔드 서버로 전달하는 HTTP 헤더와 속성은 무엇인가?"
      ],
      skills: [
        "ipvsadm 및 iptables를 활용한 L4 패킷 포워딩 및 커널 기반 분배 설정 모니터링",
        "nginx.conf upstream 블록 및 proxy_pass, X-Forwarded-For 헤더 전송 튜닝",
        "L7 SSL/TLS 복호화 인증서 마운트 및 Ingress 경로 기반(Path-based) 서비스 라우팅 구성",
        "Sticky Cookie 및 세션 타임아웃을 연동한 애플리케이션 상태 유지 기법 설계"
      ]
    },
    "network-q05-packet-loss": {
      title: "패킷 유실 분석 및 네트워크 트러블슈팅 방법론",
      icon: "fa-solid fa-triangle-exclamation",
      summary: "네트워크 패킷 유실의 근본 원인을 파악하기 위한 진단 흐름과 명령어 사용법, 그리고 대규모 연산/스토리지 환경(MTU Black Hole, RDMA PFC)에서의 에러 복구 기법을 다룹니다.",
      questions: [
        "패킷 유실률과 RTT 평균값이 모순되게 나타날 때 원인은?",
        "Jumbo Frame을 사용할 때 발생하는 MTU Mismatch 블랙홀 현상의 원인과 진단 커맨드는?",
        "RDMA 통신 중 패킷 유실이 감지되어 일반 TCP로 폴백(Fallback)될 때 발생하는 성능 손상과 해결 방법은?"
      ],
      skills: [
        "ping 및 mtr 명령어를 이용한 종단 간 패킷 드랍 및 홉별 유실률 격리 분석",
        "ip -s link 및 ethtool -S를 통한 NIC 물리 에러(rx_crc_errors) 탐지",
        "tcpdump 패킷 분석을 이용한 중복 ACK 및 TCP Retransmission(재전송) 이벤트 추적",
        "RoCE 우선순위 흐름 제어(PFC) 활성화 및 sysfs를 활용한 무손실 이더넷 망 검증"
      ]
    },
    "gpu-q01-rdma-vs-tcp": {
      title: "TCP vs RDMA 통신 메커니즘 및 GPU 클러스터 가속",
      icon: "fa-solid fa-microchip",
      summary: "표준 네트워킹 스택(TCP)과 원격 메모리 직접 접근(RDMA) 프로토콜의 아키텍처적 차이점을 메모리 복사 횟수, 커널 스택 개입 여부, 지연 시간 관점에서 파악하고 분산 GPU 연산에 필요한 하드웨어 가속 원리를 분석합니다.",
      questions: [
        "TCP 소켓 API를 이용할 때 발생하는 2회의 메모리 복사 작업과 컨텍스트 스위칭의 동작은?",
        "RDMA의 Kernel Bypass 및 Zero-Copy가 지연 시간을 1마이크로초 미만으로 단축시킬 수 있는 기전은?",
        "대규모 분산 학습망(NCCL)에서 RDMA가 차단되어 TCP로 Fallback될 때 성능 병목이 생기는 원인은?"
      ],
      skills: [
        "ibverbs 라이브러리 API(ibv_reg_mr, ibv_post_send) 및 RDMA 큐 페어 전송 설계",
        "PCIe DMA 메모리 맵핑 및 가상-물리 메모리 고정(Pinning) 기법 검증",
        "NCCL Collective Communication 네트워크 인터페이스 바인딩 분석",
        "mpstat 및 tcpdump를 활용한 소켓 네트워크 연산 시 CPU 스택 부하 측정"
      ]
    },
    "gpu-q02-roce": {
      title: "RoCE(RDMA over Converged Ethernet) 설계 및 무손실 제어",
      icon: "fa-solid fa-bolt",
      summary: "인피니밴드 전용 하드웨어 대신 범용 이더넷 장비를 활용해 고성능 RDMA 통신을 구축하는 RoCE 기술의 특성과, 무손실 이더넷(PFC, ECN) 환경을 구축하기 위해 요구되는 최적화 기법을 다룹니다.",
      questions: [
        "RoCEv1 (L2 기반)과 RoCEv2 (L3 UDP/IP 캡슐화 기반)의 네트워킹 차이점은 무엇인가?",
        "패킷 유실 방지를 위한 PFC(Priority Flow Control) 흐름 제어의 동작 및 스위치 데드락 해소법은?",
        "ECN(Explicit Congestion Notification)이 활성화되어 혼잡 패킷을 감속 제어(DCQCN)하는 기전은?"
      ],
      skills: [
        "ethtool 및 sysfs를 사용한 포트별 PFC(PAUSE 프레임) 및 ECN 카운터 모니터링",
        "스위치 PFC 우선순위 큐 맵핑 및 대역폭 파티셔닝 정책 상태 진단",
        "libibverbs 도구(ibv_devinfo, rping)를 사용한 L3 라우팅 구간 RoCEv2 정상성 점검",
        "NCCL 및 MPI 환경에서의 GPUDirect RDMA(GDR) 활성화 여부 프로파일링"
      ]
    },
    "gpu-q03-vast-storage": {
      title: "VAST Storage 및 분산 학습 스토리지 성능 트러블슈팅",
      icon: "fa-solid fa-database",
      summary: "GPU 클러스터 환경에서 대용량 가중치 및 체크포인트 쓰기 성능이 급격히 저하된 장애 사례를 기반으로, 스토리지-네트워크-드라이버 계층을 체계적으로 검사하여 원인을 규명(RCA)하는 과정을 분석합니다.",
      questions: [
        "체크포인트 쓰기 성능이 기대 성능(40 GB/s) 대비 TCP 대역폭(9.7 GB/s) 수준으로 저하된 원인은?",
        "스토리지 병목, 네트워크 스위치 유실, RDMA 폴백 현상을 계층별로 검증하는 순서는?",
        "드라이버와 커널 소프트웨어 호환성 장애로 발생하는 저수준 입출력 병목 디버깅 방안은?"
      ],
      skills: [
        "FIO 및 스토리지 벤치마크 도구를 활용한 IOPS 및 Throughput 성능 지표 측정",
        "ethtool 및 rdma-tool을 사용한 커널 드라이버 연결 및 가속 활성화 진단",
        "분산 연산(NCCL) 환경과 VAST 스토리지 성능 통계 대조 분석",
        "RCA 보고서 작성 및 재발 방지를 위한 계층별 시스템 성능 체크리스트 구축"
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
    } else if (doc.category === "Networking" && doc.sections.length > 2) {
      renderNetworkingLayout(doc);
    } else if (doc.category === "Coding" && doc.id !== 'coding_preparation_master_plan') {
      renderCodingLayout(doc);
    } else if (doc.category === "GPU & AI Infrastructure" && doc.sections.length > 2) {
      renderGpuLayout(doc);
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
    const interviewQuestion = doc.sections.find(s => s.title.toLowerCase() === "interview question");
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
                <pre><code id="memoryConsoleOutput" style="color:#e2e8f0;">${memoryLeakData.growth.console}</code></pre>
              </div>
            </div>
          </div>
          <div class="layout-right" style="flex:1 1 300px;">
            <div class="study-card" style="margin-bottom:0; height:100%;">
              <div class="card-tabs"><span class="tab-btn active" style="cursor:default">메모리 상태 분석 & 트러블슈팅</span></div>
              <div class="card-body" id="memoryAnalysisText" style="line-height:1.6; font-size:0.9rem;">
                ${memoryLeakData.growth.analysis}
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
                <pre><code id="crashConsoleOutput" style="color:#e2e8f0;">${processCrashData.status.console}</code></pre>
              </div>
            </div>
          </div>
          <div class="layout-right" style="flex:1 1 300px;">
            <div class="study-card" style="margin-bottom:0; height:100%;">
              <div class="card-tabs"><span class="tab-btn active" style="cursor:default">크래시 원인 및 복구 분석</span></div>
              <div class="card-body" id="crashAnalysisText" style="line-height:1.6; font-size:0.9rem;">
                ${processCrashData.status.analysis}
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

  // 3.5 NETWORKING INTERVIEW QUESTION RENDERER (TCP Handshake flow simulator, SRE insights, tooltips)
  function renderNetworkingLayout(doc) {
    el.contentArea.classList.add('wide-layout');
    const currentStatus = getStatus(doc.id);

    // Extract key sections
    const intent = doc.sections.find(s => s.title.includes("Intent"));
    const english = doc.sections.find(s => s.title.includes("English") || s.title.includes("Answer"));
    const korean = doc.sections.find(s => s.title.includes("Korean"));
    const followups = doc.sections.find(s => s.title.includes("Follow-up"));
    const notes = doc.sections.find(s => s.title.includes("Notes"));
    const concepts = doc.sections.find(s => s.title.includes("Concepts"));
    const troubleshooting = doc.sections.find(s => s.title.includes("Troubleshooting"));
    const commands = doc.sections.find(s => s.title.includes("Commands"));

    let html = buildHeaderHTML(doc, currentStatus);

    // Render Interview Question if it exists
    const interviewQuestion = doc.sections.find(s => s.title.toLowerCase() === "interview question");
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

    if (OVERVIEW_DATA[doc.id]) {
      html += buildOverviewCard(doc.id);
    }

    // Interactive Visualizer for network-q01-tcp-handshake
    if (doc.id === 'network-q01-tcp-handshake') {
      html += `
        <h2 style="font-family: var(--font-heading); margin-bottom:12px; font-size:1.30rem; margin-top: 24px;">
          <i class="fa-solid fa-network-wired" style="color:hsl(var(--accent)); margin-right:8px;"></i>
          TCP 3-Way Handshake Interactive Flow Simulator (TCP 3-Way 핸드쉐이크 시뮬레이터)
        </h2>
        
        <div class="tcp-visualizer-card" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
          <!-- Visual diagram row -->
          <div class="network-nodes-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; position: relative; padding: 10px 0;">
            
            <!-- Client Node -->
            <div class="network-node client" id="tcpClientNode" style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 12px; padding: 16px; width: 180px; text-align: center; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15); transition: all 0.3s ease;">
              <div style="font-size: 1.5rem; color: #0ea5e9; margin-bottom: 8px;"><i class="fa-solid fa-laptop"></i></div>
              <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; color: var(--text-primary);">Client (Browser)</div>
              <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
                IP: 192.168.1.10<br>Port: 49152
              </div>
              <div id="tcpClientState" class="tcp-state-badge" style="display: inline-block; margin-top: 10px; padding: 4px 8px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; background: #334155; color: #cbd5e1; font-family: var(--font-mono);">CLOSED</div>
            </div>
            
            <!-- Connection Lane -->
            <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 24px; position: relative; height: 50px; display: flex; align-items: center; justify-content: center;">
              <div class="packet-lane-line" id="tcpPacketLane" style="width: 100%; height: 4px; background: #334155; border-radius: 2px; position: relative; transition: all 0.3s ease;">
                <!-- Animated packet dot -->
                <div class="animated-packet-dot" id="animatedPacketDot" style="width: 12px; height: 12px; background-color: #10b981; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); opacity: 0; box-shadow: 0 0 10px #10b981; transition: none;"></div>
                <!-- Direction indicator arrow -->
                <div class="packet-direction-arrow" id="packetDirectionArrow" style="position: absolute; top: -18px; left: 50%; transform: translateX(-50%); font-size: 0.75rem; font-weight: bold; color: #cbd5e1; background: #1e293b; padding: 2px 8px; border-radius: 4px; border: 1px solid var(--border-color); display: none;">
                  SYN <i class="fa-solid fa-arrow-right"></i>
                </div>
              </div>
            </div>
            
            <!-- Server Node -->
            <div class="network-node server" id="tcpServerNode" style="background: rgba(16, 185, 129, 0.05); border: 2px solid #10b981; border-radius: 12px; padding: 16px; width: 180px; text-align: center; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15); transition: all 0.3s ease;">
              <div style="font-size: 1.5rem; color: #10b981; margin-bottom: 8px;"><i class="fa-solid fa-server"></i></div>
              <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; color: var(--text-primary);">Server (Nginx)</div>
              <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
                IP: 10.0.0.5<br>Port: 80
              </div>
              <div id="tcpServerState" class="tcp-state-badge" style="display: inline-block; margin-top: 10px; padding: 4px 8px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; background: #334155; color: #cbd5e1; font-family: var(--font-mono);">LISTEN</div>
            </div>
          </div>
          
          <!-- Interactive selector grid -->
          <div class="cpu-dial-grid" id="tcpStepGrid" style="grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
            <div class="cpu-dial-card active" data-step="syn" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: hsl(var(--accent)); text-transform: uppercase;">Step 1</div>
              <div style="font-weight: 700; font-size: 1.1rem; margin: 4px 0 2px 0;">SYN</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Client Connection Request</div>
            </div>
            <div class="cpu-dial-card" data-step="synack" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Step 2</div>
              <div style="font-weight: 700; font-size: 1.1rem; margin: 4px 0 2px 0;">SYN-ACK</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Server Response & Sync</div>
            </div>
            <div class="cpu-dial-card" data-step="ack" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Step 3</div>
              <div style="font-weight: 700; font-size: 1.1rem; margin: 4px 0 2px 0;">ACK</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Client Acknowledgment</div>
            </div>
            <div class="cpu-dial-card" data-step="established" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Step 4</div>
              <div style="font-weight: 700; font-size: 1.1rem; margin: 4px 0 2px 0;"><i class="fa-solid fa-circle-check" style="color: #10b981; font-size:0.95rem; margin-right:4px;"></i>ESTABLISHED</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Bidirectional Data Session</div>
            </div>
          </div>
          
          <!-- Output layout split -->
          <div class="layout-split" style="margin-bottom: 0;">
            <div class="layout-left" style="flex:1 1 500px; max-width: 100%;">
              <div class="mock-terminal-wrapper" style="margin-bottom: 0; height:100%;">
                <div class="terminal-tab-bar">
                  <span class="terminal-tab active" id="tcpTerminalTitle"><i class="fa-solid fa-terminal" style="margin-right:6px;"></i>tcpdump Packet Capture Console</span>
                </div>
                <div class="terminal-screen" style="min-height: 180px; padding: 16px; position:relative; overflow: visible;">
                  <div style="font-family: var(--font-mono); font-size: 0.75rem; color: #64748b; margin-bottom: 8px;"># Capture Interface: eth0 (IP 192.168.1.10)</div>
                  <pre><code id="tcpConsoleOutput" style="color:#e2e8f0; white-space: pre-wrap; font-size: 0.85rem; font-family: var(--font-mono); display: block;"></code></pre>
                </div>
              </div>
            </div>
            
            <div class="layout-right" style="flex:1 1 350px;">
              <div class="study-card" style="margin-bottom:0; height:100%;">
                <div class="card-tabs"><span class="tab-btn active" style="cursor:default">단계별 분석 & SRE 장애 포인트</span></div>
                <div class="card-body" id="tcpAnalysisText" style="line-height:1.6; font-size:0.9rem; padding: 18px;">
                  <!-- Populated by JS -->
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (doc.id === 'network-q02-dns-resolution') {
      html += `
        <h2 style="font-family: var(--font-heading); margin-bottom:12px; font-size:1.30rem; margin-top: 24px;">
          <i class="fa-solid fa-globe" style="color:hsl(var(--accent)); margin-right:8px;"></i>
          Web Request Lifecycle Interactive Simulator (웹 요청 생명주기 시뮬레이터)
        </h2>
        
        <div class="tcp-visualizer-card" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
          <!-- Visual diagram row -->
          <div class="dns-nodes-diagram" id="dnsNodesDiagram" style="background: rgba(0,0,0,0.15); border-radius: 12px; padding: 20px; border: 1px dashed var(--border-color); margin-bottom: 24px; position: relative; min-height: 180px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 16px; transition: all 0.3s ease;">
             <!-- Dynamically updated by JS -->
          </div>
          
          <!-- Interactive selector grid -->
          <div class="cpu-dial-grid" id="dnsStepGrid" style="grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 24px;">
            <div class="cpu-dial-card active" data-step="dns" style="padding: 10px;">
              <div style="font-weight: 800; font-size: 0.7rem; color: hsl(var(--accent)); text-transform: uppercase;">Phase 1</div>
              <div style="font-weight: 700; font-size: 0.95rem; margin: 4px 0 2px 0;">DNS 조회</div>
              <div style="font-size: 0.65rem; color: var(--text-secondary);">DNS Resolution</div>
            </div>
            <div class="cpu-dial-card" data-step="tcp" style="padding: 10px;">
              <div style="font-weight: 800; font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase;">Phase 2</div>
              <div style="font-weight: 700; font-size: 0.95rem; margin: 4px 0 2px 0;">TCP 연결</div>
              <div style="font-size: 0.65rem; color: var(--text-secondary);">3-Way Handshake</div>
            </div>
            <div class="cpu-dial-card" data-step="tls" style="padding: 10px;">
              <div style="font-weight: 800; font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase;">Phase 3</div>
              <div style="font-weight: 700; font-size: 0.95rem; margin: 4px 0 2px 0;">TLS 암호화</div>
              <div style="font-size: 0.65rem; color: var(--text-secondary);">Security Tunnel</div>
            </div>
            <div class="cpu-dial-card" data-step="http" style="padding: 10px;">
              <div style="font-weight: 800; font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase;">Phase 4</div>
              <div style="font-weight: 700; font-size: 0.95rem; margin: 4px 0 2px 0;">HTTP GET</div>
              <div style="font-size: 0.65rem; color: var(--text-secondary);">Data Exchange</div>
            </div>
            <div class="cpu-dial-card" data-step="render" style="padding: 10px;">
              <div style="font-weight: 800; font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase;">Phase 5</div>
              <div style="font-weight: 700; font-size: 0.95rem; margin: 4px 0 2px 0;">화면 렌더링</div>
              <div style="font-size: 0.65rem; color: var(--text-secondary);">CRP Page Draw</div>
            </div>
          </div>
          
          <!-- Output layout split -->
          <div class="layout-split" style="margin-bottom: 0;">
            <div class="layout-left" style="flex:1 1 500px; max-width: 100%;">
              <div class="mock-terminal-wrapper" style="margin-bottom: 0; height:100%;">
                <div class="terminal-tab-bar">
                  <span class="terminal-tab active" id="dnsTerminalTitle"><i class="fa-solid fa-terminal" style="margin-right:6px;"></i>Command Output Console</span>
                </div>
                <div class="terminal-screen" style="min-height: 200px; padding: 16px; position:relative; overflow: visible;">
                  <pre><code id="dnsConsoleOutput" style="color:#e2e8f0; white-space: pre-wrap; font-size: 0.85rem; font-family: var(--font-mono); display: block;"></code></pre>
                </div>
              </div>
            </div>
            
            <div class="layout-right" style="flex:1 1 350px;">
              <div class="study-card" style="margin-bottom:0; height:100%;">
                <div class="card-tabs"><span class="tab-btn active" style="cursor:default">단계별 분석 & SRE 장애 포인트</span></div>
                <div class="card-body" id="dnsAnalysisText" style="line-height:1.6; font-size:0.9rem; padding: 18px;">
                  <!-- Populated by JS -->
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (doc.id === 'network-q03-high-latency') {
      html += `
        <h2 style="font-family: var(--font-heading); margin-bottom:12px; font-size:1.30rem; margin-top: 24px;">
          <i class="fa-solid fa-gauge-simple-high" style="color:hsl(var(--accent)); margin-right:8px;"></i>
          Distributed System Latency Diagnostic Sandbox (분산 시스템 지연 진단 샌드박스)
        </h2>
        
        <div class="tcp-visualizer-card" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
          <!-- Visual diagram row -->
          <div class="dns-nodes-diagram" id="latencyNodesDiagram" style="background: rgba(0,0,0,0.15); border-radius: 12px; padding: 20px; border: 1px dashed var(--border-color); margin-bottom: 24px; position: relative; min-height: 160px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 16px; transition: all 0.3s ease;">
             <!-- Dynamically updated by JS -->
          </div>
          
          <!-- Interactive selector grid -->
          <div class="cpu-dial-grid" id="latencyStepGrid" style="grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
            <div class="cpu-dial-card active" data-scenario="packet_loss" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: hsl(var(--accent)); text-transform: uppercase;">Scenario 1</div>
              <div style="font-weight: 700; font-size: 1.05rem; margin: 4px 0 2px 0;"><i class="fa-solid fa-network-wired" style="margin-right:4px;"></i>패킷 유실</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Packet Loss & Retransmit</div>
            </div>
            <div class="cpu-dial-card" data-scenario="db_lock" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Scenario 2</div>
              <div style="font-weight: 700; font-size: 1.05rem; margin: 4px 0 2px 0;"><i class="fa-solid fa-database" style="margin-right:4px;"></i>DB 락 경합</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Database Lock Contention</div>
            </div>
            <div class="cpu-dial-card" data-scenario="storage" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Scenario 3</div>
              <div style="font-weight: 700; font-size: 1.05rem; margin: 4px 0 2px 0;"><i class="fa-solid fa-hard-drive" style="margin-right:4px;"></i>스토리 병목</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Storage IOPS Saturation</div>
            </div>
            <div class="cpu-dial-card" data-scenario="rdma_fallback" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Scenario 4</div>
              <div style="font-weight: 700; font-size: 1.05rem; margin: 4px 0 2px 0;"><i class="fa-solid fa-server" style="margin-right:4px;"></i>RDMA 폴백</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">GPU Cluster TCP Fallback</div>
            </div>
          </div>
          
          <!-- Output layout split -->
          <div class="layout-split" style="margin-bottom: 0;">
            <div class="layout-left" style="flex:1 1 500px; max-width: 100%;">
              <div class="mock-terminal-wrapper" style="margin-bottom: 0; height:100%;">
                <div class="terminal-tab-bar">
                  <span class="terminal-tab active" id="latencyTerminalTitle"><i class="fa-solid fa-terminal" style="margin-right:6px;"></i>Diagnostic Terminal Output</span>
                </div>
                <div class="terminal-screen" style="min-height: 200px; padding: 16px; position:relative; overflow: visible;">
                  <pre><code id="latencyConsoleOutput" style="color:#e2e8f0; white-space: pre-wrap; font-size: 0.85rem; font-family: var(--font-mono); display: block;"></code></pre>
                </div>
              </div>
            </div>
            
            <div class="layout-right" style="flex:1 1 350px;">
              <div class="study-card" style="margin-bottom:0; height:100%;">
                <div class="card-tabs"><span class="tab-btn active" style="cursor:default">장애 구간 격리 분석 & RCA 대책</span></div>
                <div class="card-body" id="latencyAnalysisText" style="line-height:1.6; font-size:0.9rem; padding: 18px;">
                  <!-- Populated by JS -->
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (doc.id === 'network-q04-l4-vs-l7-load-balancer') {
      html += `
        <h2 style="font-family: var(--font-heading); margin-bottom:12px; font-size:1.30rem; margin-top: 24px;">
          <i class="fa-solid fa-code-branch" style="color:hsl(var(--accent)); margin-right:8px;"></i>
          L4 vs L7 Load Balancer Visual Flow Simulator (L4 vs L7 로드 밸런서 비교 시뮬레이터)
        </h2>
        
        <div class="tcp-visualizer-card" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
          <!-- Visual diagram row -->
          <div class="dns-nodes-diagram" id="lbNodesDiagram" style="background: rgba(0,0,0,0.15); border-radius: 12px; padding: 20px; border: 1px dashed var(--border-color); margin-bottom: 24px; position: relative; min-height: 160px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 16px; transition: all 0.3s ease;">
             <!-- Dynamically updated by JS -->
          </div>
          
          <!-- Interactive selector grid -->
          <div class="cpu-dial-grid" id="lbStepGrid" style="grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
            <div class="cpu-dial-card active" data-step="l4" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: hsl(var(--accent)); text-transform: uppercase;">Transport Layer (L4)</div>
              <div style="font-weight: 700; font-size: 1.05rem; margin: 4px 0 2px 0;"><i class="fa-solid fa-network-wired" style="margin-right:4px;"></i>L4 패킷 포워딩</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Layer 4 connection routing</div>
            </div>
            <div class="cpu-dial-card" data-step="l7" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Application Layer (L7)</div>
              <div style="font-weight: 700; font-size: 1.05rem; margin: 4px 0 2px 0;"><i class="fa-solid fa-server" style="margin-right:4px;"></i>L7 세션 프록시</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Layer 7 reverse proxying</div>
            </div>
          </div>
          
          <!-- Output layout split -->
          <div class="layout-split" style="margin-bottom: 0;">
            <div class="layout-left" style="flex:1 1 500px; max-width: 100%;">
              <div class="mock-terminal-wrapper" style="margin-bottom: 0; height:100%;">
                <div class="terminal-tab-bar">
                  <span class="terminal-tab active" id="lbTerminalTitle"><i class="fa-solid fa-terminal" style="margin-right:6px;"></i>Load Balancer Command Output</span>
                </div>
                <div class="terminal-screen" style="min-height: 200px; padding: 16px; position:relative; overflow: visible;">
                  <pre><code id="lbConsoleOutput" style="color:#e2e8f0; white-space: pre-wrap; font-size: 0.85rem; font-family: var(--font-mono); display: block;"></code></pre>
                </div>
              </div>
            </div>
            
            <div class="layout-right" style="flex:1 1 350px;">
              <div class="study-card" style="margin-bottom:0; height:100%;">
                <div class="card-tabs"><span class="tab-btn active" style="cursor:default">프록시 중계 방식 및 커넥션 분석</span></div>
                <div class="card-body" id="lbAnalysisText" style="line-height:1.6; font-size:0.9rem; padding: 18px;">
                  <!-- Populated by JS -->
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (doc.id === 'network-q05-packet-loss') {
      html += `
        <h2 style="font-family: var(--font-heading); margin-bottom:12px; font-size:1.30rem; margin-top: 24px;">
          <i class="fa-solid fa-triangle-exclamation" style="color:hsl(var(--accent)); margin-right:8px;"></i>
          Packet Loss & Retransmission Diagnostic Simulator (패킷 유실 및 재전송 진단 시뮬레이터)
        </h2>
        
        <div class="tcp-visualizer-card" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
          <!-- Visual diagram row -->
          <div class="dns-nodes-diagram" id="packetLossNodesDiagram" style="background: rgba(0,0,0,0.15); border-radius: 12px; padding: 20px; border: 1px dashed var(--border-color); margin-bottom: 24px; position: relative; min-height: 160px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 16px; transition: all 0.3s ease;">
             <!-- Dynamically updated by JS -->
          </div>
          
          <!-- Interactive selector grid -->
          <div class="cpu-dial-grid" id="packetLossStepGrid" style="grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
            <div class="cpu-dial-card active" data-step="congestion" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: hsl(var(--accent)); text-transform: uppercase;">Scenario 1</div>
              <div style="font-weight: 700; font-size: 1.05rem; margin: 4px 0 2px 0;"><i class="fa-solid fa-server" style="margin-right:4px;"></i>네트워크 혼잡</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Buffer Queue Overflow</div>
            </div>
            <div class="cpu-dial-card" data-step="mtu" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Scenario 2</div>
              <div style="font-weight: 700; font-size: 1.05rem; margin: 4px 0 2px 0;"><i class="fa-solid fa-compress" style="margin-right:4px;"></i>MTU 불일치</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Jumbo Frame Blackhole</div>
            </div>
            <div class="cpu-dial-card" data-step="crc" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Scenario 3</div>
              <div style="font-weight: 700; font-size: 1.05rem; margin: 4px 0 2px 0;"><i class="fa-solid fa-plug" style="margin-right:4px;"></i>물리 에러 (CRC)</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Faulty Cable / Noise</div>
            </div>
            <div class="cpu-dial-card" data-step="rdma_fallback" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Scenario 4</div>
              <div style="font-weight: 700; font-size: 1.05rem; margin: 4px 0 2px 0;"><i class="fa-solid fa-bolt" style="margin-right:4px;"></i>RDMA 폴백</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Lossless PFC Fallback</div>
            </div>
          </div>
          
          <!-- Output layout split -->
          <div class="layout-split" style="margin-bottom: 0;">
            <div class="layout-left" style="flex:1 1 500px; max-width: 100%;">
              <div class="mock-terminal-wrapper" style="margin-bottom: 0; height:100%;">
                <div class="terminal-tab-bar">
                  <span class="terminal-tab active" id="packetLossTerminalTitle"><i class="fa-solid fa-terminal" style="margin-right:6px;"></i>Diagnostic Console</span>
                </div>
                <div class="terminal-screen" style="min-height: 200px; padding: 16px; position:relative; overflow: visible;">
                  <pre><code id="packetLossConsoleOutput" style="color:#e2e8f0; white-space: pre-wrap; font-size: 0.85rem; font-family: var(--font-mono); display: block;"></code></pre>
                </div>
              </div>
            </div>
            
            <div class="layout-right" style="flex:1 1 350px;">
              <div class="study-card" style="margin-bottom:0; height:100%;">
                <div class="card-tabs"><span class="tab-btn active" style="cursor:default">장애 기전 및 SRE 분석 대책</span></div>
                <div class="card-body" id="packetLossAnalysisText" style="line-height:1.6; font-size:0.9rem; padding: 18px;">
                  <!-- Populated by JS -->
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Accordion: Interviewer's Intent
    if (intent) {
      html += buildAccordion("Interviewer's Intent (면접관의 질문 의도)", intent.content);
    }

    // Render Answer split tab card
    if (english || korean) {
      html += `
        <div class="study-card">
          <div class="card-tabs">
            <button class="tab-btn active" id="netTabEng">Recommended English Answer</button>
            <button class="tab-btn" id="netTabKor">Korean Summary</button>
          </div>
          <div class="card-body">
            <div class="tab-content active" id="netContentEng">
              ${wrapActiveRecall(english ? english.content : '')}
            </div>
            <div class="tab-content" id="netContentKor">
              ${buildInterlinearHTML(english ? english.content : '', korean ? korean.content : '')}
            </div>
          </div>
        </div>
      `;
    }

    // Accordion: Concepts / Why Is It Needed? / Troubleshooting
    let prepMaterials = '';
    if (doc.sections.find(s => s.title.includes("Why"))) {
      const whySec = doc.sections.find(s => s.title.includes("Why"));
      prepMaterials += `<h3 style="font-family: var(--font-heading); margin-top: 16px; margin-bottom: 8px; font-size: 1.15rem; color: hsl(var(--accent)); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">${whySec.title}</h3>`;
      prepMaterials += `<div>${convertToInterlinear(whySec.content)}</div>`;
    }
    if (concepts) {
      prepMaterials += `<h3 style="font-family: var(--font-heading); margin-top: 24px; margin-bottom: 8px; font-size: 1.15rem; color: hsl(var(--accent)); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">${concepts.title}</h3>`;
      prepMaterials += `<div>${convertToInterlinear(concepts.content)}</div>`;
    }
    if (troubleshooting) {
      prepMaterials += `<h3 style="font-family: var(--font-heading); margin-top: 24px; margin-bottom: 8px; font-size: 1.15rem; color: hsl(var(--accent)); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">${troubleshooting.title}</h3>`;
      prepMaterials += `<div>${convertToInterlinear(troubleshooting.content)}</div>`;
    }
    if (doc.sections.find(s => s.title.includes("Production"))) {
      const prodSec = doc.sections.find(s => s.title.includes("Production"));
      prepMaterials += `<h3 style="font-family: var(--font-heading); margin-top: 24px; margin-bottom: 8px; font-size: 1.15rem; color: hsl(var(--accent)); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">${prodSec.title}</h3>`;
      prepMaterials += `<div>${convertToInterlinear(prodSec.content)}</div>`;
    }

    // Render other unrendered sections in background knowledge accordion
    const renderedKeys = ['intent', 'english', 'answer', 'korean', 'why', 'concepts', 'troubleshooting', 'production', 'follow-up', 'notes', 'commands', 'status', 'interview question'];
    const unrendered = doc.sections.filter(s => {
      const titleLower = s.title.toLowerCase();
      if (renderedKeys.some(k => titleLower.includes(k))) return false;
      if (doc.sections.length > 0 && s.title === doc.sections[0].title) return false;
      return true;
    });

    unrendered.forEach(sec => {
      prepMaterials += `<h3 style="font-family: var(--font-heading); margin-top: 24px; margin-bottom: 8px; font-size: 1.15rem; color: hsl(var(--accent)); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">${sec.title}</h3>`;
      prepMaterials += `<div>${convertToInterlinear(sec.content)}</div>`;
    });

    if (prepMaterials) {
      html += buildAccordion("TCP Protocol & Troubleshooting Deep Dive (네트워크 핵심 지식 및 장애 대응)", prepMaterials);
    }

    // Interactive Follow-up Question Flip Cards
    if (followups) {
      html += `<h2 style="font-family: var(--font-heading); margin-top:28px; font-size:1.40rem;"><i class="fa-solid fa-graduation-cap" style="color:hsl(var(--accent)); margin-right:8px;"></i> Interactive Follow-up Practice (꼬리 질문 연습)</h2>`;
      html += parseFollowupCards(followups.content);
    }

    // Commands Section
    if (commands) {
      html += `
        <div class="study-card" style="margin-top: 24px;">
          <div class="card-tabs"><span class="tab-btn active" style="cursor:default"><i class="fa-solid fa-terminal" style="margin-right:6px;"></i> Useful Linux Networking Commands</span></div>
          <div class="card-body">
            ${convertToInterlinear(commands.content)}
          </div>
        </div>
      `;
    }

    // Personal Notes
    if (notes) {
      html += buildAccordion("Personal Notes & Study Guide", notes.content);
    }

    el.contentArea.innerHTML = html;

    // Tabs listener for Recommended English Answer & Korean Summary
    const tEng = document.getElementById('netTabEng');
    const tKor = document.getElementById('netTabKor');
    const cEng = document.getElementById('netContentEng');
    const cKor = document.getElementById('netContentKor');

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

    // BIND SIMULATOR LOGIC FOR network-q01-tcp-handshake
    if (doc.id === 'network-q01-tcp-handshake') {
      const stepCards = document.querySelectorAll('#tcpStepGrid .cpu-dial-card');
      const clientState = document.getElementById('tcpClientState');
      const serverState = document.getElementById('tcpServerState');
      const consoleOutput = document.getElementById('tcpConsoleOutput');
      const analysisText = document.getElementById('tcpAnalysisText');
      const packetDot = document.getElementById('animatedPacketDot');
      const directionArrow = document.getElementById('packetDirectionArrow');
      const clientNode = document.getElementById('tcpClientNode');
      const serverNode = document.getElementById('tcpServerNode');
      const laneLine = document.getElementById('tcpPacketLane');

      function updateSimulator(stepKey) {
        const stepData = tcpHandshakeData[stepKey];
        if (!stepData) return;

        // 1. Update states
        clientState.textContent = stepData.clientState;
        serverState.textContent = stepData.serverState;

        // Apply visual highlights to nodes
        clientNode.style.transform = 'scale(1.0)';
        serverNode.style.transform = 'scale(1.0)';
        clientNode.style.boxShadow = '0 4px 10px rgba(14, 165, 233, 0.15)';
        serverNode.style.boxShadow = '0 4px 10px rgba(16, 185, 129, 0.15)';

        if (stepData.clientState === 'ESTABLISHED') {
          clientState.style.background = '#10b981';
          clientState.style.color = '#ffffff';
        } else if (stepData.clientState === 'SYN_SENT') {
          clientState.style.background = '#f59e0b';
          clientState.style.color = '#ffffff';
          clientNode.style.transform = 'scale(1.03)';
          clientNode.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.3)';
        } else {
          clientState.style.background = '#334155';
          clientState.style.color = '#cbd5e1';
        }

        if (stepData.serverState === 'ESTABLISHED') {
          serverState.style.background = '#10b981';
          serverState.style.color = '#ffffff';
        } else if (stepData.serverState === 'SYN_RCVD') {
          serverState.style.background = '#f59e0b';
          serverState.style.color = '#ffffff';
          serverNode.style.transform = 'scale(1.03)';
          serverNode.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.3)';
        } else {
          serverState.style.background = '#334155';
          serverState.style.color = '#cbd5e1';
        }

        // 2. Update logs and descriptions
        consoleOutput.innerHTML = stepData.console;
        analysisText.innerHTML = stepData.analysis;

        // 3. Animate packet
        // Reset classes
        packetDot.className = 'animated-packet-dot';
        packetDot.style.opacity = '1';
        directionArrow.style.display = 'block';

        if (stepData.arrow === 'client-to-server') {
          packetDot.classList.add('to-server');
          directionArrow.innerHTML = `${stepData.packetDesc} <i class="fa-solid fa-arrow-right"></i>`;
          laneLine.style.background = 'linear-gradient(90deg, #0ea5e9, #334155)';
        } else if (stepData.arrow === 'server-to-client') {
          packetDot.classList.add('to-client');
          directionArrow.innerHTML = `<i class="fa-solid fa-arrow-left"></i> ${stepData.packetDesc}`;
          laneLine.style.background = 'linear-gradient(270deg, #10b981, #334155)';
        } else if (stepData.arrow === 'bidirectional') {
          packetDot.classList.add('established-flow');
          directionArrow.innerHTML = `<i class="fa-solid fa-arrow-left-right"></i> ${stepData.packetDesc}`;
          laneLine.style.background = '#10b981';
          laneLine.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
        }
      }

      stepCards.forEach(card => {
        card.addEventListener('click', () => {
          stepCards.forEach(c => {
            c.classList.remove('active');
            c.querySelector('div:first-child').style.color = 'var(--text-secondary)';
          });
          card.classList.add('active');
          card.querySelector('div:first-child').style.color = 'hsl(var(--accent))';
          
          const stepKey = card.dataset.step;
          updateSimulator(stepKey);
        });
      });

      // Initialize simulator with first step
      updateSimulator('syn');
    }

    // BIND SIMULATOR LOGIC FOR network-q02-dns-resolution
    if (doc.id === 'network-q02-dns-resolution') {
      const dnsStepCards = document.querySelectorAll('#dnsStepGrid .cpu-dial-card');
      const dnsConsoleOutput = document.getElementById('dnsConsoleOutput');
      const dnsAnalysisText = document.getElementById('dnsAnalysisText');
      const dnsNodesDiagram = document.getElementById('dnsNodesDiagram');
      const dnsTerminalTitle = document.getElementById('dnsTerminalTitle');

      function updateDnsDiagram(stepKey) {
        let diagramHTML = '';
        if (stepKey === 'dns') {
          diagramHTML = `
            <div style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 12px; position: relative;">
              <!-- Top Row: Root, TLD, Auth -->
              <div style="display: flex; gap: 12px; justify-content: center; width: 100%; flex-wrap: wrap;">
                <div class="network-node" style="border: 1px solid var(--border-color); padding: 6px 10px; border-radius: 8px; font-size: 0.75rem; background: rgba(255,255,255,0.01); text-align: center; color: var(--text-secondary);">Root DNS (.)</div>
                <div class="network-node" style="border: 1px solid var(--border-color); padding: 6px 10px; border-radius: 8px; font-size: 0.75rem; background: rgba(255,255,255,0.01); text-align: center; color: var(--text-secondary);">TLD DNS (.com)</div>
                <div class="network-node" style="border: 2px solid #0ea5e9; padding: 6px 10px; border-radius: 8px; font-size: 0.75rem; background: rgba(14, 165, 233, 0.05); text-align: center; box-shadow: 0 0 10px rgba(14, 165, 233, 0.15); font-weight: bold; color: #0ea5e9;">Google NS</div>
              </div>
              
              <!-- Connection wire top-to-mid -->
              <div style="width: 2px; height: 10px; background: #334155;"></div>
              
              <!-- Middle Row: Local Resolver -->
              <div class="network-node" style="border: 2px solid #f59e0b; padding: 8px 12px; border-radius: 8px; font-size: 0.8rem; background: rgba(245, 158, 11, 0.05); text-align: center; box-shadow: 0 0 10px rgba(245, 158, 11, 0.15); font-weight: bold; color: #f59e0b; position: relative;">
                Local DNS Resolver (8.8.8.8)
                <div style="font-size: 0.65rem; color: var(--text-secondary); font-weight: 500; margin-top: 2px;">Recursive Querying</div>
              </div>
              
              <!-- Connection wire mid-to-bottom -->
              <div style="width: 2px; height: 10px; background: #334155;"></div>

              <!-- Bottom Row: Client -->
              <div class="network-node" style="border: 2px solid #10b981; padding: 8px 12px; border-radius: 10px; font-size: 0.85rem; background: rgba(16, 185, 129, 0.05); text-align: center; font-weight: bold; color: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.15);">
                Client Browser
                <div style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 500; margin-top: 4px;">Lookup: google.com</div>
              </div>
            </div>
          `;
        } else if (stepKey === 'tcp') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
              <!-- Client Node -->
              <div class="network-node" style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 12px; padding: 10px 14px; width: 130px; text-align: center; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15);">
                <div style="font-size: 1.1rem; color: #0ea5e9; margin-bottom: 4px;"><i class="fa-solid fa-laptop"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Client</div>
                <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-secondary);">IP: 192.168.1.10</div>
              </div>
              
              <!-- Packet Lane -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 16px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center;">
                <div class="packet-lane-line" id="dnsPacketLane" style="width: 100%; height: 4px; background: linear-gradient(90deg, #0ea5e9, #10b981); border-radius: 2px; position: relative;">
                  <div class="animated-packet-dot to-server" style="width: 10px; height: 10px; background-color: #10b981; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); box-shadow: 0 0 10px #10b981;"></div>
                  <div class="packet-direction-arrow" style="position: absolute; top: -18px; left: 50%; transform: translateX(-50%); font-size: 0.6rem; font-weight: bold; color: #cbd5e1; background: #1e293b; padding: 1px 5px; border-radius: 3px; border: 1px solid var(--border-color);">
                    SYN / SYN-ACK / ACK
                  </div>
                </div>
              </div>
              
              <!-- Server Node -->
              <div class="network-node" style="background: rgba(16, 185, 129, 0.05); border: 2px solid #10b981; border-radius: 12px; padding: 10px 14px; width: 130px; text-align: center; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15);">
                <div style="font-size: 1.1rem; color: #10b981; margin-bottom: 4px;"><i class="fa-solid fa-server"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Google Server</div>
                <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-secondary);">IP: 142.250.196.142</div>
              </div>
            </div>
          `;
        } else if (stepKey === 'tls') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
              <!-- Client Node -->
              <div class="network-node" style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 12px; padding: 10px 14px; width: 130px; text-align: center; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15);">
                <div style="font-size: 1.1rem; color: #0ea5e9; margin-bottom: 4px;"><i class="fa-solid fa-laptop"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Client</div>
                <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-secondary);">IP: 192.168.1.10</div>
              </div>
              
              <!-- SSL Glow Lane -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 16px; text-align: center; position: relative;">
                <div class="packet-lane-line" style="width: 100%; height: 6px; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981); border-radius: 3px; box-shadow: 0 0 10px rgba(139, 92, 246, 0.6); display: flex; align-items: center; justify-content: center; position: relative;">
                  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.1rem; color: #f59e0b; filter: drop-shadow(0 0 4px rgba(245,158,11,0.6));"><i class="fa-solid fa-shield-halved"></i></div>
                </div>
                <div style="font-size: 0.6rem; color: #cbd5e1; font-weight: bold; margin-top: 8px;">TLS 1.3 Securing Session</div>
              </div>
              
              <!-- Server Node -->
              <div class="network-node" style="background: rgba(16, 185, 129, 0.05); border: 2px solid #10b981; border-radius: 12px; padding: 10px 14px; width: 130px; text-align: center; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15);">
                <div style="font-size: 1.1rem; color: #10b981; margin-bottom: 4px;"><i class="fa-solid fa-server"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Google Server</div>
                <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-secondary);">IP: 142.250.196.142</div>
              </div>
            </div>
          `;
        } else if (stepKey === 'http') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
              <!-- Client Node -->
              <div class="network-node" style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 12px; padding: 10px 14px; width: 130px; text-align: center; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15);">
                <div style="font-size: 1.1rem; color: #0ea5e9; margin-bottom: 4px;"><i class="fa-solid fa-laptop"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Client</div>
                <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-secondary);">IP: 192.168.1.10</div>
              </div>
              
              <!-- Data Flowing Lane -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 16px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center;">
                <div class="packet-lane-line" id="dnsPacketLane" style="width: 100%; height: 4px; background: #10b981; border-radius: 2px; position: relative;">
                  <div class="animated-packet-dot established-flow" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
                  <div style="position: absolute; top: -18px; left: 50%; transform: translateX(-50%); font-size: 0.6rem; font-weight: bold; color: #10b981; background: #1e293b; padding: 1px 5px; border-radius: 3px; border: 1px solid #10b981; white-space: nowrap;">
                    HTTP/2 DATA TRANSIT
                  </div>
                </div>
              </div>
              
              <!-- Server Node -->
              <div class="network-node" style="background: rgba(16, 185, 129, 0.05); border: 2px solid #10b981; border-radius: 12px; padding: 10px 14px; width: 130px; text-align: center; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15);">
                <div style="font-size: 1.1rem; color: #10b981; margin-bottom: 4px;"><i class="fa-solid fa-server"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Google Server</div>
                <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-secondary);">IP: 142.250.196.142</div>
              </div>
            </div>
          `;
        } else if (stepKey === 'render') {
          diagramHTML = `
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
              <!-- Mock Web Browser window frame -->
              <div style="width: 100%; max-width: 340px; background: #1e293b; border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <div style="background: #0f172a; padding: 6px 10px; display: flex; align-items: center; gap: 6px;">
                  <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#ef4444;"></span>
                  <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#f59e0b;"></span>
                  <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981;"></span>
                  <div style="background: #334155; border-radius: 4px; padding: 1px 8px; font-size: 0.65rem; color: #cbd5e1; flex-grow: 1; text-align: left; display: flex; align-items: center; gap: 4px;">
                    <i class="fa-solid fa-lock" style="color:#10b981; font-size:0.6rem;"></i> https://www.google.com
                  </div>
                </div>
                <div style="background: #090d10; padding: 18px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                  <div style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: bold; background: linear-gradient(90deg, #4285F4, #34A853, #FBBC05, #4285F4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; letter-spacing: -1px;">Google</div>
                  <div style="display: flex; gap: 4px; width: 90%;">
                    <div style="border: 1px solid #334155; background: #1e293b; border-radius: 20px; padding: 3px 10px; font-size: 0.65rem; color: #94a3b8; flex-grow: 1; text-align: left;"><i class="fa-solid fa-magnifying-glass" style="margin-right: 4px; font-size:0.6rem;"></i>Search something...</div>
                    <button style="background: #3b82f6; border: none; color: #ffffff; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.6rem;"><i class="fa-solid fa-search"></i></button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
        return diagramHTML;
      }

      function updateDnsSimulator(stepKey) {
        const stepData = dnsLifecycleData[stepKey];
        if (!stepData) return;

        // Update console title
        if (dnsTerminalTitle) {
          if (stepKey === 'dns') dnsTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>dig Shell Command Output';
          if (stepKey === 'tcp') dnsTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>tcpdump Connection Capture';
          if (stepKey === 'tls') dnsTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>openssl SSL Handshake Output';
          if (stepKey === 'http') dnsTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>curl HTTP Header Response';
          if (stepKey === 'render') dnsTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>Browser Rendering Lifecycle CRP';
        }

        // 1. Update diagram
        dnsNodesDiagram.innerHTML = updateDnsDiagram(stepKey);

        // 2. Update logs and descriptions
        dnsConsoleOutput.innerHTML = stepData.console;
        dnsAnalysisText.innerHTML = stepData.analysis;
      }

      dnsStepCards.forEach(card => {
        card.addEventListener('click', () => {
          dnsStepCards.forEach(c => {
            c.classList.remove('active');
            c.querySelector('div:first-child').style.color = 'var(--text-secondary)';
          });
          card.classList.add('active');
          card.querySelector('div:first-child').style.color = 'hsl(var(--accent))';
          
          const stepKey = card.dataset.step;
          updateDnsSimulator(stepKey);
        });
      });

      // Initialize simulator with first step
      updateDnsSimulator('dns');
    }

    // BIND SIMULATOR LOGIC FOR network-q03-high-latency
    if (doc.id === 'network-q03-high-latency') {
      const latencyStepCards = document.querySelectorAll('#latencyStepGrid .cpu-dial-card');
      const latencyConsoleOutput = document.getElementById('latencyConsoleOutput');
      const latencyAnalysisText = document.getElementById('latencyAnalysisText');
      const latencyNodesDiagram = document.getElementById('latencyNodesDiagram');
      const latencyTerminalTitle = document.getElementById('latencyTerminalTitle');

      function updateLatencyDiagram(scenarioKey) {
        let diagramHTML = '';
        if (scenarioKey === 'packet_loss') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 0; flex-wrap: wrap; gap: 12px;">
              <div class="network-node" style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 12px; padding: 10px 14px; width: 120px; text-align: center; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15);">
                <div style="font-size: 1.1rem; color: #0ea5e9; margin-bottom: 4px;"><i class="fa-solid fa-laptop"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">User Client</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">IP: 192.168.1.10</div>
              </div>
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center; min-width: 60px;">
                <div class="packet-lane-line" style="width: 100%; height: 4px; background: #10b981; border-radius: 2px; position: relative;">
                  <div class="animated-packet-dot to-server" style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); box-shadow: 0 0 8px #10b981;"></div>
                </div>
              </div>
              <div class="network-node" style="background: rgba(245, 158, 11, 0.05); border: 2px solid #f59e0b; border-radius: 12px; padding: 10px 14px; width: 120px; text-align: center; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.15);">
                <div style="font-size: 1.1rem; color: #f59e0b; margin-bottom: 4px;"><i class="fa-solid fa-code-branch"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Load Balancer</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">IP: 10.0.0.1</div>
              </div>
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center; min-width: 60px;">
                <div class="packet-lane-line" style="width: 100%; height: 4px; background: #ef4444; border-radius: 2px; position: relative; animation: pulse 1s infinite;">
                  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.6rem; font-weight: bold; color: #ef4444; background: #1e293b; padding: 1px 4px; border-radius: 3px; border: 1px solid #ef4444; white-space: nowrap;">
                    <i class="fa-solid fa-triangle-exclamation"></i> Drop 50%
                  </div>
                </div>
              </div>
              <div class="network-node" style="background: rgba(239, 68, 68, 0.05); border: 2px solid #ef4444; border-radius: 12px; padding: 10px 14px; width: 120px; text-align: center; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.15);">
                <div style="font-size: 1.1rem; color: #ef4444; margin-bottom: 4px;"><i class="fa-solid fa-server"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">App Server</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">TCP Retransmit</div>
              </div>
            </div>
          `;
        } else if (scenarioKey === 'db_lock') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: center; align-items: center; padding: 10px 0; flex-wrap: wrap; gap: 24px;">
              <div class="network-node" style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 12px; padding: 10px 14px; width: 130px; text-align: center; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15);">
                <div style="font-size: 1.1rem; color: #0ea5e9; margin-bottom: 4px;"><i class="fa-solid fa-server"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">App Server</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">Pool: Active Wait</div>
              </div>
              <div class="packet-lane-wrapper" style="width: 80px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center;">
                <div class="packet-lane-line dotted-lane" style="width: 100%; height: 2px; position: relative;">
                  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.6rem; font-weight: bold; color: #f59e0b; background: #1e293b; padding: 1px 5px; border-radius: 3px; border: 1px solid #f59e0b; white-space: nowrap;">
                    Waiting Lock...
                  </div>
                </div>
              </div>
              <div class="network-node" style="background: rgba(239, 68, 68, 0.05); border: 2px solid #ef4444; border-radius: 12px; padding: 12px; width: 160px; text-align: center; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.25); position: relative;">
                <div style="position: absolute; top: -12px; right: -12px; background: #ef4444; color: #ffffff; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; border: 2px solid #1e293b; animation: pulse 1.2s infinite;"><i class="fa-solid fa-lock"></i></div>
                <div style="font-size: 1.3rem; color: #ef4444; margin-bottom: 4px;"><i class="fa-solid fa-database"></i></div>
                <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">PostgreSQL DB</div>
                <div style="font-size: 0.65rem; color: #ef4444; font-weight: bold; margin-top: 2px;">Exclusive Lock (PID 28192)</div>
              </div>
            </div>
          `;
        } else if (scenarioKey === 'storage') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: center; align-items: center; padding: 10px 0; flex-wrap: wrap; gap: 24px;">
              <div class="network-node" style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 12px; padding: 10px 14px; width: 130px; text-align: center; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15);">
                <div style="font-size: 1.1rem; color: #0ea5e9; margin-bottom: 4px;"><i class="fa-solid fa-server"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">App Server</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">Blocked on NFS I/O</div>
              </div>
              <div class="packet-lane-wrapper" style="width: 80px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center;">
                <div class="packet-lane-line dashed-lane" style="width: 100%; height: 2px; position: relative;">
                  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.6rem; font-weight: bold; color: #ef4444; background: #1e293b; padding: 1px 5px; border-radius: 3px; border: 1px solid #ef4444; white-space: nowrap;">
                    await 85.4ms
                  </div>
                </div>
              </div>
              <div class="network-node" style="background: rgba(239, 68, 68, 0.05); border: 2px solid #ef4444; border-radius: 12px; padding: 12px; width: 160px; text-align: center; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.25); position: relative;">
                <div style="position: absolute; top: -12px; right: -12px; background: #ef4444; color: #ffffff; border-radius: 4px; padding: 2px 6px; font-size: 0.6rem; font-weight: bold; border: 1.5px solid #1e293b; text-transform: uppercase;">100% util</div>
                <div style="font-size: 1.3rem; color: #ef4444; margin-bottom: 4px;"><i class="fa-solid fa-hard-drive"></i></div>
                <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">NFS Storage Share</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 2px;">/mnt/shared_nfs</div>
              </div>
            </div>
          `;
        } else if (scenarioKey === 'rdma_fallback') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 0; flex-wrap: wrap; gap: 12px;">
              <div class="network-node" style="background: rgba(139, 92, 246, 0.05); border: 2px solid #8b5cf6; border-radius: 12px; padding: 10px 14px; width: 120px; text-align: center; box-shadow: 0 4px 10px rgba(139, 92, 246, 0.15);">
                <div style="font-size: 1.1rem; color: #8b5cf6; margin-bottom: 4px;"><i class="fa-solid fa-microchip"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">GPU Node 1</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">RoCE NIC (mlx5_0)</div>
              </div>
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 45px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 80px;">
                <div class="packet-lane-line dashed-lane" style="width: 100%; height: 2px; position: relative; margin-bottom: 12px;">
                  <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.55rem; color: #ef4444; background: #1e293b; padding: 0 4px; border: 1.5px solid #ef4444; border-radius: 2px; font-weight: bold; white-space: nowrap;">RDMA Blocked (No PFC)</span>
                </div>
              </div>
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 45px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 80px;">
                <div class="packet-lane-line" style="width: 100%; height: 2px; background: #f59e0b; position: relative;">
                  <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.55rem; color: #f59e0b; background: #1e293b; padding: 0 4px; border: 1.5px solid #f59e0b; border-radius: 2px; font-weight: bold; white-space: nowrap;">TCP Fallback (40x Slower)</span>
                  <div class="animated-packet-dot to-server" style="width: 8px; height: 8px; background-color: #f59e0b; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); box-shadow: 0 0 8px #f59e0b;"></div>
                </div>
              </div>
              <div class="network-node" style="background: rgba(139, 92, 246, 0.05); border: 2px solid #8b5cf6; border-radius: 12px; padding: 10px 14px; width: 120px; text-align: center; box-shadow: 0 4px 10px rgba(139, 92, 246, 0.15);">
                <div style="font-size: 1.1rem; color: #8b5cf6; margin-bottom: 4px;"><i class="fa-solid fa-microchip"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">GPU Node 2</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">IP: 10.0.0.12</div>
              </div>
            </div>
          `;
        }
        return diagramHTML;
      }

      function updateLatencySimulator(scenarioKey) {
        const scenarioData = latencySimData[scenarioKey];
        if (!scenarioData) return;

        // Update console title
        if (latencyTerminalTitle) {
          if (scenarioKey === 'packet_loss') latencyTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>ping & tcpdump Packet Loss Diagnostic';
          if (scenarioKey === 'db_lock') latencyTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>PostgreSQL Lock Contention Query';
          if (scenarioKey === 'storage') latencyTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>iostat & syslog storage bottleneck';
          if (scenarioKey === 'rdma_fallback') latencyTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>RoCE/PFC Verification & syslog';
        }

        // 1. Update diagram
        latencyNodesDiagram.innerHTML = updateLatencyDiagram(scenarioKey);

        // 2. Update logs and descriptions
        latencyConsoleOutput.innerHTML = scenarioData.console;
        latencyAnalysisText.innerHTML = scenarioData.analysis;
      }

      latencyStepCards.forEach(card => {
        card.addEventListener('click', () => {
          latencyStepCards.forEach(c => {
            c.classList.remove('active');
            c.querySelector('div:first-child').style.color = 'var(--text-secondary)';
          });
          card.classList.add('active');
          card.querySelector('div:first-child').style.color = 'hsl(var(--accent))';
          
          const scenarioKey = card.dataset.scenario;
          updateLatencySimulator(scenarioKey);
        });
      });

      // Initialize simulator with first scenario
      updateLatencySimulator('packet_loss');
    }

    // BIND SIMULATOR LOGIC FOR network-q04-l4-vs-l7-load-balancer
    if (doc.id === 'network-q04-l4-vs-l7-load-balancer') {
      const lbStepCards = document.querySelectorAll('#lbStepGrid .cpu-dial-card');
      const lbConsoleOutput = document.getElementById('lbConsoleOutput');
      const lbAnalysisText = document.getElementById('lbAnalysisText');
      const lbNodesDiagram = document.getElementById('lbNodesDiagram');
      const lbTerminalTitle = document.getElementById('lbTerminalTitle');

      function updateLbDiagram(stepKey) {
        let diagramHTML = '';
        if (stepKey === 'l4') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
              <!-- Client Node -->
              <div class="network-node" style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 12px; padding: 10px 14px; width: 120px; text-align: center; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15);">
                <div style="font-size: 1.1rem; color: #0ea5e9; margin-bottom: 4px;"><i class="fa-solid fa-laptop"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Client</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">IP: 192.168.1.50</div>
              </div>
              
              <!-- Session Connection Lane -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 12px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center; min-width: 60px;">
                <div class="packet-lane-line" style="width: 100%; height: 4px; background: linear-gradient(90deg, #0ea5e9, #f59e0b); border-radius: 2px; position: relative;">
                  <div class="animated-packet-dot to-server" style="width: 8px; height: 8px; background-color: #f59e0b; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); box-shadow: 0 0 8px #f59e0b;"></div>
                  <div class="packet-direction-arrow" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.55rem; font-weight: bold; color: #cbd5e1; background: #1e293b; padding: 1px 4px; border-radius: 3px; border: 1px solid var(--border-color); white-space: nowrap;">
                    IP/Port Rewritten (NAT)
                  </div>
                </div>
              </div>
              
              <!-- L4 LB Node -->
              <div class="network-node" style="background: rgba(245, 158, 11, 0.05); border: 2px solid #f59e0b; border-radius: 12px; padding: 10px 14px; width: 125px; text-align: center; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.15);">
                <div style="font-size: 1.1rem; color: #f59e0b; margin-bottom: 4px;"><i class="fa-solid fa-network-wired"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">L4 NLB (VIP)</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">IP: 10.0.0.10</div>
              </div>
              
              <!-- Forwarding Connection Lane -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 12px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center; min-width: 60px;">
                <div class="packet-lane-line" style="width: 100%; height: 4px; background: linear-gradient(90deg, #f59e0b, #10b981); border-radius: 2px; position: relative;">
                  <div class="animated-packet-dot to-server" style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); box-shadow: 0 0 8px #10b981;"></div>
                  <div class="packet-direction-arrow" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.55rem; font-weight: bold; color: #cbd5e1; background: #1e293b; padding: 1px 4px; border-radius: 3px; border: 1px solid var(--border-color); white-space: nowrap;">
                    Direct Pass-through
                  </div>
                </div>
              </div>
              
              <!-- Backend Server A -->
              <div class="network-node" style="background: rgba(16, 185, 129, 0.05); border: 2px solid #10b981; border-radius: 12px; padding: 10px 14px; width: 120px; text-align: center; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15);">
                <div style="font-size: 1.1rem; color: #10b981; margin-bottom: 4px;"><i class="fa-solid fa-server"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Nginx Web A</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">IP: 10.0.0.21</div>
              </div>
            </div>
            
            <div style="width:100%; text-align:center; font-size:0.75rem; color:#f59e0b; font-weight:bold; margin-top:8px;">
              <i class="fa-solid fa-circle-check"></i> Client-to-Backend Direct Session (1 TCP Connection)
            </div>
          `;
        } else if (stepKey === 'l7') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
              <!-- Client Node -->
              <div class="network-node" style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 12px; padding: 10px 14px; width: 110px; text-align: center; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15);">
                <div style="font-size: 1.1rem; color: #0ea5e9; margin-bottom: 4px;"><i class="fa-solid fa-laptop"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Client</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">192.168.1.50</div>
              </div>
              
              <!-- Session 1: Client to LB -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center; min-width: 60px;">
                <div class="packet-lane-line" style="width: 100%; height: 4px; background: #8b5cf6; border-radius: 2px; position: relative;">
                  <div class="animated-packet-dot to-server" style="width: 8px; height: 8px; background-color: #8b5cf6; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); box-shadow: 0 0 8px #8b5cf6;"></div>
                  <div class="packet-direction-arrow" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.5rem; font-weight: bold; color: #f8fafc; background: #8b5cf6; padding: 1px 3px; border-radius: 2px; white-space: nowrap;">
                    TCP Session 1 (HTTPS)
                  </div>
                </div>
              </div>
              
              <!-- L7 LB Node -->
              <div class="network-node" style="background: rgba(139, 92, 246, 0.05); border: 2px solid #8b5cf6; border-radius: 12px; padding: 10px 8px; width: 140px; text-align: center; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2); position: relative;">
                <div style="position: absolute; top: -10px; right: -10px; background: #8b5cf6; color: #ffffff; border-radius: 4px; padding: 1px 4px; font-size: 0.55rem; font-weight: bold; border: 1.5px solid #1e293b; text-transform: uppercase;">SSL TERM</div>
                <div style="font-size: 1.1rem; color: #8b5cf6; margin-bottom: 4px;"><i class="fa-solid fa-shield-halved"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">L7 Ingress (Nginx)</div>
                <div style="font-size: 0.6rem; color: #cbd5e1; font-family: var(--font-mono); margin-top:2px;">URL Path: /users</div>
              </div>
              
              <!-- Session 2: LB to Backend -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center; min-width: 60px;">
                <div class="packet-lane-line" style="width: 100%; height: 4px; background: #10b981; border-radius: 2px; position: relative;">
                  <div class="animated-packet-dot to-server" style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); box-shadow: 0 0 8px #10b981;"></div>
                  <div class="packet-direction-arrow" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.5rem; font-weight: bold; color: #f8fafc; background: #10b981; padding: 1px 3px; border-radius: 2px; white-space: nowrap;">
                    TCP Session 2 (HTTP)
                  </div>
                </div>
              </div>
              
              <!-- Backend Pod -->
              <div class="network-node" style="background: rgba(16, 185, 129, 0.05); border: 2px solid #10b981; border-radius: 12px; padding: 10px 14px; width: 110px; text-align: center; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15);">
                <div style="font-size: 1.1rem; color: #10b981; margin-bottom: 4px;"><i class="fa-solid fa-server"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">User Pod A</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">IP: 10.0.0.21</div>
              </div>
            </div>
            
            <div style="width:100%; text-align:center; font-size:0.75rem; color:#8b5cf6; font-weight:bold; margin-top:8px;">
              <i class="fa-solid fa-circle-nodes"></i> Terminated proxy sessions (2 Independent TCP Connections)
            </div>
          `;
        }
        return diagramHTML;
      }

      function updateLbSimulator(stepKey) {
        const stepData = loadBalancerSimData[stepKey];
        if (!stepData) return;

        // Update console title
        if (lbTerminalTitle) {
          if (stepKey === 'l4') lbTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>L4 ipvsadm routing rules & tcpdump';
          if (stepKey === 'l7') lbTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>L7 nginx.conf reverse proxy configuration';
        }

        // 1. Update diagram
        lbNodesDiagram.innerHTML = updateLbDiagram(stepKey);

        // 2. Update logs and descriptions
        lbConsoleOutput.innerHTML = stepData.console;
        lbAnalysisText.innerHTML = stepData.analysis;
      }

      lbStepCards.forEach(card => {
        card.addEventListener('click', () => {
          lbStepCards.forEach(c => {
            c.classList.remove('active');
            c.querySelector('div:first-child').style.color = 'var(--text-secondary)';
          });
          card.classList.add('active');
          card.querySelector('div:first-child').style.color = 'hsl(var(--accent))';
          
          const stepKey = card.dataset.step;
          updateLbSimulator(stepKey);
        });
      });

      // Initialize simulator with first step
      updateLbSimulator('l4');
    }

    // BIND SIMULATOR LOGIC FOR network-q05-packet-loss
    if (doc.id === 'network-q05-packet-loss') {
      const plStepCards = document.querySelectorAll('#packetLossStepGrid .cpu-dial-card');
      const plConsoleOutput = document.getElementById('packetLossConsoleOutput');
      const plAnalysisText = document.getElementById('packetLossAnalysisText');
      const plNodesDiagram = document.getElementById('packetLossNodesDiagram');
      const plTerminalTitle = document.getElementById('packetLossTerminalTitle');

      function updatePacketLossDiagram(stepKey) {
        let diagramHTML = '';
        if (stepKey === 'congestion') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 0; gap: 12px;">
              <!-- Client Node -->
              <div class="network-node" style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 12px; padding: 10px 14px; width: 120px; text-align: center; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15);">
                <div style="font-size: 1.1rem; color: #0ea5e9; margin-bottom: 4px;"><i class="fa-solid fa-laptop"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Client</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">IP: 192.168.1.50</div>
              </div>
              
              <!-- Client-to-Switch Lane -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center; min-width: 60px;">
                <div class="packet-lane-line" style="width: 100%; height: 4px; background: #10b981; border-radius: 2px; position: relative;">
                  <div class="animated-packet-dot to-server" style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); box-shadow: 0 0 8px #10b981;"></div>
                </div>
              </div>
              
              <!-- Switch Node -->
              <div class="network-node" style="background: rgba(245, 158, 11, 0.05); border: 2px solid #f59e0b; border-radius: 12px; padding: 10px 14px; width: 130px; text-align: center; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.15); position: relative;">
                <div style="position: absolute; top: -10px; right: -10px; background: #ef4444; color: #ffffff; border-radius: 4px; padding: 1px 4px; font-size: 0.55rem; font-weight: bold; border: 1.5px solid #1e293b; text-transform: uppercase; animation: pulse 1s infinite;">100% Egress</div>
                <div style="font-size: 1.1rem; color: #f59e0b; margin-bottom: 4px;"><i class="fa-solid fa-network-wired"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Egress Switch</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">Buffer Full</div>
              </div>
              
              <!-- Switch-to-Server Lane (Packet Drop) -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center; min-width: 60px;">
                <div class="packet-lane-line" style="width: 100%; height: 4px; background: #ef4444; border-radius: 2px; position: relative; animation: pulse 1s infinite;">
                  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.55rem; font-weight: bold; color: #ef4444; background: #1e293b; padding: 1px 4px; border-radius: 3px; border: 1px solid #ef4444; white-space: nowrap;">
                    <i class="fa-solid fa-triangle-exclamation"></i> dropped 1.2%
                  </div>
                </div>
              </div>
              
              <!-- Server Node -->
              <div class="network-node" style="background: rgba(239, 68, 68, 0.05); border: 2px solid #ef4444; border-radius: 12px; padding: 10px 14px; width: 120px; text-align: center; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.15);">
                <div style="font-size: 1.1rem; color: #ef4444; margin-bottom: 4px;"><i class="fa-solid fa-server"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Web Server</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">IP: 10.0.0.21</div>
              </div>
            </div>
            
            <div style="width:100%; text-align:center; font-size:0.75rem; color:#ef4444; font-weight:bold; margin-top:8px;">
              <i class="fa-solid fa-circle-exclamation"></i> Link Saturation: Switch buffers overflow, dropping packets & causing TCP retransmissions.
            </div>
          `;
        } else if (stepKey === 'mtu') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 0; gap: 12px;">
              <!-- Client Node -->
              <div class="network-node" style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 12px; padding: 10px 12px; width: 125px; text-align: center; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15);">
                <div style="font-size: 1.1rem; color: #0ea5e9; margin-bottom: 4px;"><i class="fa-solid fa-laptop"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Client (Jumbo)</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">MTU: 9000</div>
              </div>
              
              <!-- Jumbo Packet Lane -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center; min-width: 60px;">
                <div class="packet-lane-line" style="width: 100%; height: 4px; background: #f59e0b; border-radius: 2px; position: relative;">
                  <div class="animated-packet-dot to-server" style="width: 12px; height: 12px; background-color: #f59e0b; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); box-shadow: 0 0 10px #f59e0b;"></div>
                  <div style="position: absolute; top: -16px; left: 50%; transform: translateX(-50%); font-size: 0.55rem; color: #f59e0b; font-weight: bold; background: #1e293b; padding: 1px 3px; border-radius: 2px; white-space: nowrap;">9000B Frame</div>
                </div>
              </div>
              
              <!-- Mid Switch Node -->
              <div class="network-node" style="background: rgba(239, 68, 68, 0.05); border: 2px solid #ef4444; border-radius: 12px; padding: 10px 12px; width: 125px; text-align: center; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.15);">
                <div style="font-size: 1.1rem; color: #ef4444; margin-bottom: 4px;"><i class="fa-solid fa-ban"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Transit Switch</div>
                <div style="font-size: 0.65rem; color: #ef4444; font-weight: bold;">MTU: 1500 (DF=1)</div>
              </div>
              
              <!-- Drops Lane -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center; min-width: 60px;">
                <div class="packet-lane-line dashed-lane" style="width: 100%; height: 2px; position: relative;">
                  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.55rem; font-weight: bold; color: #ef4444; background: #1e293b; padding: 1px 4px; border-radius: 3px; border: 1px solid #ef4444; white-space: nowrap;">
                    Silent Drop (Blackhole)
                  </div>
                </div>
              </div>
              
              <!-- Destination Node -->
              <div class="network-node" style="background: rgba(16, 185, 129, 0.05); border: 2px solid #10b981; border-radius: 12px; padding: 10px 12px; width: 125px; text-align: center; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15);">
                <div style="font-size: 1.1rem; color: #10b981; margin-bottom: 4px;"><i class="fa-solid fa-server"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Server (Jumbo)</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">MTU: 9000</div>
              </div>
            </div>
            
            <div style="width:100%; text-align:center; font-size:0.75rem; color:#f59e0b; font-weight:bold; margin-top:8px;">
              <i class="fa-solid fa-circle-question"></i> MTU Mismatch: Packets larger than intermediate MTU are dropped silently because DF (Don't Fragment) is enabled.
            </div>
          `;
        } else if (stepKey === 'crc') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 0; gap: 12px;">
              <!-- Sender Node -->
              <div class="network-node" style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 12px; padding: 10px 14px; width: 120px; text-align: center; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15);">
                <div style="font-size: 1.1rem; color: #0ea5e9; margin-bottom: 4px;"><i class="fa-solid fa-server"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">Web Server</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">Tx Packets OK</div>
              </div>
              
              <!-- Corrupt Lane -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center; min-width: 60px;">
                <div class="packet-lane-line" style="width: 100%; height: 4px; background: linear-gradient(90deg, #10b981, #ef4444); border-radius: 2px; position: relative;">
                  <div class="animated-packet-dot to-server" style="width: 8px; height: 8px; background-color: #ef4444; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); box-shadow: 0 0 8px #ef4444;"></div>
                  <div style="position: absolute; top: -16px; left: 50%; transform: translateX(-50%); font-size: 0.55rem; color: #ef4444; font-weight: bold; background: #1e293b; padding: 1px 4px; border-radius: 2px; white-space: nowrap;">Physical Noise / Damage</div>
                </div>
              </div>
              
              <!-- Receiver Node with CRC Errors -->
              <div class="network-node" style="background: rgba(239, 68, 68, 0.05); border: 2px solid #ef4444; border-radius: 12px; padding: 10px 14px; width: 130px; text-align: center; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.15); position: relative;">
                <div style="position: absolute; top: -10px; right: -10px; background: #ef4444; color: #ffffff; border-radius: 4px; padding: 1px 4px; font-size: 0.55rem; font-weight: bold; border: 1.5px solid #1e293b; text-transform: uppercase;">CRC ERR</div>
                <div style="font-size: 1.1rem; color: #ef4444; margin-bottom: 4px;"><i class="fa-solid fa-plug-circle-xmark"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">App Server NIC</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">rx_crc_errors++</div>
              </div>
            </div>
            
            <div style="width:100%; text-align:center; font-size:0.75rem; color:#ef4444; font-weight:bold; margin-top:8px;">
              <i class="fa-solid fa-bolt-lightning"></i> Physical Layer Error: Noise or cable damage corrupts data bits, forcing the receiving NIC to discard the frame.
            </div>
          `;
        } else if (stepKey === 'rdma_fallback') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 0; gap: 12px;">
              <!-- GPU Node 1 -->
              <div class="network-node" style="background: rgba(139, 92, 246, 0.05); border: 2px solid #8b5cf6; border-radius: 12px; padding: 10px 14px; width: 120px; text-align: center; box-shadow: 0 4px 10px rgba(139, 92, 246, 0.15);">
                <div style="font-size: 1.1rem; color: #8b5cf6; margin-bottom: 4px;"><i class="fa-solid fa-microchip"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">GPU Node 1</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">Mellanox NIC</div>
              </div>
              
              <!-- Broken PFC Lane -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 45px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 80px;">
                <div class="packet-lane-line dashed-lane" style="width: 100%; height: 2px; position: relative; margin-bottom: 12px;">
                  <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.55rem; color: #ef4444; background: #1e293b; padding: 0 4px; border: 1.5px solid #ef4444; border-radius: 2px; font-weight: bold; white-space: nowrap;">RDMA Fails (No PFC)</span>
                </div>
              </div>
              
              <!-- TCP Fallback Lane -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 45px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 80px;">
                <div class="packet-lane-line" style="width: 100%; height: 2px; background: #f59e0b; position: relative;">
                  <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.55rem; color: #f59e0b; background: #1e293b; padding: 0 4px; border: 1.5px solid #f59e0b; border-radius: 2px; font-weight: bold; white-space: nowrap;">TCP Socket (40x Slow)</span>
                  <div class="animated-packet-dot to-server" style="width: 8px; height: 8px; background-color: #f59e0b; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); box-shadow: 0 0 8px #f59e0b;"></div>
                </div>
              </div>
              
              <!-- GPU Node 2 -->
              <div class="network-node" style="background: rgba(139, 92, 246, 0.05); border: 2px solid #8b5cf6; border-radius: 12px; padding: 10px 14px; width: 120px; text-align: center; box-shadow: 0 4px 10px rgba(139, 92, 246, 0.15);">
                <div style="font-size: 1.1rem; color: #8b5cf6; margin-bottom: 4px;"><i class="fa-solid fa-microchip"></i></div>
                <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">GPU Node 2</div>
                <div style="font-size: 0.65rem; color: var(--text-secondary);">TCP Fallback Mode</div>
              </div>
            </div>
            
            <div style="width:100%; text-align:center; font-size:0.75rem; color:#8b5cf6; font-weight:bold; margin-top:8px;">
              <i class="fa-solid fa-circle-exclamation"></i> RoCE Congestion: Missing PFC settings drop packets under load, triggering a fallback from RDMA to standard TCP socket proxying.
            </div>
          `;
        }
        return diagramHTML;
      }

      function updatePacketLossSimulator(stepKey) {
        const stepData = packetLossSimData[stepKey];
        if (!stepData) return;

        // Update console title
        if (plTerminalTitle) {
          if (stepKey === 'congestion') plTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>tc qdisc statistics & ethtool queue counters';
          if (stepKey === 'mtu') plTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>ping command MTU diagnostic output';
          if (stepKey === 'crc') plTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>ip link statistics & ethtool ethernet errors';
          if (stepKey === 'rdma_fallback') plTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>rdma link & ethtool PFC packet logs';
        }

        // 1. Update diagram
        plNodesDiagram.innerHTML = updatePacketLossDiagram(stepKey);

        // 2. Update logs and descriptions
        plConsoleOutput.innerHTML = stepData.console;
        plAnalysisText.innerHTML = stepData.analysis;
      }

      plStepCards.forEach(card => {
        card.addEventListener('click', () => {
          plStepCards.forEach(c => {
            c.classList.remove('active');
            c.querySelector('div:first-child').style.color = 'var(--text-secondary)';
          });
          card.classList.add('active');
          card.querySelector('div:first-child').style.color = 'hsl(var(--accent))';
          
          const stepKey = card.dataset.step;
          updatePacketLossSimulator(stepKey);
        });
      });

      // Initialize simulator with first step
      updatePacketLossSimulator('congestion');
    }

    bindStatusSelector(doc.id);
  }

  // 3.6 GPU & AI INFRASTRUCTURE QUESTION RENDERER (TCP vs RDMA flow simulator)
  function renderGpuLayout(doc) {
    el.contentArea.classList.add('wide-layout');
    const currentStatus = getStatus(doc.id);

    // Extract key sections
    const intent = doc.sections.find(s => s.title.includes("Intent"));
    const english = doc.sections.find(s => s.title.includes("English") || s.title.includes("Answer"));
    const korean = doc.sections.find(s => s.title.includes("Korean"));
    const followups = doc.sections.find(s => s.title.includes("Follow-up"));
    const notes = doc.sections.find(s => s.title.includes("Notes"));
    const concepts = doc.sections.find(s => s.title.includes("Concepts"));
    const troubleshooting = doc.sections.find(s => s.title.includes("Troubleshooting"));
    const commands = doc.sections.find(s => s.title.includes("Commands"));

    let html = buildHeaderHTML(doc, currentStatus);

    // Render Interview Question if it exists
    const interviewQuestion = doc.sections.find(s => s.title.toLowerCase() === "interview question");
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

    if (OVERVIEW_DATA[doc.id]) {
      html += buildOverviewCard(doc.id);
    }

    // Interactive Visualizer for gpu-q01-rdma-vs-tcp
    if (doc.id === 'gpu-q01-rdma-vs-tcp') {
      html += `
        <h2 style="font-family: var(--font-heading); margin-bottom:12px; font-size:1.30rem; margin-top: 24px;">
          <i class="fa-solid fa-network-wired" style="color:hsl(var(--accent)); margin-right:8px;"></i>
          TCP vs RDMA Memory Transfer Simulator (TCP vs RDMA 메모리 전송 시뮬레이터)
        </h2>
        
        <div class="tcp-visualizer-card" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
          <!-- Visual diagram row -->
          <div class="dns-nodes-diagram" id="gpuNodesDiagram" style="background: rgba(0,0,0,0.15); border-radius: 12px; padding: 20px; border: 1px dashed var(--border-color); margin-bottom: 24px; position: relative; min-height: 180px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 16px; transition: all 0.3s ease;">
             <!-- Dynamically updated by JS -->
          </div>
          
          <!-- Interactive selector grid -->
          <div class="cpu-dial-grid" id="gpuStepGrid" style="grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
            <div class="cpu-dial-card active" data-step="tcp" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: hsl(var(--accent)); text-transform: uppercase;">Traditional Stack</div>
              <div style="font-weight: 700; font-size: 1.05rem; margin: 4px 0 2px 0;"><i class="fa-solid fa-server" style="margin-right:4px;"></i>TCP 전송 (커널 개입)</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">2 Copies, Context Switches, CPU load</div>
            </div>
            <div class="cpu-dial-card" data-step="rdma" style="padding: 12px;">
              <div style="font-weight: 800; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Kernel Bypass</div>
              <div style="font-weight: 700; font-size: 1.05rem; margin: 4px 0 2px 0;"><i class="fa-solid fa-bolt" style="margin-right:4px;"></i>RDMA 전송 (Zero-Copy)</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary);">Direct PCIe DMA, Kernel Bypass, sub-1us</div>
            </div>
          </div>
          
          <!-- Stats Panel (CPU & Latency Meters) -->
          <div style="display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
            <div style="flex: 1 1 200px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 1.5rem; color: hsl(var(--accent));"><i class="fa-solid fa-cpu"></i></div>
              <div style="flex-grow: 1;">
                <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: bold;">CPU System Usage (커널 부하)</div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                  <div style="flex-grow: 1; height: 8px; background: #334155; border-radius: 4px; overflow: hidden;">
                    <div id="gpuCpuBar" style="width: 25%; height: 100%; background: #0ea5e9; transition: all 0.5s ease;"></div>
                  </div>
                  <span id="gpuCpuVal" style="font-size: 0.85rem; font-family: var(--font-mono); font-weight: bold; width: 45px; text-align: right;">24.8%</span>
                </div>
              </div>
            </div>
            <div style="flex: 1 1 200px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 1.5rem; color: #10b981;"><i class="fa-solid fa-stopwatch"></i></div>
              <div style="flex-grow: 1;">
                <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: bold;">Network Latency (지연 시간)</div>
                <div id="gpuLatencyVal" style="font-size: 1.15rem; font-family: var(--font-mono); font-weight: bold; color: #10b981; margin-top: 2px;">35.4 μs (microseconds)</div>
              </div>
            </div>
          </div>
          
          <!-- Output layout split -->
          <div class="layout-split" style="margin-bottom: 0;">
            <div class="layout-left" style="flex:1 1 500px; max-width: 100%;">
              <div class="mock-terminal-wrapper" style="margin-bottom: 0; height:100%;">
                <div class="terminal-tab-bar">
                  <span class="terminal-tab active" id="gpuTerminalTitle"><i class="fa-solid fa-code" style="margin-right:6px;"></i>Code & Socket Interface Console</span>
                </div>
                <div class="terminal-screen" style="min-height: 200px; padding: 16px; position:relative; overflow: visible;">
                  <pre><code id="gpuConsoleOutput" style="color:#e2e8f0; white-space: pre-wrap; font-size: 0.85rem; font-family: var(--font-mono); display: block;"></code></pre>
                </div>
              </div>
            </div>
            
            <div class="layout-right" style="flex:1 1 350px;">
              <div class="study-card" style="margin-bottom:0; height:100%;">
                <div class="card-tabs"><span class="tab-btn active" style="cursor:default">메모리 패스 및 데이터 이송 원리</span></div>
                <div class="card-body" id="gpuAnalysisText" style="line-height:1.6; font-size:0.9rem; padding: 18px;">
                  <!-- Populated by JS -->
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Accordion: Interviewer's Intent
    if (intent) {
      html += buildAccordion("Interviewer's Intent (면접관의 질문 의도)", intent.content);
    }

    // Render Answer split tab card
    if (english || korean) {
      html += `
        <div class="study-card">
          <div class="card-tabs">
            <button class="tab-btn active" id="gpuTabEng">Recommended English Answer</button>
            <button class="tab-btn" id="gpuTabKor">Korean Summary</button>
          </div>
          <div class="card-body">
            <div class="tab-content active" id="gpuContentEng">
              ${wrapActiveRecall(english ? english.content : '')}
            </div>
            <div class="tab-content" id="gpuContentKor">
              ${buildInterlinearHTML(english ? english.content : '', korean ? korean.content : '')}
            </div>
          </div>
        </div>
      `;
    }

    // Accordion: Concepts / Troubleshooting / Production
    let prepMaterials = '';
    if (concepts) {
      prepMaterials += `<h3 style="font-family: var(--font-heading); margin-top: 16px; margin-bottom: 8px; font-size: 1.15rem; color: hsl(var(--accent)); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">${concepts.title}</h3>`;
      prepMaterials += `<div>${convertToInterlinear(concepts.content)}</div>`;
    }
    if (doc.sections.find(s => s.title.includes("Why"))) {
      const whySec = doc.sections.find(s => s.title.includes("Why"));
      prepMaterials += `<h3 style="font-family: var(--font-heading); margin-top: 24px; margin-bottom: 8px; font-size: 1.15rem; color: hsl(var(--accent)); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">${whySec.title}</h3>`;
      prepMaterials += `<div>${convertToInterlinear(whySec.content)}</div>`;
    }
    if (doc.sections.find(s => s.title.includes("Comparison"))) {
      const compSec = doc.sections.find(s => s.title.includes("Comparison"));
      prepMaterials += `<h3 style="font-family: var(--font-heading); margin-top: 24px; margin-bottom: 8px; font-size: 1.15rem; color: hsl(var(--accent)); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">${compSec.title}</h3>`;
      prepMaterials += `<div>${convertToInterlinear(compSec.content)}</div>`;
    }
    if (doc.sections.find(s => s.title.includes("Production"))) {
      const prodSec = doc.sections.find(s => s.title.includes("Production"));
      prepMaterials += `<h3 style="font-family: var(--font-heading); margin-top: 24px; margin-bottom: 8px; font-size: 1.15rem; color: hsl(var(--accent)); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">${prodSec.title}</h3>`;
      prepMaterials += `<div>${convertToInterlinear(prodSec.content)}</div>`;
    }

    const renderedKeys = ['intent', 'english', 'answer', 'korean', 'why', 'concepts', 'comparison', 'production', 'follow-up', 'notes', 'commands', 'status', 'interview question'];
    const unrendered = doc.sections.filter(s => {
      const titleLower = s.title.toLowerCase();
      if (renderedKeys.some(k => titleLower.includes(k))) return false;
      if (doc.sections.length > 0 && s.title === doc.sections[0].title) return false;
      return true;
    });

    unrendered.forEach(sec => {
      prepMaterials += `<h3 style="font-family: var(--font-heading); margin-top: 24px; margin-bottom: 8px; font-size: 1.15rem; color: hsl(var(--accent)); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">${sec.title}</h3>`;
      prepMaterials += `<div>${convertToInterlinear(sec.content)}</div>`;
    });

    if (prepMaterials) {
      html += buildAccordion("GPU Cluster Networking & RDMA Deep Dive (GPU 인프라 및 고속망 핵심 기술)", prepMaterials);
    }

    // Interactive Follow-up Question Flip Cards
    if (followups) {
      html += `<h2 style="font-family: var(--font-heading); margin-top:28px; font-size:1.40rem;"><i class="fa-solid fa-graduation-cap" style="color:hsl(var(--accent)); margin-right:8px;"></i> Interactive Follow-up Practice (꼬리 질문 연습)</h2>`;
      html += parseFollowupCards(followups.content);
    }

    // Personal Notes
    if (notes) {
      html += buildAccordion("Personal Notes & Study Guide", notes.content);
    }

    el.contentArea.innerHTML = html;

    // Tabs listener
    const tEng = document.getElementById('gpuTabEng');
    const tKor = document.getElementById('gpuTabKor');
    const cEng = document.getElementById('gpuContentEng');
    const cKor = document.getElementById('gpuContentKor');

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

    // BIND SIMULATOR LOGIC FOR gpu-q01-rdma-vs-tcp
    if (doc.id === 'gpu-q01-rdma-vs-tcp') {
      const gpuStepCards = document.querySelectorAll('#gpuStepGrid .cpu-dial-card');
      const gpuConsoleOutput = document.getElementById('gpuConsoleOutput');
      const gpuAnalysisText = document.getElementById('gpuAnalysisText');
      const gpuNodesDiagram = document.getElementById('gpuNodesDiagram');
      const gpuTerminalTitle = document.getElementById('gpuTerminalTitle');
      const gpuCpuBar = document.getElementById('gpuCpuBar');
      const gpuCpuVal = document.getElementById('gpuCpuVal');
      const gpuLatencyVal = document.getElementById('gpuLatencyVal');

      function updateGpuDiagram(modeKey) {
        let diagramHTML = '';
        if (modeKey === 'tcp') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 0; gap: 8px;">
              <!-- Source Host -->
              <div style="display:flex; flex-direction:column; gap:8px; align-items:center;">
                <!-- Application User Space -->
                <div style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 8px; padding: 6px 10px; width: 110px; text-align: center; font-size:0.75rem; font-weight:bold; color:var(--text-primary);">
                  User Space
                </div>
                <div style="font-size:0.7rem; color:var(--text-secondary);"><i class="fa-solid fa-arrow-down-long"></i> Copy 1 (CPU)</div>
                <!-- Kernel Space -->
                <div style="background: rgba(245, 158, 11, 0.05); border: 2px solid #f59e0b; border-radius: 8px; padding: 6px 10px; width: 110px; text-align: center; font-size:0.75rem; font-weight:bold; color:#f59e0b;">
                  Kernel (Socket)
                </div>
                <div style="font-size:0.7rem; color:var(--text-secondary);"><i class="fa-solid fa-arrow-down-long"></i> Copy 2 (DMA)</div>
                <!-- NIC Space -->
                <div style="background: rgba(16, 185, 129, 0.05); border: 2px solid #10b981; border-radius: 8px; padding: 6px 10px; width: 110px; text-align: center; font-size:0.75rem; font-weight:bold; color:#10b981;">
                  NIC Buffer
                </div>
              </div>
              
              <!-- Network Transit Lane -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center; min-width: 60px;">
                <div class="packet-lane-line" style="width: 100%; height: 4px; background: #cbd5e1; border-radius: 2px; position: relative;">
                  <div class="animated-packet-dot to-server" style="width: 8px; height: 8px; background-color: #f59e0b; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); box-shadow: 0 0 8px #f59e0b;"></div>
                  <div style="position: absolute; top: -16px; left: 50%; transform: translateX(-50%); font-size: 0.55rem; color: var(--text-secondary); background: #1e293b; padding: 1px 3px; border-radius: 2px; white-space: nowrap;">TCP/IP Stack (slow)</div>
                </div>
              </div>
              
              <!-- Destination Host -->
              <div style="display:flex; flex-direction:column; gap:8px; align-items:center;">
                <!-- NIC Space -->
                <div style="background: rgba(16, 185, 129, 0.05); border: 2px solid #10b981; border-radius: 8px; padding: 6px 10px; width: 110px; text-align: center; font-size:0.75rem; font-weight:bold; color:#10b981;">
                  NIC Buffer
                </div>
                <div style="font-size:0.7rem; color:var(--text-secondary);"><i class="fa-solid fa-arrow-up-long"></i> Copy 3 (DMA)</div>
                <!-- Kernel Space -->
                <div style="background: rgba(245, 158, 11, 0.05); border: 2px solid #f59e0b; border-radius: 8px; padding: 6px 10px; width: 110px; text-align: center; font-size:0.75rem; font-weight:bold; color:#f59e0b;">
                  Kernel (Socket)
                </div>
                <div style="font-size:0.7rem; color:var(--text-secondary);"><i class="fa-solid fa-arrow-up-long"></i> Copy 4 (CPU)</div>
                <!-- Application User Space -->
                <div style="background: rgba(14, 165, 233, 0.05); border: 2px solid #0ea5e9; border-radius: 8px; padding: 6px 10px; width: 110px; text-align: center; font-size:0.75rem; font-weight:bold; color:var(--text-primary);">
                  User Space
                </div>
              </div>
            </div>
            
            <div style="width:100%; text-align:center; font-size:0.75rem; color:#f59e0b; font-weight:bold; margin-top:8px;">
              <i class="fa-solid fa-circle-info"></i> TCP Socket Path: Requires context switches and 4 total memory copies across CPUs.
            </div>
          `;
        } else if (modeKey === 'rdma') {
          diagramHTML = `
            <div class="network-nodes-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 0; gap: 8px;">
              <!-- Source Host RDMA -->
              <div style="display:flex; flex-direction:column; gap:20px; align-items:center;">
                <!-- Application Registered Memory -->
                <div style="background: rgba(139, 92, 246, 0.05); border: 2px solid #8b5cf6; border-radius: 8px; padding: 8px 12px; width: 140px; text-align: center; font-size:0.75rem; font-weight:bold; color:#8b5cf6; position:relative;">
                  <div style="position:absolute; top:-10px; left:50%; transform:translateX(-50%); background:#8b5cf6; color:white; font-size:0.5rem; padding:1px 4px; border-radius:3px; border:1px solid #1e293b; white-space:nowrap;">REGISTERED MEM (MR)</div>
                  User Buffer A
                </div>
                <!-- HCA/RNIC -->
                <div style="background: rgba(16, 185, 129, 0.05); border: 2px solid #10b981; border-radius: 8px; padding: 6px 10px; width: 120px; text-align: center; font-size:0.75rem; font-weight:bold; color:#10b981;">
                  RNIC (Host A)
                </div>
              </div>
              
              <!-- PCIe DMA link representation -->
              <div style="position:relative; width:0; height:0;">
                 <div style="position:absolute; top:-60px; left:-80px; width:4px; height:50px; border-left:2px dashed #8b5cf6;"></div>
              </div>
              
              <!-- Direct Memory Transit Lane -->
              <div class="packet-lane-wrapper" style="flex-grow: 1; margin: 0 8px; position: relative; height: 36px; display: flex; align-items: center; justify-content: center; min-width: 60px;">
                <div class="packet-lane-line" style="width: 100%; height: 4px; background: #8b5cf6; border-radius: 2px; position: relative;">
                  <div class="animated-packet-dot to-server" style="width: 10px; height: 10px; background-color: #8b5cf6; border-radius: 50%; position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); box-shadow: 0 0 10px #8b5cf6;"></div>
                  <div style="position: absolute; top: -16px; left: 50%; transform: translateX(-50%); font-size: 0.55rem; color: #ffffff; background: #8b5cf6; padding: 1px 4px; border-radius: 2px; white-space: nowrap;">Kernel Bypass (Zero Copy)</div>
                </div>
              </div>
              
              <!-- PCIe DMA link representation -->
              <div style="position:relative; width:0; height:0;">
                 <div style="position:absolute; top:-60px; left:80px; width:4px; height:50px; border-left:2px dashed #8b5cf6;"></div>
              </div>
              
              <!-- Destination Host RDMA -->
              <div style="display:flex; flex-direction:column; gap:20px; align-items:center;">
                <!-- Application Registered Memory -->
                <div style="background: rgba(139, 92, 246, 0.05); border: 2px solid #8b5cf6; border-radius: 8px; padding: 8px 12px; width: 140px; text-align: center; font-size:0.75rem; font-weight:bold; color:#8b5cf6; position:relative;">
                  <div style="position:absolute; top:-10px; left:50%; transform:translateX(-50%); background:#8b5cf6; color:white; font-size:0.5rem; padding:1px 4px; border-radius:3px; border:1px solid #1e293b; white-space:nowrap;">REGISTERED MEM (MR)</div>
                  User Buffer B
                </div>
                <!-- HCA/RNIC -->
                <div style="background: rgba(16, 185, 129, 0.05); border: 2px solid #10b981; border-radius: 8px; padding: 6px 10px; width: 120px; text-align: center; font-size:0.75rem; font-weight:bold; color:#10b981;">
                  RNIC (Host B)
                </div>
              </div>
            </div>
            
            <div style="width:100%; text-align:center; font-size:0.75rem; color:#8b5cf6; font-weight:bold; margin-top:8px;">
              <i class="fa-solid fa-circle-nodes"></i> RDMA Path: RNIC reads/writes directly to user-space memory via PCIe DMA, bypassing kernel and CPU entirely.
            </div>
          `;
        }
        return diagramHTML;
      }

      function updateGpuSimulator(modeKey) {
        const modeData = gpuSimData[modeKey];
        if (!modeData) return;

        // Update indicators
        if (modeKey === 'tcp') {
          if (gpuTerminalTitle) gpuTerminalTitle.innerHTML = '<i class="fa-solid fa-terminal" style="margin-right:6px;"></i>Standard BSD Socket API & CPU System Overhead';
          gpuCpuBar.style.width = '24.8%';
          gpuCpuBar.style.background = '#f59e0b';
          gpuCpuVal.textContent = '24.8%';
          gpuCpuVal.style.color = '#f59e0b';
          gpuLatencyVal.textContent = '35.4 μs (microseconds)';
          gpuLatencyVal.style.color = '#f59e0b';
        } else if (modeKey === 'rdma') {
          if (gpuTerminalTitle) gpuTerminalTitle.innerHTML = '<i class="fa-solid fa-code" style="margin-right:6px;"></i>libibverbs RDMA Native Memory Registration & Post API';
          gpuCpuBar.style.width = '0.15%';
          gpuCpuBar.style.background = '#10b981';
          gpuCpuVal.textContent = '0.15%';
          gpuCpuVal.style.color = '#10b981';
          gpuLatencyVal.textContent = '0.78 μs (sub-microsecond)';
          gpuLatencyVal.style.color = '#10b981';
        }

        // 1. Update diagram
        gpuNodesDiagram.innerHTML = updateGpuDiagram(modeKey);

        // 2. Update logs and descriptions
        gpuConsoleOutput.innerHTML = modeData.console;
        gpuAnalysisText.innerHTML = modeData.analysis;
      }

      gpuStepCards.forEach(card => {
        card.addEventListener('click', () => {
          gpuStepCards.forEach(c => {
            c.classList.remove('active');
            c.querySelector('div:first-child').style.color = 'var(--text-secondary)';
          });
          card.classList.add('active');
          card.querySelector('div:first-child').style.color = 'hsl(var(--accent))';
          
          const modeKey = card.dataset.step;
          updateGpuSimulator(modeKey);
        });
      });

      // Initialize simulator with first step
      updateGpuSimulator('tcp');
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
            ${categoryHtml}

            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 20px 0;">

            <!-- Streaks & Date Countdown -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: center;">
              <div style="background: rgba(239, 68, 68, 0.05); border: 1px dashed rgba(239, 68, 68, 0.2); border-radius: 8px; padding: 12px;">
                <div style="font-size: 0.78rem; text-transform: uppercase; color: #ef4444; font-weight: bold; letter-spacing: 0.5px;">ByteDance D-Day</div>
                <div style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${dDayText}</div>
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
    // Splits expected follow-up questions from a list into an interactive 3D flip card grid
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    
    const hasExpectedAnswers = htmlContent.includes("Expected Answer");
    let cards = [];
    
    const getCleanHTML = (el) => {
      if (el.tagName.toUpperCase() === 'P' || el.tagName.toUpperCase() === 'LI') {
        return el.innerHTML;
      }
      return el.outerHTML;
    };
    
    if (hasExpectedAnswers) {
      // Group elements by Q&A blocks
      let groups = [];
      let currentGroup = [];
      
      Array.from(div.children).forEach(el => {
        const text = el.textContent.trim();
        const tagName = el.tagName.toUpperCase();
        
        if (tagName === 'HR') {
          if (currentGroup.length > 0) {
            groups.push(currentGroup);
            currentGroup = [];
          }
        } else if (tagName.match(/^H[1-6]$/)) {
          if (currentGroup.length > 0) {
            groups.push(currentGroup);
            currentGroup = [];
          }
          if (!text.match(/^Q\d+$/i)) {
            currentGroup.push(el);
          }
        } else {
          currentGroup.push(el);
        }
      });
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      
      groups.forEach(group => {
        let expectedAnswerIdx = -1;
        for (let i = 0; i < group.length; i++) {
          if (group[i].textContent.includes("Expected Answer")) {
            expectedAnswerIdx = i;
            break;
          }
        }
        
        let qHTMLs = [];
        let aHTMLs = [];
        
        if (expectedAnswerIdx !== -1) {
          // Everything before expectedAnswerIdx is Question
          for (let i = 0; i < expectedAnswerIdx; i++) {
            qHTMLs.push(getCleanHTML(group[i]));
          }
          
          // The expectedAnswer element itself: strip "Expected Answer" prefix
          const el = group[expectedAnswerIdx];
          let html = el.innerHTML;
          html = html.replace(/^Expected Answer\s*(?:<br\s*\/?>)?/i, "").trim();
          html = html.replace(/^모범 답변\s*(?:<br\s*\/?>)?/i, "").trim();
          html = html.replace(/^예상 답변\s*(?:<br\s*\/?>)?/i, "").trim();
          html = html.replace(/^\s*<strong>\s*Expected Answer\s*<\/strong>\s*(?:<br\s*\/?>)?/i, "").trim();
          html = html.replace(/^\s*<strong>\s*모범 답변\s*<\/strong>\s*(?:<br\s*\/?>)?/i, "").trim();
          html = html.replace(/^\s*<strong>\s*예상 답변\s*<\/strong>\s*(?:<br\s*\/?>)?/i, "").trim();
          html = html.replace(/^(?:<br\s*\/?>|\s)+/i, "").trim();
          
          if (html) {
            aHTMLs.push(html);
          }
          
          // Everything after expectedAnswerIdx is Answer
          for (let i = expectedAnswerIdx + 1; i < group.length; i++) {
            aHTMLs.push(getCleanHTML(group[i]));
          }
        } else {
          // No expected answer found in this group, treat all as Question
          group.forEach(el => {
            qHTMLs.push(getCleanHTML(el));
          });
        }
        
        const qContent = qHTMLs.filter(Boolean).join("<br>").trim();
        const aContent = aHTMLs.filter(Boolean).join("<br>").trim();
        
        if (qContent) {
          cards.push({
            question: qContent,
            answer: aContent || null
          });
        }
      });
    } else {
      // Legacy fallback
      const lis = div.querySelectorAll('li');
      if (lis.length > 0) {
        lis.forEach(li => {
          cards.push({
            question: li.innerHTML.trim(),
            answer: null
          });
        });
      } else {
        const ps = div.querySelectorAll('p');
        if (ps.length > 0) {
          ps.forEach(p => {
            cards.push({
              question: p.innerHTML.trim(),
              answer: null
            });
          });
        }
      }
    }
    
    if (cards.length === 0) return htmlContent;
    
    let gridHTML = '<div class="flip-card-grid">';
    
    const mockFollowupAnswers = {
      0: "프로젝트 진행 방식과 플랫폼 사용 기술, 아키텍처 설계 과정을 언급합니다.",
      1: "GPU 인프라와 VAST Storage 구성, VM과 Bare Metal의 가상화 성능 차이 분석을 기술적으로 답합니다.",
      2: "장애 발생 단계부터 vmstat, iostat 등의 도구를 사용한 데이터 기반 트러블슈팅 접근을 강조합니다.",
      3: "대규모 트래픽 분산을 위해 클러스터 크기를 확장하고 컨테이너를 수천 개 단위로 수용했던 스케일을 예시로 듭니다.",
      4: "글로벌 딜리버리(TikTok)의 복잡성과 거대 클라우드 환경에서 Reliability를 수립하기 위한 목적을 정렬합니다."
    };
    
    cards.forEach((card, idx) => {
      const q = card.question;
      const ans = card.answer || mockFollowupAnswers[idx] || "데이터 기반 문제 분석 절차와 다부서 협업, 재발 방지를 위한 모니터링 수립으로 조치했음을 설명합니다.";
      
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


