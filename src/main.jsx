var React = require('react');
var _ = require('underscore');
var $ = require('jquery');

var MenuBar = require('./menu-bar');
var ProgressPane = require('./progress-pane');
var QueuedPane = require('./queued-pane');

var pictureData = null;

var MainPage = React.createClass({

    getInitialState: function() {
        return {
            isLoaded: false,
            isPrintingStatusRequested: false,
            printers: null,
            printer: null, 
            sizeOptions: null,
        };
    },

    componentDidMount: function() {
        var self = this;
        
        $.get('http://localhost:3000/printers').done(function(loadedPrinters) {
            $.get('http://localhost:3000/printer').done(function(loadedDefault) {
                $.get('http://localhost:3000/pictures').done(function(pictures) {
                    pictureData = pictures.pictures;
                    
                    self.setState({
                        isLoaded: true,
                        printers: loadedPrinters,
                        printer: loadedDefault,
                        sizeOptions: _.pluck(loadedPrinters[loadedDefault].queued, "size")
                    });
                });
            });
        });
    },

    handlePrinterChange: function(newPrinter) {
        var self = this;
        $.post('http://localhost:3000/printer', {printer: newPrinter}).done(function(currentPrinter) {
            if (currentPrinter === newPrinter) {
                self.setState({
                    printer: newPrinter,
                    sizeOptions: _.pluck(self.state.printers[newPrinter].queued, "size")
                });
            } else {
                console.log("Couldn't change printer from " + currentPrinter + " to " + newPrinter);
            }
        });
    },
    
    updatePrintingStatus: function() {
        if (this.state.printers[this.state.printer].intervalProcess !== 0) {
            clearInterval(this.state.printers[this.state.printer].intervalProcess);
        }
        var snapshot = this.state.printers;
        snapshot[this.state.printer].isPrinting = !snapshot[this.state.printer].isPrinting;
        snapshot[this.state.printer].isPrintingComplete = false;
        snapshot[this.state.printer].intervalProcess = 0;
        this.setState({
            printers: snapshot,
        });
    },
    
    cancelPrinting: function() {
        var self = this;
        $.post('http://localhost:3000/job').done(function(isCanceled) {
            if (isCanceled) {
                // Set all 'in progress' to 'not started'
                var snapshot = self.state.printers;
                _.each(snapshot[self.state.printer].queued, function(sizeQueue) {
                    _.each(sizeQueue.prints, function(print) {
                        if (print.state === "in progress") {
                            print.state = "not started";
                        }
                    });
                });
                self.setState({
                    printers: snapshot,
                });
                self.updatePrintingStatus();
            } else {
                console.log("Couldn't cancel current printing job.");
            }
        });
    },
    
    sendPrintRequest: function() {
        if (!this.state.printers[this.state.printer].isPrinting) return;
        
        var sizeQueueIndex = _.findIndex(this.state.printers[this.state.printer].queued, queue => { 
            return queue.prints.length > 0 && 
                _.filter(queue.prints, print => {return print.number > 0 && print.state === "not started"}).length > 0;
        });
        
        if (sizeQueueIndex < 0) {
            if (this.state.printers[this.state.printer].intervalProcess !== 0) {
                clearInterval(this.state.printers[this.state.printer].intervalProcess);
            }
            var snapshot = this.state.printers;
            snapshot[this.state.printer].isPrintingComplete = true;
            snapshot[this.state.printer].intervalProcess = 0;
            this.setState({
                printers: snapshot,
            });
            return;
        }
        
        var sizeQueue = this.state.printers[this.state.printer].queued[sizeQueueIndex];
        var toPrintIndex = _.findIndex(sizeQueue.prints, print => {
            return print.number > 0 && print.state === "not started";
        });
        var toPrint = sizeQueue.prints[toPrintIndex];
        
        var data = {
            title: toPrint.title,  
            number: toPrint.number,
            size: sizeQueue.size
        };
        
        var self = this;
        $.post('http://localhost:3000/print', data).done(function(message) {
            if (message.length === 0) {
                var snapshot = self.state.printers;
                snapshot[self.state.printer].queued[sizeQueueIndex].prints[toPrintIndex].state = "in progress";
            
                self.setState({
                    printers: snapshot,
                });
            } else {
                alert(message);
            }
        });
    },
    
    printQueue: function() {
        var self = this;
        $.get('http://localhost:3000/current-job').done(function(jobId) {
            if (jobId === 0 || jobId === "") {
            
                // Set all 'in progress' to 'completed'
                var snapshot = self.state.printers;
                _.each(snapshot[self.state.printer].queued, function(sizeQueue) {
                    _.each(sizeQueue.prints, function(print) {
                        if (print.state === "in progress") {
                            print.state = "completed";
                        }
                    });
                });
                self.setState({
                    printers: snapshot,
                });
            
                self.sendPrintRequest();
            }
        });
    },
    
    startPrinting: function() {
        this.updatePrintingStatus();
        this.sendPrintRequest();
        
        var processId = setInterval(this.printQueue, 10000);
        var snapshot = this.state.printers;
        snapshot[this.state.printer].intervalProcess = processId;
        this.setState({
            printers: snapshot,
        });
    },

    handleQueuedButtonClick: function() {
        if (this.state.printers[this.state.printer].isPrinting && this.state.printers[this.state.printer].isPrintingComplete) {
            var snapshot = this.state.printers;
            snapshot[this.state.printer].isPrinting = false;
            snapshot[this.state.printer].isPrintingComplete = false;
            this.setState({
                printers: snapshot,
            });
            return;
        }
        
        if (!this.state.isPrintingStatusRequested) {
            // Lock further requests
            this.setState({
                isPrintingStatusRequested: true,
            });
        
            if (!this.state.printers[this.state.printer].isPrinting === false) {
                this.cancelPrinting();
            } else {
                this.startPrinting();
            }
            
            // Unlock further requests
            this.setState({
                isPrintingStatusRequested: false,
            });
        }  
    },

    handlePrintChange: function(printSize, printTitle, change) {
        var currentPrinter = this.state.printer;
        var queuedPictures = this.state.printers;
            
        var sizeIndex = _.findIndex(queuedPictures[currentPrinter].queued, function(queue){return queue.size === printSize});
        var queuedPicture = _.findWhere(queuedPictures[currentPrinter].queued[sizeIndex].prints, {title: printTitle, state: "not started"});
        
        if (queuedPicture === undefined) {
            var data = _.findWhere(pictureData, {title: printTitle});
            queuedPictures[currentPrinter].queued[sizeIndex].prints.push({title: printTitle, path: data.path, number: 1, state: "not started"});

            this.setState({
                printers: queuedPictures
            });
        } else {
            var indexToUpdate = _.indexOf(this.state.printers[currentPrinter].queued[sizeIndex].prints, queuedPicture);
            var updatedQuantity = queuedPictures[currentPrinter].queued[sizeIndex].prints[indexToUpdate].number + change;
            queuedPictures[currentPrinter].queued[sizeIndex].prints[indexToUpdate].number = Math.max(0, updatedQuantity);

            this.setState({
                printers: queuedPictures
            });
        }
    },

    render: function() {
        if (this.state.isLoaded) {
            var currentPrinter = this.state.printer;
            var queuedPictures = this.state.printers[currentPrinter];
            return (
                <div> 
                    <MenuBar      handlePrinterChange={this.handlePrinterChange} printer={this.state.printer} printers={this.state.printers}/>
                    <ProgressPane isPrinting={queuedPictures.isPrinting} sizeOptions={this.state.sizeOptions} queued={queuedPictures.queued} pictures={pictureData} handlePrintChange={this.handlePrintChange}/>
                    <QueuedPane   isPrinting={queuedPictures.isPrinting} sizeOptions={this.state.sizeOptions} queued={queuedPictures.queued} isPrintingComplete={queuedPictures.isPrintingComplete} handlePrintChange={this.handlePrintChange} handleQueuedButtonClick={this.handleQueuedButtonClick}/>
                </div>
            );
        } else {
            return null;
        }
    }
});

React.render(
    <MainPage/>,
    document.getElementById('content')
);