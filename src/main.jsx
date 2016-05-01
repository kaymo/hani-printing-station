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

const printerData = {
    "A4": {name: "A4 Printer", disabled: false, isPrinting:false, queued: [{size:14, prints:[]}, {size:19, prints:[]}]},
    "A3": {name: "A3 Printer", disabled: false, isPrinting:false, queued: [{size:26, prints:[]}]},
};
const defaultPrinter = "A4";

var MainPage = React.createClass({

    getInitialState: function() {
        return {
            printers: printerData,
            printer: defaultPrinter, 
            sizeOptions: _.pluck(printerData[defaultPrinter].queued, "size")
        };
    },

    handlePrinterChange: function(newPrinter) {
        this.setState({
            printer: newPrinter,
            sizeOptions: _.pluck(printerData[newPrinter].queued, "size")
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
            queuedPictures[currentPrinter].queued[sizeIndex].prints.push({title: printTitle, path: data.path, number: 1});

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
        var currentPrinter = this.state.printer;
        var queuedPictures = this.state.printers[currentPrinter];
        return (
            <div> 
                <MenuBar      handlePrinterChange={this.handlePrinterChange} printer={this.state.printer} printers={this.state.printers}/>
                <ProgressPane isPrinting={queuedPictures.isPrinting} sizeOptions={this.state.sizeOptions} pictures={pictureData} handlePrintChange={this.handlePrintChange}/>
                <QueuedPane   isPrinting={queuedPictures.isPrinting} sizeOptions={this.state.sizeOptions} queued={queuedPictures.queued} handlePrintChange={this.handlePrintChange} handleQueuedButtonClick={this.handleQueuedButtonClick}/>
            </div>
        );
    }
});

React.render(
    <MainPage/>,
    document.getElementById('content')
);