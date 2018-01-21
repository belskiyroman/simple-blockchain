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
    this._db[key] = Object.assign({}, data);
    return Promise.resolve(key);
  }

  read(key) {
    return key ?
      Promise.resolve([ Object.assign({}, this._db[key]) ]) :
      Promise.resolve(
        Object.keys(this._db)
          .map(key => Object.assign({}, this._db[key]))
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
    const json = typeof data === 'string' ? data : JSON.stringify(data);
    this.constructor.fs.writeFile(this.constructor.filePath, json, (err) => {
      if (err) {
        console.error(`\nInvalid path ${this.constructor.filePath}.\nYou may have specified a non-existent folder for the database file.\n`);
      }
    });
  }

  _dbInit() {
    let storageData = {};

    if (this.constructor.fs.existsSync(this.constructor.filePath)) {
      try {
        storageData = this._readFile();
      } catch (e) {
        console.error(`\nYour file ${this.constructor.filePath} contain invalid json.\n`);
        process.exit(1);
      }
    } else {
      this._writeFile('{}');
    }

    this._db = new Proxy(storageData, {
        set: (target, prop, value) => {
        target[prop] = value;
        this._writeFile(target);
        return true;
      }
    });
  }

}

module.exports = new StorageService();