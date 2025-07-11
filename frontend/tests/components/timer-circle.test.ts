import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import TimerCircle from '~/components/pages/index/timer-circle.vue';

describe('TimerCircle', () => {
  const defaultProps = {
    progress: 0,
    focusDuration: 0,
    remainingRestDuration: 0,
    phase: 'focus' as const,
  };

  it('應該在專注階段顯示正確的時間和標籤', () => {
    const props = {
      ...defaultProps,
      focusDuration: 25,
      phase: 'focus' as const,
    };
    const wrapper = mount(TimerCircle, { props });

    expect(wrapper.text()).toContain('25:00');
    expect(wrapper.text()).toContain('focusing');
  });

  it('應該在休息階段顯示正確的時間和標籤', () => {
    const props = {
      ...defaultProps,
      remainingRestDuration: 5,
      phase: 'rest' as const,
    };
    const wrapper = mount(TimerCircle, { props });

    expect(wrapper.text()).toContain('05:00');
    expect(wrapper.text()).toContain('resting');
  });

  it('應該根據階段顯示正確的顏色', () => {
    const focusProps = { ...defaultProps, phase: 'focus' as const };
    const focusWrapper = mount(TimerCircle, { props: focusProps });
    const focusCircle = focusWrapper.find('circle:nth-child(2)');
    expect(focusCircle.attributes('stroke')).toBe('#38bdf8');

    const restProps = { ...defaultProps, phase: 'rest' as const };
    const restWrapper = mount(TimerCircle, { props: restProps });
    const restCircle = restWrapper.find('circle:nth-child(2)');
    expect(restCircle.attributes('stroke')).toBe('#34d399');
  });

  it('應該正確設置 SVG 圓環的屬性', () => {
    const wrapper = mount(TimerCircle, { props: defaultProps });
    const svg = wrapper.find('svg');

    expect(svg.attributes('width')).toBe('220');
    expect(svg.attributes('height')).toBe('220');
  });

  it('應該支援自定義尺寸', () => {
    const props = { ...defaultProps, size: 300, stroke: 20 };
    const wrapper = mount(TimerCircle, { props });
    const svg = wrapper.find('svg');

    expect(svg.attributes('width')).toBe('300');
    expect(svg.attributes('height')).toBe('300');
  });

  it('應該根據進度更新圓環', () => {
    const props = { ...defaultProps, progress: 0.5, phase: 'rest' as const };
    const wrapper = mount(TimerCircle, { props });
    const progressCircle = wrapper.find('circle:nth-child(2)');

    // 檢查 stroke-dashoffset 是否根據進度計算
    const circumference = 2 * Math.PI * 103; // radius = (220 - 14) / 2 = 103
    const expectedOffset = circumference * (1 - 0.5);
    expect(progressCircle.attributes('stroke-dashoffset')).toBe(
      expectedOffset.toString(),
    );
  });
});
