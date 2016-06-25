var _ = require('underscore');

var printer = require('printer');
var util = require('util');

module.exports = function Printing () {

    this.printer = null;
    
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
        return this.printers[this.printer].jobId;
    }
    
    this.getPrinter = function () {
        return this.printer;
    }
    
    this.setPrinter = function (req) {
        this.printer = req.query.printer;
        return this.printer;
    }
    
    this.printFile = function (req) {
        var error = "";
        if (this.printers[this.printer].jobId !== 0) {
            error = "Already printing."
        } else {
            var number = req.query.number; // not yet using
            var size = req.query.size; // not yet using
            var title = req.query.title;
            
            var fileName = _.findWhere(this.pictures, {title: title})
            if (fileName === undefined) {
                error = "File requested for printing not found.";
            } else {
                return error;
                printer.printDirect({
                    data: fileName,
                    printer: this.printer,
                    docname: title,
    
                    success: function (job) {
                        this.printers[this.printer].jobId = job;
                    },
                    error: function (err) {
                        this.printers[this.printer].jobId = 0;
                        error = err;
                        console.log(error);
                    }
                });
            }
        }
        
        return error;
    }
    
    this.cancelJob = function () {
        isCanceled = false;
        
        if (this.printer !== null & this.printers[this.printer].jobId !== null)
            isCanceled = printer.setJob(this.printer, this.printers[this.printer].jobId, 'CANCEL');
            
		return isCanceled;
	}
};