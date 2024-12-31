import React, { useState, useEffect, useRef, useCallback } from 'react';

interface LogEntry {
  id: number;
  type: 'log' | 'error' | 'warn' | 'info';
  content: string;
  timestamp: string;
}

const MobileConsole: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'log' | 'error' | 'warn' | 'info'>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const logCounter = useRef(0);
  const pendingLogsRef = useRef<LogEntry[]>([]);
  const updateScheduledRef = useRef(false);

  // バッチ更新のための関数
  const flushLogs = useCallback(() => {
    if (pendingLogsRef.current.length > 0) {
      setLogs(prevLogs => [...prevLogs, ...pendingLogsRef.current]);
      pendingLogsRef.current = [];
    }
    updateScheduledRef.current = false;
  }, []);

  // ログの追加をバッファリング
  const bufferLog = useCallback((newLog: LogEntry) => {
    pendingLogsRef.current.push(newLog);
    
    if (!updateScheduledRef.current) {
      updateScheduledRef.current = true;
      requestAnimationFrame(flushLogs);
    }
  }, [flushLogs]);

  useEffect(() => {
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };

    const createLogEntry = (type: 'log' | 'error' | 'warn' | 'info', args: any[]) => {
      const content = args
        .map(arg => {
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch (e) {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(' ');

      return {
        id: logCounter.current++,
        type,
        content,
        timestamp: new Date().toLocaleTimeString()
      };
    };

    const overrideConsole = (type: 'log' | 'error' | 'warn' | 'info') => {
      return (...args: any[]) => {
        originalConsole[type](...args);
        const newLog = createLogEntry(type, args);
        bufferLog(newLog);
      };
    };

    console.log = overrideConsole('log');
    console.error = overrideConsole('error');
    console.warn = overrideConsole('warn');
    console.info = overrideConsole('info');

    const handleError = (event: ErrorEvent) => {
      const newLog = createLogEntry('error', [`Unhandled error: ${event.error?.message || event.message}`]);
      bufferLog(newLog);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const newLog = createLogEntry('error', [`Unhandled promise rejection: ${event.reason}`]);
      bufferLog(newLog);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [bufferLog]);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const filteredLogs = logs.filter(log => filter === 'all' || log.type === filter);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-500';
      case 'warn': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-700';
    }
  };

  const clearLogs = useCallback(() => {
    setLogs([]);
    pendingLogsRef.current = [];
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-50"
        aria-label="Show console"
      >
        <span className="material-icons">terminal</span>
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-0 right-0 left-0 bg-white shadow-lg z-50 transition-all duration-300 ${
        isExpanded ? 'h-screen' : 'h-1/3'
      }`}
    >
      <div className="flex items-center justify-between bg-gray-800 text-white p-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-gray-700 rounded"
            aria-label="Hide console"
          >
            <span className="material-icons">close</span>
          </button>
          <span className="font-mono">Console</span>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="log">Logs</option>
            <option value="error">Errors</option>
            <option value="warn">Warnings</option>
            <option value="info">Info</option>
          </select>
          <button
            onClick={clearLogs}
            className="p-1 hover:bg-gray-700 rounded"
            aria-label="Clear console"
          >
            <span className="material-icons">delete</span>
          </button>
          <button
            onClick={toggleExpand}
            className="p-1 hover:bg-gray-700 rounded"
            aria-label={isExpanded ? "Collapse console" : "Expand console"}
          >
            <span className="material-icons">
              {isExpanded ? 'expand_more' : 'expand_less'}
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100%-2.5rem)] bg-gray-50">
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No logs to display
          </div>
        ) : (
          <div className="font-mono text-sm">
            {filteredLogs.map(log => (
              <div
                key={log.id}
                className={`p-2 border-b border-gray-200 ${getLogColor(log.type)}`}
              >
                <div className="flex items-start">
                  <span className="text-xs text-gray-500 mr-2">
                    [{log.timestamp}]
                  </span>
                  <pre className="whitespace-pre-wrap break-words flex-1">
                    {log.content}
                  </pre>
                </div>
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileConsole;