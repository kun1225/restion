import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';

import IndexPage from '~/pages/index.vue';

// Mock useIntervalFn
vi.mock('@vueuse/core', () => ({
  useIntervalFn: vi.fn(() => ({
    pause: vi.fn(),
    resume: vi.fn(),
    isActive: ref(false),
  })),
}));

describe('Timer Integration Flow', () => {
  let wrapper: any;
  let intervalCallback: () => void;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { useIntervalFn } = await import('@vueuse/core');
    vi.mocked(useIntervalFn).mockImplementation((callback: () => void) => {
      intervalCallback = callback;
      return {
        pause: vi.fn(),
        resume: vi.fn(),
        isActive: { value: false },
      };
    });

    wrapper = mount(IndexPage);
  });

  it('應該完成完整的專注-休息循環', async () => {
    // 初始狀態檢查
    expect(wrapper.text()).toContain('Start Focus');
    expect(wrapper.text()).toContain('00:00');
    expect(wrapper.text()).toContain('focusing');

    // 開始專注
    await wrapper.find('[aria-label="Start"]').trigger('click');
    expect(wrapper.text()).toContain('Pause');

    // 模擬 5 分鐘專注
    for (let i = 0; i < 300; i++) {
      intervalCallback();
    }
    expect(wrapper.text()).toContain('05:00');
    expect(wrapper.text()).toContain('Finish Focus');

    // 完成專注
    await wrapper.find('[aria-label="Finish Focus"]').trigger('click');
    expect(wrapper.text()).toContain('resting');
    expect(wrapper.text()).toContain('01:00'); // 5分鐘 / 5 = 1分鐘休息

    // 模擬休息完成
    for (let i = 0; i < 60; i++) {
      intervalCallback();
    }

    // 應該自動開始新的專注階段（循環模式）
    expect(wrapper.text()).toContain('focusing');
    expect(wrapper.text()).toContain('00:00');
  });

  it('應該正確處理暫停和恢復', async () => {
    // 開始專注
    await wrapper.find('[aria-label="Start"]').trigger('click');

    // 運行一段時間
    for (let i = 0; i < 120; i++) {
      // 2 minutes
      intervalCallback();
    }
    expect(wrapper.text()).toContain('02:00');

    // 暫停
    await wrapper.find('[aria-label="Pause"]').trigger('click');
    expect(wrapper.text()).toContain('Resume');

    // 恢復
    await wrapper.find('[aria-label="Resume"]').trigger('click');
    expect(wrapper.text()).toContain('Pause');
  });

  it('應該正確處理重置功能', async () => {
    // 開始專注並運行一段時間
    await wrapper.find('[aria-label="Start"]').trigger('click');
    for (let i = 0; i < 180; i++) {
      // 3 minutes
      intervalCallback();
    }
    expect(wrapper.text()).toContain('03:00');

    // 重置
    await wrapper.find('[aria-label="Reset"]').trigger('click');
    expect(wrapper.text()).toContain('00:00');
    expect(wrapper.text()).toContain('Start Focus');
  });

  it('應該正確處理跳過功能', async () => {
    // 開始專注並運行一段時間
    await wrapper.find('[aria-label="Start"]').trigger('click');
    for (let i = 0; i < 240; i++) {
      // 4 minutes
      intervalCallback();
    }
    expect(wrapper.text()).toContain('04:00');

    // 跳過到休息
    await wrapper.find('[aria-label="Skip"]').trigger('click');
    expect(wrapper.text()).toContain('resting');
    expect(wrapper.text()).toContain('00:00'); // 4分鐘 / 5 = 0.8分鐘，向下取整為0分鐘
  });

  it('應該正確處理循環模式切換', async () => {
    // 關閉循環模式
    await wrapper.find('[aria-label="Toggle Loop"]').trigger('click');
    expect(wrapper.text()).toContain('Loop Off');

    // 開始並完成一個專注-休息循環
    await wrapper.find('[aria-label="Start"]').trigger('click');
    for (let i = 0; i < 300; i++) {
      // 5 minutes focus
      intervalCallback();
    }
    await wrapper.find('[aria-label="Finish Focus"]').trigger('click');

    // 完成休息
    for (let i = 0; i < 60; i++) {
      // 1 minute rest
      intervalCallback();
    }

    // 應該停止而不是開始新的專注階段
    expect(wrapper.text()).toContain('Start Focus');
  });

  it('應該正確更新休息比例', async () => {
    // 調整休息比例為 10
    const ratioSlider = wrapper.find('input[type="range"]');
    await ratioSlider.setValue(10);

    // 開始專注
    await wrapper.find('[aria-label="Start"]').trigger('click');
    for (let i = 0; i < 600; i++) {
      // 10 minutes focus
      intervalCallback();
    }
    expect(wrapper.text()).toContain('10:00');

    // 完成專注
    await wrapper.find('[aria-label="Finish Focus"]').trigger('click');
    expect(wrapper.text()).toContain('01:00'); // 10分鐘 / 10 = 1分鐘休息
  });
});
