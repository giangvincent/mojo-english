import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardComponent from '@/components/game/CardComponent.vue';

describe('CardComponent', () => {
  it('renders runtime wild_card content', async () => {
    const wrapper = mount(CardComponent, {
      props: { card: { id: 'W1a', type: 'wild_card', point: 0 } }
    });
    expect(wrapper.vm.componentName).toBe('WildCard');
    expect(wrapper.text()).not.toContain('Unknown Type');
  });
});
