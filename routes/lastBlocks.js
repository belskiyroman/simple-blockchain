const blockService = require('../services/block.service');

module.exports = function(req, res) {
  const blockNumbers = parseInt(req.params.number);
  blockService.get(blockNumbers).then(
    blocks => res.status(200).send(blocks),
    err => res.status(500).send(err)
  )
};
