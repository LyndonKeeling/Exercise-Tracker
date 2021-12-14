import * as exercises from './exercises_model.mjs';
import express from 'express';
const app = express();

const PORT = 3000;

/**
 * Create a new exercise with the name, reps and weight provided in the query parameters
 */

app.use(express.json())    // handle application/json
    .use(express.urlencoded({ extended: true }))    // application/x-www-form-urlencoded

app.post("/exercises", (req, res) => {

    let date = req.body.date;
    if (date.length === 10) {
        let dArr;
        dArr = date.split("-");  // ex input "2010-01-18"
        date = dArr[1] + "-" + dArr[2] + "-" + dArr[0].substring(2); //ex out: "01/18/10"
    };

    exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, date)
        .then(exercise => {
            res.status(201).send(exercise);
        })
        .catch(error => {
            res.status(500).send({ error: 'Request failed' });
        });
});

/**
 * Retrive exercises. 
 * If the query parameters include a reps, then only the exercises for that reps are returned.
 * Otherwise, all exercises are returned.
 */
app.get("/exercises", (req, res) => {
    // Is there a query parameter named reps? If so add a filter based on its value.
    const filter = req.query.reps === undefined
        ? {}
        : { reps: req.query.reps };
    exercises.findExercises(filter, '', 0)
        .then(exercises => {
            res.status(200).send(exercises);
        })
        .catch(error => {
            res.status(500).send({ error: 'Request failed' });
        });
});

/**
 * Update the exercise whose _id is provided and set its name, reps and weight to
 * the values provided in the query parameters
 */
app.put("/exercises/:_id", (req, res) => {
    let date = req.body.date
    if (date.length === 10) {
        let dArr;
        dArr = date.split("-");  // ex input "2010-01-18"
        date = dArr[1] + "-" + dArr[2] + "-" + dArr[0].substring(2); //ex out: "01/18/10"
    };
    exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, date)
        .then(updateCount => {
            res.status(200).send({ updateCount: updateCount });
        })
        .catch(error => {
            res.status(500).send({ error: 'Request failed' });
        });
});

/**
 * Delete the exercise whose _id is provided in the query parameters
 */
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount > 0) {
                res.status(204).send({ deletedCount: deletedCount })
            } else {
                res.status(500).send({ error: 'Request failed' });
            };
        })
        .catch(error => {
            res.status(500).send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});