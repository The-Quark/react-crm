export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LogEntry {
  id: string;
  ts: number;
  level: LogLevel;
  source: string;
  message: string;
  trace?: string;
}
