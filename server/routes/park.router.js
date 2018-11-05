const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

//get all parks in a selected state
router.get('/:postal_code', (req, res) => {
    // let query = `SELECT * FROM park JOIN person ON
    //     "person"."id"="park"."added_by" WHERE "state"=$1 ORDER BY "id";`;
    let query = `SELECT "name", "park"."id","photo_reference", 
    "state", "park_description"."description", "username", "user_id",
    "latitude", "longitude"  
    FROM park 
    LEFT OUTER JOIN park_description ON "park"."id"="park_description".park_id 
    LEFT OUTER JOIN person ON "person"."id"="park_description".user_id[1] 
    WHERE state=$1 ORDER BY "park"."id";`;
    //LEFT OUTER JOIN person ON "person"."id"="park_description".user_id 
    pool.query(query, [req.params.postal_code]).then((results) => {
        res.send(results.rows);
    }).catch((error) => {
        console.log('Error in GET /park:', error);
    })
})

//post a park to the database if it's not alreay in there
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
                (name, latitude, longitude, googleid, photo_reference,state,added_by)
                VALUES ($1,$2,$3,$4,$5,$6,$7);`;
            pool.query(query, [req.body.name, req.body.location.lat, req.body.location.lng,
            req.body.id, req.body.photoReference, req.body.state, added_by]).then(() => {
                if (description) {
                    pool.query(`SELECT id FROM park WHERE name=$1 AND longitude=$2;`, [req.body.name, req.body.location.lng]).then((results) => {
                        let newParkId = results.rows[0].id;
                        console.log('newParkId=', newParkId);
                        console.log('type of added_by:',typeof added_by);
                        pool.query(`INSERT INTO park_description (park_id, description, user_id)
                        VALUES ($1, ARRAY[$2], ARRAY[${added_by}]);`, [newParkId, description] ).catch((error) => {
                                console.log('Error posting description:', error);
                            });
                    }).catch((error) => { console.log('Error getting ID:', error) });
                    res.sendStatus(201);
                }
            }).catch((error) => {
                console.log('Error in POST /park:', error);
                res.sendStatus(500);
            })
        }
    })
})

//post the first description for a park
router.post('/description',(req,res)=>{
    console.log('req.body is:',req.body);
    let query = `INSERT INTO park_description 
        (park_id, description, user_id) VALUES ($1,ARRAY[$2],ARRAY[${req.body.userId}]);`;
    pool.query(query, [req.body.park,req.body.description]).then((results)=>{
        console.log('successfully added description:',req.body.description);
        res.sendStatus(201);
    }).catch((error)=>{
        console.log('Error in POST description:',error);
    })
})

//add another description to a park
router.put('/', (req, res) => {
    console.log('req.body for put:', req.body);
    const query = `UPDATE park_description SET 
        description = description || '{${req.body.description}}', user_id=user_id || '{${req.body.userId}}' WHERE park_id=$1`;
    pool.query(query, [ req.body.park]).then(() => {
        console.log('PUT successful!');
        res.sendStatus(200);
    }).catch((error) => {
        console.log('Error in PUT:', error);
    })
})

//check the database to see if it's already in the database
router.get('/check_database/:id',(req,res)=>{
    console.log('/check_database hit with req.params=',req.params);
    pool.query(`SELECT "name", "park"."id","photo_reference", 
    "state", "park_description"."description", "user_id",
    "latitude", "longitude"  
    FROM park 
    LEFT OUTER JOIN park_description ON "park"."id"="park_description".park_id 
    WHERE googleid=$1 ORDER BY "park"."id";`,[req.params.id]).then((results)=>{
        res.send(results.rows);
    }).catch((error)=>{
        console.log('Error in /check_database:',error);
    })
})

//if it's already in the database, return the descriptions
router.get('/get_park_info/:id',(req,res)=>{
    pool.query(`SELECT "name", "park"."id","photo_reference", 
    "state", "park_description"."description", "user_id",
    "latitude", "longitude"  
    FROM park 
    LEFT OUTER JOIN park_description ON "park"."id"="park_description".park_id 
    WHERE park.id=$1 ORDER BY "park"."id";`,[parseInt(req.params.id)]).then((results)=>{
        res.send(results.rows);
    }).catch((error)=>{
        console.log('Error in /get_park_info');
    })
})

module.exports = router;