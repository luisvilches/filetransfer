/**
 * Created by luisvilches on 29-08-17.
 */

const express = require('express');
const app = express();
const multipart = require('connect-multiparty');
const body = multipart();
const config = require('./config/config');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const Utils = require("./uploaders");
const request = require("request");


app.use(cors());
app.use(express.static('public'));
app.use('/files', express.static('public/uploads'));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', (req,res) => {
    var obj = {};
    var form = new formidable.IncomingForm();

    form.multiples = true;
    form.uploadDir = path.join(__dirname, '/public/uploads');
    form.on('file', (field, file) => {
        let name = file.name;
        let rename = name.replace(/ /g,"-").toLowerCase();
        fs.rename(file.path, path.join(form.uploadDir, rename));

        request({
            method: 'POST',
            url: 'https://www.googleapis.com/urlshortener/v1/url',
            qs: {
              'key': 'AIzaSyC1fRgo2OZP0t_QOou3LdIne1UYWtnURA8',
            },
            body: {
              'longUrl': 'https://filetransfersomarcasoft.herokuapp.com/' + 'files/' + rename,
            },
            json: true,
          }, (err, response, body) => {
            if (err) {
              console.error(err)
            }
          
            if (response.statusCode === 200 || response.statusCode === 304) {
              // Accedemos a nuestra URL corta a través de body.id
              console.log(body.id)
              obj.name = rename;
              obj.url = body.id
            }
          })
    });
    form.on('error', err => {
        console.log('Error: ', err);
    });

    form.on('end', () => {
        setTimeout(function(){
            res.json(obj);
        },2000)
    });
    form.parse(req);
});

app.listen(config.server.port, err => {
    if(err){
        console.log('Error: ' + err);
    } else {
        console.log('Server running in port ' + config.server.port);
    }
});
