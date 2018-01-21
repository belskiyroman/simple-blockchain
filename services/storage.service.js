const _fs = require('fs');
const path = require('path');
const _filePath = path.join(process.env.STORAGE_FOLDER_PATH, 'db.json');

class StorageService {

  static get filePath() {
    return _filePath;
  }

  static get fs() {
    return _fs;
  }

  constructor() {
    this._db = {};
    this.isFileStorage = !!process.env.FILE_STORAGE;

    if (this.isFileStorage) {
      this._dbInit();
    }
  }

  create(key, data) {
    this.db[key] = Object.assign({}, data);
    return Promise.resolve(key);
  }

  read(key) {
    return key ?
      Promise.resolve([ Object.assign({}, this.db[key]) ]) :
      Promise.resolve(
        Object.keys(this.db)
          .map(key => Object.assign({}, this.db[key]))
          .sort((a, b) => a.timestamp - b.timestamp)
      );
  }

  _readFile() {
    try {
      const data = this.constructor.fs.readFileSync(this.constructor.filePath);
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }

  _writeFile(data) {
    try {
      const json = typeof data === 'string' ? data : JSON.stringify(data);
      this.constructor.fs.writeFileSync(this.constructor.filePath, json);
    } catch (e) {
      console.error(e);
    }
  }

  _dbInit() {
    if (this.constructor.fs.existsSync(this.constructor.filePath)) {
      try {
        this._db = new Proxy(this._readFile(), {
            set: (target, prop, value) => {
            target[prop] = value;
            this._writeFile(target);
            return true;
          }
        });
      } catch (e) {
        console.error(`\nYour file ${this.constructor.filePath} contain invalid json.\n`);
        process.exit(1);
      }
    } else {
      this._writeFile('{}');
    }
  }

}

module.exports = new StorageService();