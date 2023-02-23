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
    var value = this.items[this.cursor]
    return {
      value: value,
      done: value === undefined
    }
  }

  abort() {
    this.cursor = -2
  }

  shuffle(items: string[]) {
    this.items = library.arrays.shuffle(items)
    this.cursor = undefined
    return this.items
  }


}

