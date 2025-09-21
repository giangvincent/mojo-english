import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

const TestMessage = {
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  template: '<div>{{ msg }}</div>'
}

describe('TestMessage', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(TestMessage, {
      props: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
