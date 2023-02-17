import { join } from "path"
import { existsSync } from "fs"
import { readFile, writeFile } from "fs/promises"

export default class Playlist {

  private indexFile = join(__dirname, '../playlist.index.txt')
  private _index: number
  async getIndex(): Promise<number> {
    if (this._index === undefined || Number.isNaN(this._index))
      if (existsSync(this.indexFile)) {
        var buffer = await readFile(this.indexFile)
        var contents = buffer.toString()
        var maybeInt = parseInt(contents)
        this._index = maybeInt || 0
      }
      else
        this.reset()
    return this._index
  }
  private async setIndex(value: number) {
    this._index = value
    await writeFile(this.indexFile, this._index.toString())
  }

  private file = join(__dirname, '../playlist.items.txt')
  private _items: any[] = []
  async getItems(): Promise<any[]> {
    if (!this._items.length) {
      var exists = existsSync(this.file)
      if (exists) {
        var buffer = await readFile(this.file)
        var contents = buffer.toString()
        this._items = contents.split('\n')
      }
    }
    return this._items
  }
  async setItems(value: any[]) {
    this._items = value
    await writeFile(this.file, this._items.join('\n'))
    this.reset()
  }

  //#region  Methods
  async advance() {
    var index = await this.getIndex()
    await this.setIndex(++index)
    return index
  }

  reset() {
    this._index = -1
  }

  create(wallPapers: any[]): any[] {
    console.log(`${new Date().toISOString()} shuffling`)
    var items = []
    while (items.length < wallPapers.length) {
      var randomIndex = Math.floor(Math.random() * wallPapers.length)
      if (!items.includes(wallPapers[randomIndex])) {
        items.push(wallPapers[randomIndex])
      }
    }
    return items
  }

}
