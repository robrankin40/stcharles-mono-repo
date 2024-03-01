const express = require('express');
const router = express.Router();

// Define a route
router.get('/', (req, res) => {
    res.send('this is user route');// this gets executed when user visit http://localhost:3000/user
});

router.get('/:scheduleId', (req, res) => {

});

router.post('/', (req, res) => {

});

router.put('/:scheduleId', (req, res) => {

})

router.delete('/:scheduleId', (req, res) => {

})

// export the router module so that server.js file can use it
module.exports = router;