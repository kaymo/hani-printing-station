var React = require('react');
var cn = require('classnames');
var _ = require('underscore');

var QueuedButton = React.createClass({
  render: function() {
    var buttonText = this.props.isPrinting ? (this.props.isPrintingComplete ? 'Back' : 'Cancel') : 'Print';
    var classes = cn('queued-button', {'cancel-printing': this.props.isPrinting, 'start-printing': !this.props.isPrinting || this.props.isPrintingComplete});
    
    return (
      <button className={classes} onClick={this.props.handleQueuedButtonClick} disabled={this.props.isDisabled}>
        {buttonText}
      </button>
    );
  }
});

module.exports = QueuedButton;