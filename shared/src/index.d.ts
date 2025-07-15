export * from './types/user';
export * from './types/api';
export type TimerStatus = 'idle' | 'focusing' | 'resting' | 'paused';
export type TimerConfig = {
    restRatio: number;
    reminderInterval: number;
    enableContinuousMode: boolean;
};
export type TimerSession = {
    id: string;
    userId?: number;
    taskId?: string;
    startTime: Date;
    endTime?: Date;
    focusDuration: number;
    restDuration: number;
    status: TimerStatus;
    config: TimerConfig;
};
//# sourceMappingURL=index.d.ts.map