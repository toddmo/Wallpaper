import { existsSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

import Playlist from "./playlist"

export default class PlaylistPersistence {
  constructor(playlist: Playlist) {
    var self = this
    this.instance = new Proxy(playlist, {
      get(target, property) {
        switch (property) {
          case 'items':
            if (target._items)
              return target._items
            else if (existsSync(self._itemsFile))
              target._items = readFileSync(self._itemsFile).toString().split('\n')
            else
              target._items = []
            break
          case 'cursor':
            if (target._cursor > -1)
              return target._cursor
            else if (existsSync(self._cursorFile))
              target._cursor = parseInt(readFileSync(self._cursorFile).toString()) || -1
            else
              target._cursor = -1
            break
        }
        return target[property]
      },
      set(target, property, newValue, receiver) {
        switch (property) {
          case 'items':
            writeFileSync(self._itemsFile, newValue.join('\n'))
            break
          case 'cursor':
            writeFileSync(self._cursorFile, newValue.toString())
            break
        }
        target[property] = newValue
        return true
      }
    })

  }
  _cursorFile = join(__dirname, '../playlist.cursor.txt')
  _itemsFile = join(__dirname, '../playlist.items.txt')

  instance: Playlist

}

