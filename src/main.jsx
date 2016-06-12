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

    handleQueuedButtonClick: function() {
        var snapshot = this.state.printers;
        var currentPrinter = this.state.printer;
        snapshot[currentPrinter].isPrinting = !snapshot[currentPrinter].isPrinting;
        this.setState({
            printers: snapshot
        });
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
        if ((this.state.printers !== null) && (this.state.printer !== null) && (pictureData !== null)) {
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