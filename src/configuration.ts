import { existsSync, readFileSync, watch, writeFileSync } from "fs"
import { join } from "path"
import { library } from "./lib"

export default class Configuration {
  constructor(target: any, jsonFile: string) {
    this._jsonFile = join(__dirname, jsonFile)
    this._target = target
    this.save()
    this.applyFileChanges()
  }
  _target: any
  _jsonFile: string
  _contents: string
  get contents() {
    if (!this._contents) {
      if (existsSync(this._jsonFile))
        this._contents = readFileSync(this._jsonFile).toString()

    }
    return this._contents
  }
  set contents(value) {
    this._contents = value
    this._writing = true
    writeFileSync(this._jsonFile, this._contents)
    this._writing = false
  }

  _config: any
  get config(): any {
    if (!this._config) {
      if (this.contents)
        this._config = JSON.parse(this.contents)
      else
        this._config = {}
    }
    return this._config
  }
  set config(value: any) {
    this._config = value
    this.contents = JSON.stringify(this.config, undefined, 2)
  }

  read(property: string | symbol, defaultValue: any): any {
    var value: any
    if (this._target[property] !== undefined)
      value = this._target[property]
    else if (this.config[property] !== undefined)
      value = this.config[property]
    else {
      value = defaultValue
      this.write(property, value)
    }
    this._target[`_${property.toString()}`] = value
    return this._target[property]
  }

  readAll() {
    this._config = undefined
    this._contents = undefined
    Object.assign(this._target, this.config)
  }

  private _writing: boolean = false
  write(property: string | symbol, value: string) {
    this.config[property] = value
    this.save()
  }

  save() {
    this.config = this.config
  }

  applyFileChanges() {
    if (this._writing) return
    watch(this._jsonFile, library.timing.debounce(() => this.readAll(), 5 * 1000))
  }


}