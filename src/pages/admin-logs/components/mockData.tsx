import { LogEntry } from './mockTypes.ts';

export const mockLogs: LogEntry[] = [
  {
    id: '1',
    ts: Date.now() - 1000 * 60 * 2,
    level: 'INFO',
    source: 'auth',
    message: 'User logged in successfully'
  },
  {
    id: '2',
    ts: Date.now() - 1000 * 60 * 5,
    level: 'WARN',
    source: 'api',
    message: 'Latency over threshold: 850ms on GET /users'
  },
  {
    id: '3',
    ts: Date.now() - 1000 * 60 * 10,
    level: 'ERROR',
    source: 'worker',
    message: 'Unhandled exception in JobQueue',
    trace:
      "TypeError: Cannot read property 'id' of undefined\n    at processJob (/app/worker.js:42:13)"
  },
  {
    id: '4',
    ts: Date.now() - 1000 * 60 * 15,
    level: 'DEBUG',
    source: 'db',
    message: 'Executing SQL query: SELECT * FROM users WHERE id=123'
  },
  {
    id: '5',
    ts: Date.now() - 1000 * 60 * 20,
    level: 'FATAL',
    source: 'scheduler',
    message: 'Critical failure in cron job — shutting down',
    trace: 'Error: Out of memory\n    at CronTask (/app/scheduler.js:88:21)'
  }
];
