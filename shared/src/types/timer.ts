// Timer types (for future use)
export type TimerStatus = 'idle' | 'focusing' | 'resting' | 'paused';

export type TimerConfig = {
  restRatio: number;
  reminderInterval: number; // in minutes, 0 = disabled
  enableContinuousMode: boolean;
};

export type TimerSession = {
  id: string;
  userId?: number;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  focusDuration: number; // in minutes
  restDuration: number; // in minutes
  status: TimerStatus;
  config: TimerConfig;
};
