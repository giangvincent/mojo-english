import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TableArea from '@/components/game/TableArea.vue';

// jsdom lacks getBoundingClientRect for draggable internals; not needed for button gating
describe('TableArea submit blocking (T7)', () => {
  const mountArea = (playingStep = 'arrange-card') => mount(TableArea, {
    props: { playingStep, round: 1, gameMode: 'standard' }
  });

  it('invalid sentence (Verb first) disables Confirm Position', () => {
    const w = mountArea();
    // inject an invalid sentence directly: Verb cannot start a standard sentence
    (w.vm.sentence) = [
      { id: 'V1a', type: 'Verb', content: [] }
    ];
    return w.vm.$nextTick().then(() => {
      expect(w.vm.sentenceValid).toBe(false);
      const btn = w.find('button');
      expect(btn.attributes('disabled')).toBeDefined();
    });
  });

  it('empty sentence is invalid', () => {
    const w = mountArea();
    expect(w.vm.sentenceValid).toBe(false);
  });

  it('shows invalid-reason text when invalid', () => {
    const w = mountArea();
    (w.vm.sentence) = [{ id: 'P1a', type: 'Prep', point: 7 }];
    return w.vm.$nextTick().then(() => {
      expect(w.vm.invalidReason).toContain('invalid card');
    });
  });
});
