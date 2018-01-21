const hash = require('../utils/hash');

class BlockBuilder {

  static get hash() {
    return hash;
  }

  constructor(previousHash) {
    this.previousHash = previousHash || 0;
    this.rows = [];
  }

  get isComplete() {
    const ROWS_IN_BLOCK = 5;
    return this.rows.length >= ROWS_IN_BLOCK;
  }

  set(data) {
    const row = typeof data === 'string' ? data : JSON.stringify(data);
    this.rows.push(row);
  }

  build() {
    const previous_block_hash = this.previousHash;
    const rows = this.rows;
    const timestamp = new Date();
    const block_hash = this.constructor.hash(previous_block_hash, rows, timestamp);
    const block = {
      previous_block_hash,
      block_hash,
      timestamp,
      rows
    };

    return block;
  }

}

module.exports = BlockBuilder;