const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/', (req, res)=>{
    let query = `SELECT * FROM states ORDER BY "id";`;
    pool.query(query).then((results)=>{
        res.send(results.rows);
    }).catch((error)=>{
        console.log('Error in GET /states:',error);
    })
})



module.exports = router;