/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
export const onlyUnique = function (value, index, self) {
  return self.indexOf(value) === index
}
// Fisher–Yates Shuffle Faster version
export const shuffleArray = function (a, b, c, d) {
  // array,placeholder,placeholder,placeholder
  c = a.length
  while (c) { (b = (Math.random() * c--) | 0), (d = a[c]), (a[c] = a[b]), (a[b] = d) }
}

export const capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
