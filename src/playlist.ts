import { shuffle } from "./lib"

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

  _cursor: number
  get cursor() {
    return this._cursor
  }
  set cursor(value) {
    this._cursor = value
  }

  async next() {
    this.cursor++
    let value = this.items[this.cursor]
    let done = !value
    return { value, done }
  }

  abort() {
    this.cursor = -2
  }

  shuffle(items: string[]) {
    this.items = shuffle(items)
    this.cursor = undefined
    return this.items
  }


}

