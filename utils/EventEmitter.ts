type Listener = () => void;

export class EventEmitter {
  private listeners: { [event: string]: Listener[] } = {};

  on(event: string, listener: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
    return () => {
      this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    };
  }

  emit(event: string) {
    (this.listeners[event] || []).forEach(listener => listener());
  }
}

// Singleton for database events
export const dbEvents = new EventEmitter();