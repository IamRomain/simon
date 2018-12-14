const request = require('request');
const express = require('express');
const app = express();
const config = {
    dirPath: 'Desktop/simon/dist',
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

app.set('port', process.env.PORT || 10000);

// set header to allow api request
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// allow sharing files with client
app.use(express.static('dist'));

// get main html page
app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/dist/index.html');
});

// get main json
app.get('/datas', function (req, res, next) {
    loadJson(config.urlMain, config.apiKey, res, 'id');
});

// display leaderboard
app.get('/leaderboard', function (req, res, next) {
    res.sendFile(__dirname + '/dist/classement.html');
});

// get leaderboard
app.get('/leaderboard/datas', function (req, res, next) {
    loadJson(config.urlLeaderboard, config.apiKey, res, 'score');
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
            if (res.body.records) {
                res.body.records.forEach(x => {
                    json.push(x.fields)
                });
            }


            if (res.body.offset) {
                nextAjaxReq(url, apiKey, res.body.offset, json).then(function (value) {
                    json = json.concat(value);
                    resolve(json);
                });
            } else {
                resolve(json);
            }
        });
    });

    loadJson.then(function (value) {
        if (sortField) {
            value.sort((a, b) => {
                return a[sortField] - b[sortField];
            });
        }
        response.json(value);
    });
}


function nextAjaxReq(url, apiKey, offset) {
    return new Promise(function (resolve, reject) {
        request(url + apiKey + "&offset=" + offset, {
            json: true
        }, (err, res, body) => {
            if (err) {
                return console.log(err);
            }


            let json = [];
            res.body.records.forEach(x => {
                json.push(x.fields)
            });
            if (res.body.offset) {
                nextAjaxReq(url, apiKey, res.body.offset, json).then(function (value) {
                    json = json.concat(value);
                    console.log(json)
                    resolve(json);
                });
            } else {
                resolve(json);
            }
        });
    });
}

function addScore(db, req, res) {
    db('leaderboard').create({
        "name": req.query.name,
        "score": parseInt(req.query.score),
        "avatarid": parseInt(req.query.avatarid)
    }, function (err, record) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(record.getId());
    });
    res.send('add new player ' + req.query.name);
}
