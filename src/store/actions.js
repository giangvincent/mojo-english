import { all } from "core-js/fn/promise";
import "whatwg-fetch";

export default {
  LoadCards: function(store, level) {
    if (!level) {
      store.dispatch("SetPlayerDataAsync", { level: 0 });
    }
    let self = this;
    let listCard = ["Noun", "Verb", "Location", "Time"];
    let filesCard = listCard.map(
      card => "contents/cards_set_1/" + card + ".json"
    );
    // console.log(filesCard);
    var results = [];
    var list = [];

    filesCard.forEach(function(url, i) {
      list.push(
        fetch(url)
          .then(function(res) {
            return res.json();
          })
          .then(res => {
            results.push(...res);
          })
      );
    });

    Promise.all(list).then(function() {
      store.commit("setCards", results);
    });
  }
};
