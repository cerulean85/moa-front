import { useEffect, useState } from 'react';
import { useRef } from 'react';
// import { testService } from '@/api/services/test.service';

function Chat() {
	const [message, setMessage] = useState<string>('');
	const [error, _] = useState<string | null>(null);
	// const getClientId = () => {
	// 	let clientId = sessionStorage.getItem('sse-client-id');
	// if (!clientId) {
  //     // crypto.randomUUID()가 지원되지 않는 환경을 위한 fallback
  //     clientId =
  //       crypto?.randomUUID?.() ||
  //       Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  //     sessionStorage.setItem('sse-client-id', clientId);
  //   }
  //   return clientId;
  // };
 
  // const handleHelloClick = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await testService.hello();
  //     setMessage(response.message);
  //   } catch (err) {
  //     setError(
  //       err instanceof Error ? err.message : 'API 호출 중 오류가 발생했습니다.'
  //     );
  //     console.error('Hello API Error:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
 
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const heartbeatTimeoutRef = useRef<number | null>(null);
  const retryCountRef = useRef<number>(0);
 
  // const startHeartbeat = () => {
  //   heartbeatTimeoutRef.current = setTimeout(() => {
  //     console.warn('SSE Heartbeat timeout - reconnecting');
  //     console.log('Connect SSE 555');
  //     connectSSE();
  //   }, 60 * 1000); // 60초 타임아웃
  // };
 
  const connectSSE = () => {
    // 기존 연결이 있다면 먼저 정리
    if (eventSourceRef.current) {
      console.log('SSE Close 호출됨 111');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
 
    // 기존 타이머들 정리
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
 
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
 
    // const clientId = getClientId();
    // const sseUrl = `${import.meta.env.VITE_API_BASE_URL}/sse/events?clientId=${clientId}`;
    const sseUrl = `${import.meta.env.VITE_API_BASE_URL}/sse`;
 
    console.log(
      `SSE Connection Started (attempt ${retryCountRef.current + 1}): ${sseUrl}`
    );
 
    try {
      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;
 
      // 연결 타임아웃 설정 (10초 후에도 연결되지 않으면 재시도)
      // const connectionTimeout = setTimeout(() => {
      //   if (eventSource.readyState !== EventSource.OPEN) {
      //     console.warn('SSE Connection timeout - closing and retrying');
      //     console.log('SSE Close 호출됨 222');
      //     eventSource.close();
      //     scheduleReconnect();
      //   }
      // }, 10000);
 
      // 연결 성공
      eventSource.onopen = () => {
        console.log('SSE Connection Opened successfully');
        // clearTimeout(connectionTimeout);
        retryCountRef.current = 0; // 성공 시 재시도 카운트 리셋
        // startHeartbeat();
      };
 
      eventSource.onmessage = (event) => {
        console.log('SSE onmessage Event: ', event.data);
        setMessage(event.data);
      };
 
      eventSource.onerror = (err) => {
        console.error('SSE Connection Error', {
          readyState: eventSource.readyState,
          error: err,
          retryCount: retryCountRef.current,
        });
 
        // clearTimeout(connectionTimeout);
 
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log('SSE Connection was closed by server');
        } else if (eventSource.readyState === EventSource.CONNECTING) {
          console.log('SSE Reconnecting...');
          return; // 브라우저가 자동으로 재연결 시도 중
        }
 
        console.log('SSE Close 호출됨 333');
        eventSource.close();
        eventSourceRef.current = null;
 
        // 타이머들 정리
        if (heartbeatTimeoutRef.current) {
          clearTimeout(heartbeatTimeoutRef.current);
          heartbeatTimeoutRef.current = null;
        }
 
        // scheduleReconnect();
      };
    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      // scheduleReconnect();
    }
  };
 
  // const scheduleReconnect = () => {
  //   retryCountRef.current++;
 
  //   // 지수 백오프: 1초, 2초, 4초, 8초, 16초, 최대 30초
  //   const baseDelay = 1000;
  //   const maxDelay = 30000;
  //   const delay = Math.min(
  //     baseDelay * Math.pow(2, retryCountRef.current - 1),
  //     maxDelay
  //   );
 
  //   console.log(
  //     `SSE Reconnecting in ${delay / 1000} seconds... (attempt ${retryCountRef.current})`
  //   );
 
  //   reconnectTimeoutRef.current = setTimeout(() => {
  //     console.log('Connect SSE 111');
  //     connectSSE();
  //   }, delay);
  // };
 
  // 이벤트 전송
  // fetch('http://172.22.51.222:3500/sse/send', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ message: 'Hello SSE!', type: 'custom' }),
  // });
 
  useEffect(() => {
    console.log('Connect SSE 222');
    connectSSE();
 
    // // 네트워크 상태 변경 감지
    // const handleOnline = () => {
    //   console.log('Network connection restored - reconnecting SSE');
    //   retryCountRef.current = 0; // 네트워크 복구 시 재시도 카운트 리셋
    //   console.log('Connect SSE 333');
    //   connectSSE();
    // };
 
    // const handleOffline = () => {
    //   console.log('Network connection lost');
    //   if (eventSourceRef.current) {
    //     console.log('SSE Close 호출됨 444');
    //     eventSourceRef.current.close();
    //     eventSourceRef.current = null;
    //   }
    // };
 
    // // 페이지 가시성 변경 감지 (탭 전환 시)
    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === 'visible') {
    //     // 탭이 다시 활성화되면 연결 상태 확인
    //     if (
    //       !eventSourceRef.current ||
    //       eventSourceRef.current.readyState !== EventSource.OPEN
    //     ) {
    //       console.log('Reconnecting SSE after tab became visible');
    //       retryCountRef.current = 0; // 탭 활성화 시 재시도 카운트 리셋
    //       console.log('Connect SSE 444');
    //       connectSSE();
    //     }
    //   }
    // };
 
    // window.addEventListener('online', handleOnline);
    // window.addEventListener('offline', handleOffline);
    // document.addEventListener('visibilitychange', handleVisibilityChange);
 
    // // cleanup 함수에서 연결 정리
    // return () => {
    //   if (eventSourceRef.current) {
    //     console.log('SSE Close 호출됨 555');
    //     eventSourceRef.current.close();
    //     eventSourceRef.current = null;
    //   }
 
    //   if (reconnectTimeoutRef.current) {
    //     clearTimeout(reconnectTimeoutRef.current);
    //     reconnectTimeoutRef.current = null;
    //   }
 
    //   if (heartbeatTimeoutRef.current) {
    //     clearTimeout(heartbeatTimeoutRef.current);
    //     heartbeatTimeoutRef.current = null;
    //   }
 
    //   window.removeEventListener('online', handleOnline);
    //   window.removeEventListener('offline', handleOffline);
    //   document.removeEventListener('visibilitychange', handleVisibilityChange);
    // };
  }, []);
 
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>TEST HELLO API</h1>
      {/* <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleHelloClick}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {loading ? '로딩 중...' : 'Hello API 호출'}
        </button>
      </div> */}
 
      {message && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            color: '#155724',
          }}
        >
          <h3>응답 메시지:</h3>
          <p>{message}</p>
        </div>
      )}
 
      {error && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
          }}
        >
          <h3>오류:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default Chat;