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



app.use(cors());
app.use(express.static('public'));
//app.use(express.static(path.join( __dirname , '/uploads')));

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
        obj.name = rename;
        obj.url = '/files/' + rename;
    });
    form.on('error', err => {
        console.log('Error: ', err);
    });

    form.on('end', () => {
        res.json(obj);
    });
    form.parse(req);
})


app.listen(config.server.port, err => {
    if(err){
        console.log('Error: ' + err);
    } else {
        console.log('Server running in port ' + config.server.port);
    }
});
