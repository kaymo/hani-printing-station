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
            sizeOptions: null
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
            if (currentPrinter !== newPrinter) {
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
        var snapshot = this.state.printers;
        snapshot[this.state.printer].isPrinting = !snapshot[this.state.printer].isPrinting;
        this.setState({
            printers: snapshot
        });
    },
    
    cancelCurrentJob: function() {
        var self = this;
        $.post('http://localhost:3000/job').done(function(isCanceled) {
            if (isCanceled) {
                self.updatePrintingStatus();
            } else {
                console.log("Couldn't cancel current printing job.");
            }
        });
    },
    
    startPrinting: function() {
        this.updatePrintingStatus();
    },

    handleQueuedButtonClick: function() {
        if (!this.state.isPrintingStatusRequested) {
            // Lock further requests
            this.setState({
                isPrintingStatusRequested: true,
            });
        
            if (!this.state.printers[this.state.printer].isPrinting === false) {
                this.cancelCurrentJob();
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
        var queuedPicture = _.findWhere(queuedPictures[currentPrinter].queued[sizeIndex].prints, {title: printTitle});
        
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
                    <QueuedPane   isPrinting={queuedPictures.isPrinting} sizeOptions={this.state.sizeOptions} queued={queuedPictures.queued} handlePrintChange={this.handlePrintChange} handleQueuedButtonClick={this.handleQueuedButtonClick}/>
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