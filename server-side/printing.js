var _ = require('underscore');

var printer = require('printer');
var util = require('util');

module.exports = function Printing () {

    this.printer = null;
    this.jobId = null;
    
    this.printers = {};
    this.pictures = {};
    
    this.loadPrinters = function () {
        
        // Get expected printers
        this.printers = require( "../data/printers.json" );
        
        // Get installed printers and their statuses
        var printers = printer.getPrinters();
        
        // Set the default printer to be the first detected printer
        this.printer = _.findKey(this.printers, {"disabled": false});
    }
    
    this.loadPictures = function () {
        this.pictures = require( "../data/pictures.json" );
    }
    
    this.getPrinters = function () {
        if (_.isEmpty(this.printers)) {
            this.loadPrinters();
        }
        
        return this.printers;
    }
    
    this.getPictures = function () {
        if (_.isEmpty(this.pictures)) {
            this.loadPictures();
        }
        
        return this.pictures;
    }
    
    this.getCurrentJob = function () {
        return this.jobId;
    }
    
    this.getPrinter = function () {
        return this.printer;
    }
    
    this.setPrinter = function (req) {
        this.printer = req.query.printer;
        return this.printer;
    }
    
    this.printFile = function (req) {
        var fileName = req.query.filename;
        
        var error = 0;
        printer.printDirect({
            data: fileName,
            printer: this.printer, 
    
            success: function (job) {
                this.jobId = job;
            },
            error: function (err) {
                this.jobId = 0;
                error = err;
                console.log(error);
            }
        });
        
        return error;
    }
    
    this.cancelJob = function () {
        isCanceled = false;
        
        if (this.printer !== null & this.jobId !== null)
            isCanceled = printer.setJob(this.printer, this.jobId, 'CANCEL');
            
		return isCanceled;
	}
};