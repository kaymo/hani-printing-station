var React = require('react');
var _ = require('underscore');

var MenuBar = require('./menu-bar');
var ProgressPane = require('./progress-pane');
var QueuedPane = require('./queued-pane');

const pictureData = [
    {path: '../pictures/from_lambeth_walk_websize.jpg', title: 'From Lambeth Walk'},
    {path: '../pictures/bird_on_a_wire_websize.jpg', title: 'Bird on a Wire'},
    {path: '../pictures/Botallack_III_5x5in_300dpi.jpg', title: 'Botallack III'},
    {path: '../pictures/fox_gloves_and_sea_glimpses_websize.jpg', title: 'Fox Gloves & Sea Glimpses'},
    {path: '../pictures/homeward_bound.jpg', title: 'Homeward Bound'},
    {path: '../pictures/kynance,_a_glittering_sea.jpg', title: 'Kynance, a Glittering Sea'},
    {path: '../pictures/porthminster_point_2.jpg', title: 'Porthminster Point'},
    {path: '../pictures/porthminster_to_st_ives-2.jpg', title: 'Porthminster to St Ives'},
    {path: '../pictures/stardust-2.jpg', title: 'Stardust'},
    {path: '../pictures/surfing_the_wind_ii_(2).jpg', title: 'Surfing the Wind II'},
];

const printerData = [
    {key:"A4", name: "A4 Printer", disabled: false, queued: [{size:14, prints:[]}, {size:19, prints:[]}]},
    {key:"A3", name: "A3 Printer", disabled: false, queued: [{size:26, prints:[]}]},
];
const defaultPrinter = "A4";

var MainPage = React.createClass({

    getInitialState: function() {
        return {
            printers: printerData,
            printer: defaultPrinter,
            isPrinting: false, 
            sizeOptions: _.pluck(_.find(printerData, function(data){return data.key === defaultPrinter}).queued, "size")
        };
    },

    handlePrinterChange: function(newPrinter) {
        this.setState({
            printer: newPrinter,
            sizeOptions: _.pluck(_.find(printerData, function(data){return data.key === newPrinter}).queued, "size")
        });
    },

    handleQueuedButtonClick: function() {
        this.setState({
            isPrinting: !this.state.isPrinting
        });
    },

    handlePrintChange: function(printSize, printTitle, change) {
        var currentPrinter = this.state.printer;
        var queuedPictures = this.state.printers;
            
        var printerIndex = _.findIndex(queuedPictures, function(printer){return printer.key === currentPrinter});
        var sizeIndex = _.findIndex(queuedPictures[printerIndex].queued, function(queue){return queue.size === printSize});
        var queuedPicture = _.findWhere(queuedPictures[printerIndex].queued[sizeIndex].prints, {title: printTitle});
        
        if (queuedPicture === undefined) {
            var data = _.findWhere(pictureData, {title: printTitle});
            queuedPictures[printerIndex].queued[sizeIndex].prints.push({title: printTitle, path: data.path, number: 1});

            this.setState({
                printers: queuedPictures
            });
        } else {
            var indexToUpdate = _.indexOf(this.state.printers[printerIndex].queued[sizeIndex].prints, queuedPicture);
            var updatedQuantity = queuedPictures[printerIndex].queued[sizeIndex].prints[indexToUpdate].number + change;
            queuedPictures[printerIndex].queued[sizeIndex].prints[indexToUpdate].number = Math.max(0, updatedQuantity);

            this.setState({
                printers: queuedPictures
            });
        }
    },

    render: function() {
        var currentPrinter = this.state.printer;
        var queuedPictures = _.find(this.state.printers, function(printer){return printer.key === currentPrinter});
        return (
            <div> 
                <MenuBar      handlePrinterChange={this.handlePrinterChange} printer={this.state.printer} printers={this.state.printers}/>
                <ProgressPane isPrinting={this.state.isPrinting} sizeOptions={this.state.sizeOptions} pictures={pictureData} handlePrintChange={this.handlePrintChange}/>
                <QueuedPane   isPrinting={this.state.isPrinting} sizeOptions={this.state.sizeOptions} queued={queuedPictures.queued} handlePrintChange={this.handlePrintChange} handleQueuedButtonClick={this.handleQueuedButtonClick}/>
            </div>
        );
    }
});

React.render(
    <MainPage/>,
    document.getElementById('content')
);