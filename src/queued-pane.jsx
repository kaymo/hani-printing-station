var React = require('react');
var _ = require('underscore');

var QueuedButton = require('./queued-button');
var QueuedPicture = require('./queued-picture');

var QueuedPane = React.createClass({
  render: function() {
    const handler = this.props.handlePrintChange;
    const queuedProps = this.props.queued;
    
    let key = 0;
    let queuedPictures = [];
    _.each(this.props.sizeOptions, function(size) {
        var sizeQueue = _.find(queuedProps, function(queue){return queue.size === size});
        queuedPictures.push(
            sizeQueue.prints.map(function(picture) {
                if (picture.number > 0) {
                    return (
                        <QueuedPicture key={key++} queuedPicture={picture} printSize={size} handlePrintChange={handler}/>
                    );
                }
            })
        );
    
    });
    
    const isDisabled = key === 0;
    
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
        {_.flatten(_.zip(queuedSizes, queued))}
        <QueuedButton isPrinting={this.props.isPrinting} handleQueuedButtonClick={this.props.handleQueuedButtonClick} isDisabled={isDisabled}/>
      </div>
    );
  }
});

module.exports = QueuedPane;