const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/:postal_code', (req, res) => {
    let query = `SELECT * FROM park WHERE "state"=$1 ORDER BY "id";`;
    pool.query(query, [req.params.postal_code]).then((results) => {
        res.send(results.rows);
    }).catch((error) => {
        console.log('Error in GET /park:', error);
    })
})

router.post('/', (req, res) => {
    console.log('req.body:', req.body);
    let googleid = req.body.id || null;
    pool.query(`SELECT * FROM park WHERE googleid = $1;`, [googleid]).then((results) => {
        if (results.rows.length) {
            console.log(req.body.name, 'is already in the database.')
        } else {
            let added_by = req.body.added_by || null;
            let description = req.body.description || null;
            let query = `INSERT INTO park 
                (name, latitude, longitude, googleid, photo_reference,state,added_by,description)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`;
            pool.query(query, [req.body.name, req.body.location.lat, req.body.location.lng,
            req.body.id, req.body.photoReference, req.body.state, added_by,description]).then(() => {
                res.sendStatus(201);
            }).catch((error) => {
                console.log('Error in POST /park:', error);
                res.sendStatus(500);
            })
        }
    })
})

router.put('/', (req,res) => {
    console.log('req.body for put:',req.body);
    const query = `UPDATE park SET "description"=$1, added_by=$2 WHERE "id"=$3`;
    pool.query(query, [req.body.description, req.body.userId, req.body.park]).then(()=>{
        console.log('PUT successful!');
        res.sendStatus(200);
    }).catch((error)=>{
        console.log('Error in PUT:',error);
    })
})



module.exports = router;