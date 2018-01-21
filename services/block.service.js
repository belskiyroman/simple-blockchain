const storageService = require('./storage.service');

class BlockService {

    add(block) {
        return storageService.create(block.block_hash, block);
    }

    get(count) {
      return storageService.read()
        .then((data) => data.slice(-count))
        .catch((err) => {
          console.error(JSON.stringify(err));
          return Promise.reject(err);
        });
    }

    last() {
        return storageService.read()
          .then((data) => data.pop() || null)
          .catch((err) => {
            console.error(JSON.stringify(err));
            return Promise.reject(err);
          });
    }

}

module.exports = new BlockService();