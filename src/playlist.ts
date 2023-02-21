export default class Playlist {

  [Symbol.asyncIterator]() {
    return this
  }

  _items: string[]
  get items() {
    return this._items
  }
  set items(value) {
    this._items = value
  }

  _cursor: number = -1
  get cursor() {
    return this._cursor
  }
  set cursor(value) {
    this._cursor = value
  }

  async next() {
    this.cursor++
    var value = this.items[this.cursor]
    return {
      value: value,
      done: value === undefined
    }
  }

  shuffle(items: string[]) {
    this.items = items.reduce(
      ([original, shuffled]) =>
        [original, [...shuffled, ...original.splice(Math.random() * original.length | 0, 1)]],
      [[...items], []]
    )[1]
    this.cursor = -1
    return 'shuffling...'
  }


}

