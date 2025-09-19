const express = require('express');
const router = express.Router();
const tableinController = require('../controllers/tableinController');

router.get('/', tableinController.getAllTables);
router.get('/:id', tableinController.getTableById);
router.post('/', tableinController.createTable);
router.put('/:id', tableinController.updateTable);
router.delete('/:id', tableinController.deleteTable);

module.exports = router;
