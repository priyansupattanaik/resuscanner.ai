export type LogType = "info" | "success" | "error" | "warning";

export interface LogEntry {
  id: string;
  timestamp: number;
  type: LogType;
  message: string;
  data?: any;
}

type Listener = (logs: LogEntry[]) => void;

class DebugService {
  private logs: LogEntry[] = [];
  private listeners: Set<Listener> = new Set();
  private isOpen: boolean = false;
  private openListeners: Set<(isOpen: boolean) => void> = new Set();

  log(type: LogType, message: string, data?: any) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      type,
      message,
      data,
    };
    this.logs = [entry, ...this.logs];
    this.notify();

    // Auto-open on error
    if (type === "error") {
      this.setOpen(true);
    }
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
    this.notify();
  }

  toggle() {
    this.setOpen(!this.isOpen);
  }

  setOpen(value: boolean) {
    this.isOpen = value;
    this.notifyOpen();
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscribeOpen(listener: (isOpen: boolean) => void) {
    this.openListeners.add(listener);
    return () => this.openListeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.logs));
  }

  private notifyOpen() {
    this.openListeners.forEach((listener) => listener(this.isOpen));
  }
}

export const debugService = new DebugService();
