var React = require('react');
var _ = require('underscore');

var QueuedButton = require('./queued-button');
var QueuedPicture = require('./queued-picture');

var QueuedPane = React.createClass({
  render: function() {
    const handler = this.props.handlePrintChange;
    const queuedProps = this.props.queued;
    const isPrinting = this.props.isPrinting;
    
    let key = 0;
    let queuedPictures = [];
    let isDisabled = true;
    _.each(this.props.sizeOptions, function(size) {
        var sizeQueue = _.find(queuedProps, function(queue){return queue.size === size});
        queuedPictures.push(
            sizeQueue.prints.map(function(picture) {
                if (picture.number > 0) {
                    if (picture.state === "not started") {
                        isDisabled = false;
                        return (
                            <QueuedPicture key={key++} isPrinting={isPrinting} queuedPicture={picture} printSize={size} handlePrintChange={handler}/>
                        );
                    } else if (picture.state === "in progress") {
                        isDisabled = false;
                    }
                }
            })
        );
    
    });
    
    var queuedSizes = this.props.sizeOptions.map(function(size) {
        return (
            <div key={key++} className="queued-picture-size"><h3>{size}cm</h3></div>
        );
    });
    var queued = queuedPictures.map(function(queuedPicturePerSize) {
        return (
            <div key={key++} className="queued-pictures">{queuedPicturePerSize}</div>
        );
    });
    
    return (
      <div className="queued-pane">
        <h2>Queued Prints</h2> 
        <QueuedButton isPrinting={this.props.isPrinting} handleQueuedButtonClick={this.props.handleQueuedButtonClick} isDisabled={isDisabled}/>
        <div className="queued-pane-queue">
            {_.flatten(_.zip(queuedSizes, queued))}
        </div>
      </div>
    );
  }
});

module.exports = QueuedPane;