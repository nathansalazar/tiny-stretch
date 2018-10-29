const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/:postal_code', (req, res) => {
    let query = `SELECT * FROM park WHERE "state"=$1;`;
    pool.query(query, [req.params.postal_code]).then((results) => {
        res.send(results.rows);
    }).catch((error) => {
        console.log('Error in GET /park:', error);
    })
})

router.post('/', (req, res) => {
    console.log('req.body:', req.body);
    pool.query(`SELECT * FROM park WHERE googleid = $1;`, [req.body.id]).then((results) => {
        if (results.rows.length) {
            console.log(req.body.name, 'is already in the database.')
        } else {
            let added_by = null;
            if(req.body.added_by){
                added_by = req.body.added_by
            }
            let query = `INSERT INTO park 
                (name, latitude, longitude, googleid, photo_reference,state,added_by)
                VALUES ($1,$2,$3,$4,$5,$6,$7);`;
            pool.query(query, [req.body.name, req.body.location.lat, req.body.location.lng,
            req.body.id, req.body.photoReference, req.body.state, added_by]).then(() => {
                res.sendStatus(201);
            }).catch((error) => {
                console.log('Error in POST /park:', error);
                res.sendStatus(500);
            })
        }
    })


})



module.exports = router;