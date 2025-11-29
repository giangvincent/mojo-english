import 'whatwg-fetch'

export default {
  LoadCards: function (store, level) {
    const listCard = [
      'Noun',
      'Verb',
      'Adjective',
      'Adverb',
      'Location',
      'Time',
      'HelpingVerb',
      'ExtraInformation',
      'Preposition',
      'Conjuntion'
    ]
    const filesCard = listCard.map(
      card => 'contents/cards_set_1/' + card + '.json'
    )
    // console.log(filesCard);
    const results = []
    const list = []

    filesCard.forEach(function (url) {
      list.push(
        fetch(url)
          .then(function (res) {
            return res.json()
          })
          .then(res => {
            results.push(...res)
          })
      )
    })

    Promise.all(list).then(function () {
      store.commit('setCards', results)
    })
  }
}
