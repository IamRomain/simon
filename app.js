const request = require('request');
const express = require('express');
const app = express();
const config = {
    dirPath: 'Desktop/Simon/dist',
    apiKey: "keyWw5DXICwq2p7zA",
    base: 'appPpgY41FB6YzZtL',
    urlLeaderboard: 'https://api.airtable.com/v0/appPpgY41FB6YzZtL/leaderboard?api_key='
}
const airtable = require('airtable');
airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: config.apiKey
});

const db = airtable.base(config.base);

app.set('port', process.env.PORT || 80);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// get leaderboard
app.get('/leaderboard', function (req, res, next) {
    loadJson(config.urlLeaderboard, config.apiKey, res);
});


// add new score
app.get('/leaderboard/addscore', function (req, res, next) {
    addScore(db, req, res);
});


// Launch server
app.listen(app.get('port'), function () {
    console.log('app listening on port ' + app.get('port'));
});



function loadJson(url, apiKey, response, sortField) {
    let loadJson = new Promise(function (resolve, reject) {
        request(url + apiKey, {
            json: true
        }, (err, res, body) => {
            if (err) {
                return console.log(err);
            }

            let json = [];
            res.body.records.forEach(x => {
                json.push(x.fields)
            });

            if (sortField) {
                json.sort((a, b) => {
                    return a[sortField] - b[sortField];
                });
            }

            resolve(json);
        });
    });

    loadJson.then(function (value) {
        response.json(value);
    });
}

function addScore(db, req, res) {
    db('leaderboard').create({
        "name": req.query.name,
        "score": parseInt(req.query.score)
    }, function (err, record) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(record.getId());
    });
    res.send('add new player ' + req.query.name);
}
