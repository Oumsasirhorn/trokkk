const express = require('express');
const router = express.Router();
const tableoutController = require('../controllers/tableoutController');

router.get('/', tableoutController.getAllTables);
router.get('/:id', tableoutController.getTableById);
router.post('/', tableoutController.createTable);
router.put('/:id', tableoutController.updateTable);
router.delete('/:id', tableoutController.deleteTable);

module.exports = router;
