var express = require('express');
var router = express.Router();

const BillController = require("../controllers/bills");

// Get all bill
router.get('/', BillController.get_all_bills);

// Get a specific bill
router.get('/:id', BillController.get_bills);

// Add a new bill  
router.post('/', BillController.post_bills);

// Update bill details
router.put('/:id', BillController.update_bill);

// Delete bill details
router.delete('/:id', BillController.delete_bill);


module.exports = router;