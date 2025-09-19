const express = require('express');
const router = express.Router();
const snacksController = require('../controllers/snackController');

router.get('/', snacksController.getAllSnacks);
router.get('/:id', snacksController.getSnackById);
router.post('/', snacksController.createSnack);
router.put('/:id', snacksController.updateSnack);
router.delete('/:id', snacksController.deleteSnack);

module.exports = router;
