const BlockBuilder = require('../utils/block.builder');
const _blockService = require('../services/block.service');

class AddData {

  static get blockService() {
    return _blockService;
  }

  static getBlockBuilder(hash) {
    return new BlockBuilder(hash);
  }

  onRequest(req, res) {
    let promise;

    if (this.blockBuilder && !this.blockBuilder.isComplete) {
      this.addRow(req.body.data);
      promise = this.createBlock();
    } else {
      promise = this.constructor.blockService.last()
        .then(lastBlock => {
          this.createBuilder(lastBlock);
          this.addRow(req.body.data);
          return this.createBlock();
        });
    }

    promise
      .then(() => res.sendStatus(201))
      .catch(err => res.status(500).send(err));
  }

  createBuilder(lastBlock) {
    const previous_block_hash = lastBlock ? lastBlock.block_hash : null;
    this.blockBuilder = this.constructor.getBlockBuilder(previous_block_hash);
  }

  addRow(data) {
    this.blockBuilder.set(data);
  }

  createBlock() {
    return this.blockBuilder.isComplete ?
      this.constructor.blockService.add(this.blockBuilder.build()) :
      Promise.resolve();
  }

}

const addData = new AddData();
module.exports = addData.onRequest.bind(addData);