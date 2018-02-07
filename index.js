const express = require('express');
const fs = require('fs');
const request = require('request');
const {
    exec
} = require('child_process');
const app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/thumb/:vidUrlEnc', function (req, res) {
    let url = decodeURIComponent(req.params.vidUrlEnc);

    var download = function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };

    download(url, 'temp.mp4', function () {
        exec('ffmpegthumbnailer -i temp.mp4 -o thumb.jpg -s 512', (err, stdout, stderr) => {
            if (err) {
                console.log('error');
                return;
            }
            console.log('done');
            res.sendFile(__dirname + '/thumb.jpg');
        });
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))