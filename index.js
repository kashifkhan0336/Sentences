var request = require("request");
var htmlParser = require("node-html-parser")
const cheerio = require('cheerio');
const random = require('pick-random');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/sentences', (req, res) => {
    Sentence(req.query.word, req.query.amount).then(function(value) {
        res.json({
            Sentences : value
        });
    })

});




var sentences = []

function Sentence(word, amount) {
    return new Promise(function(resolve, reject) {
        request({ uri: `https://sentence.yourdictionary.com/${word}` }, function(error, response, body) {
            const $ = cheerio.load(body)
            $('#app > div.layout-sidebar.content-wrapper > div.content-grid > div > div > div.display-results > ul > li > div > div > div.sentence.component > p').each(function(index) {
                sentences.push($(this).text())
            })
            resolve(random(sentences, { count: amount }))
            //console.log(root.querySelector(".sentence-list >li"))
        })
    })


}

/*
const request = require('request-promise');
const parser = require('node-html-parser');
const random = require('pick-random');


function Sentence(word, amount) {
    var options = {
        uri: `https://sentence.yourdictionary.com/${word}`,
        transform: function(body) {
            const root = cheerio.load(body)
            return root
        }
    }
    return new Promise(function(resolve, reject) {
        request(options)
            .then(function(root) {
            	var sentences = []
                root('#app > div.layout-sidebar.content-wrapper > div.content-grid > div > div > div.display-results > ul > li > div > div > div.sentence.component > p').each(function(index) {
                    sentences.push($(this).text())
                })
                var choosen = random(sentences, { count: amount });
                resolve(choosen);
                console.log(sentences)
            })
            .catch(function (err){
            	//console.log(err)
            })
    })
}

console.log(Sentence("sit", 2).then(function (value) {
    console.log(value)
}))
*/
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));