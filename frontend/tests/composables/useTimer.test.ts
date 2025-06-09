import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTimer } from '~/composables/useTimer';

// Mock useIntervalFn from @vueuse/core
vi.mock('@vueuse/core', () => ({
  useIntervalFn: vi.fn(() => ({
    pause: vi.fn(),
    resume: vi.fn(),
  })),
}));

describe('useTimer', () => {
  let timer: ReturnType<typeof useTimer>;
  let mockPause: ReturnType<typeof vi.fn>;
  let mockResume: ReturnType<typeof vi.fn>;
  let intervalCallback: () => void;

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup mock for useIntervalFn
    const { useIntervalFn } = await import('@vueuse/core');
    mockPause = vi.fn();
    mockResume = vi.fn();

    vi.mocked(useIntervalFn).mockImplementation(
      (callback: () => void, interval: number, options?: any) => {
        intervalCallback = callback;
        return { pause: mockPause, resume: mockResume };
      },
    );

    timer = useTimer();
  });

  describe('初始狀態', () => {
    it('應該有正確的初始值', () => {
      expect(timer.restRatio.value).toBe(5);
      expect(timer.isLooping.value).toBe(true);
      expect(timer.focusDuration.value).toBe(0);
      expect(timer.phase.value).toBe('focus');
      expect(timer.isPaused.value).toBe(true);
      expect(timer.isRunning.value).toBe(false);
      expect(timer.remainingRestDuration.value).toBe(0);
    });

    it('應該正確計算休息時間', () => {
      timer.restRatio.value = 4;
      // Simulate 20 minutes of focus
      timer.focusDuration.value = 20;
      expect(timer.restDuration.value).toBe(5); // 20 / 4 = 5
    });
  });

  describe('專注階段', () => {
    it('開始專注應該設置正確的狀態', () => {
      timer.start();

      expect(timer.phase.value).toBe('focus');
      expect(timer.focusDuration.value).toBe(0);
      expect(timer.isPaused.value).toBe(false);
      expect(timer.isRunning.value).toBe(true);
    });

    it('專注計時應該正確累加時間', () => {
      timer.start();

      // Simulate 61 seconds (1 minute 1 second)
      for (let i = 0; i < 61; i++) {
        intervalCallback();
      }

      expect(timer.focusDuration.value).toBe(1); // Should be 1 minute
    });

    it('暫停和恢復應該正確工作', () => {
      timer.start();
      expect(mockResume).toHaveBeenCalled();

      timer.pause();
      expect(timer.isPaused.value).toBe(true);
      expect(mockPause).toHaveBeenCalled();

      timer.resume();
      expect(timer.isPaused.value).toBe(false);
      expect(mockResume).toHaveBeenCalledTimes(2);
    });

    it('完成專注應該切換到休息階段', () => {
      // Start with some focus time
      timer.start();
      for (let i = 0; i < 300; i++) {
        // 5 minutes
        intervalCallback();
      }

      timer.finishFocus();

      expect(timer.phase.value).toBe('rest');
      expect(timer.remainingRestDuration.value).toBe(1); // 5 minutes / 5 ratio = 1 minute
      expect(timer.isPaused.value).toBe(false); // Should auto-start rest
    });

    it('沒有專注時間時不應該能夠完成專注', () => {
      timer.finishFocus();

      expect(timer.phase.value).toBe('focus');
    });
  });

  describe('休息階段', () => {
    beforeEach(() => {
      // Setup focus time first
      timer.start();
      for (let i = 0; i < 300; i++) {
        // 5 minutes
        intervalCallback();
      }
      timer.finishFocus();
    });

    it('休息倒數應該正確減少時間', () => {
      expect(timer.remainingRestDuration.value).toBe(1);

      // Simulate 30 seconds
      for (let i = 0; i < 30; i++) {
        intervalCallback();
      }

      expect(timer.remainingRestDuration.value).toBe(1); // Still 1 minute (not yet 60 seconds)

      // Simulate another 30 seconds (total 60 seconds = 1 minute)
      for (let i = 0; i < 30; i++) {
        intervalCallback();
      }

      expect(timer.remainingRestDuration.value).toBe(0);
    });

    it('休息結束後應該根據循環設定決定下一步', () => {
      timer.isLooping.value = true;

      // Complete rest period (1 minute = 60 seconds)
      for (let i = 0; i < 60; i++) {
        intervalCallback();
      }

      expect(timer.phase.value).toBe('focus');
      expect(timer.focusDuration.value).toBe(0);
      expect(timer.isPaused.value).toBe(false);
    });

    it('關閉循環模式時休息結束應該停止', () => {
      timer.isLooping.value = false;

      // Complete rest period
      for (let i = 0; i < 60; i++) {
        intervalCallback();
      }

      expect(timer.phase.value).toBe('focus');
      expect(timer.isPaused.value).toBe(true);
    });
  });

  describe('重置和跳過功能', () => {
    it('重置應該恢復到初始狀態', () => {
      timer.start();
      for (let i = 0; i < 300; i++) {
        intervalCallback();
      }
      timer.finishFocus();

      timer.reset();

      expect(timer.phase.value).toBe('focus');
      expect(timer.focusDuration.value).toBe(0);
      expect(timer.remainingRestDuration.value).toBe(0);
      expect(timer.isPaused.value).toBe(true);
    });

    it('在專注階段跳過應該進入休息', () => {
      timer.start();
      for (let i = 0; i < 300; i++) {
        intervalCallback();
      }

      timer.skip();

      expect(timer.phase.value).toBe('rest');
    });

    it('在休息階段跳過應該根據循環設定決定', () => {
      timer.start();
      for (let i = 0; i < 300; i++) {
        intervalCallback();
      }
      timer.finishFocus();

      timer.isLooping.value = true;
      timer.skip();

      expect(timer.phase.value).toBe('focus');
      expect(timer.focusDuration.value).toBe(0);
    });
  });

  describe('進度計算', () => {
    it('專注階段的進度應該為 0', () => {
      timer.start();
      for (let i = 0; i < 300; i++) {
        intervalCallback();
      }

      expect(timer.progress.value).toBe(0);
    });

    it('休息階段的進度應該正確計算', () => {
      timer.start();
      for (let i = 0; i < 300; i++) {
        // 5 minutes focus
        intervalCallback();
      }
      timer.finishFocus(); // 1 minute rest

      expect(timer.progress.value).toBe(0); // Just started

      // 30 seconds into rest
      for (let i = 0; i < 30; i++) {
        intervalCallback();
      }

      expect(timer.progress.value).toBe(0.5); // 50% progress
    });
  });
});
