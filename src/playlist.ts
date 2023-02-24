import { library } from "./lib"

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
    return (([v, d = !v]) => ({ value: v, done: d }))([this.items[this.cursor]])
  }

  abort = () => this.cursor = -2

  shuffle(items: string[]) {
    this.cursor = undefined
    return this.items = library.arrays.shuffle(items)
  }
}

