import { existsSync, readFileSync, watch, writeFileSync } from "fs"
import { join } from "path"
import { debounce } from "./lib"

export default class Configuration {
  constructor(target: any, jsonFile: string) {
    this._jsonFile = join(__dirname, jsonFile)
    this._target = target
    this.save()
    this.applyFileChanges()
  }
  _target: any
  _jsonFile: string
  _config: any
  get config(): any {
    if (!this._config) {
      if (existsSync(this._jsonFile))
        this._config = JSON.parse(readFileSync(this._jsonFile).toString())
      else
        this._config = {}
    }
    return this._config
  }
  set config(value: any) {
    this._config = value
    this._writing = true
    writeFileSync(this._jsonFile, JSON.stringify(this.config, undefined, 2))
    this._writing = false
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
    watch(this._jsonFile, debounce(() => this.readAll(), 5 * 1000))
  }


}