import actions from './actions.js'
import mutations from './mutations.js'

export default {
  state: {
    cardColors: {
      Noun: `<div class="bg-white"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>`,
      Adj: 'purple-700',
      Adverb: 'pink-700',
      Conj: 'white',
      ExtraInformation: 'yellow-700',
      HelpingVerb: ' blue-700',
      Location: `<div class="bg-white"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg></div>`,
      Prep: 'red-700',
      TimeCard: 'orange-700',
      Verb: 'green-700'
    },
    tense: ['present simple', 'past simple', 'future simple'],
    typeSentence: ['positive', 'negative', 'question'],
    cards: [],
    playingStep: 'arrange-card',
    nounType: null,
    curTense: null,
    nounPhrase: [],
    verbPhrase: [],
    objectPhrase: [],
    choseWords: []
  },
  mutations: mutations,
  actions: actions
}
