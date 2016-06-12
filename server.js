/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use('/', express.static(path.join(__dirname, '.')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


/* 
 * Handling AJAX calls 
 */
 
var Printing = require('./server-side/printing');
var printing = new Printing();

app.get('/printers', function(req, res){
   res.send(printing.getPrinters());
});
app.get('/printer', function(req, res){
   res.send(printing.getPrinter());
});
app.post('/printer', function(req, res){
   res.send(printing.setPrinter(req));
});
app.get('/pictures', function(req, res){
   res.send(printing.getPictures());
});
app.get('/job', function(req, res){
   res.send(printing.setJob(req));
});
app.get('/current-job', function(req, res){
   res.send(printing.getCurrentJob());
});
app.post('/job', function(req, res){
   res.send(printing.cancelJob());
});


/* 
 * Start the app on 3000 
 */
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
