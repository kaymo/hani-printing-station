var React = require('react');

var ChoosePicture = require('./choose-picture');

var ProgressPane = React.createClass({

  render: function() {
    var paneHeader = this.props.isPrinting ? 'Printing' : 'Choose Your Prints';
    var handler = this.props.handlePrintChange;
    var sizeOptions = this.props.sizeOptions;
    
    var pictureChoices = this.props.pictures.map(function(picture, i) {
        return <ChoosePicture key={i} sizeOptions={sizeOptions} picture={picture} handlePrintChange={handler}/>;
    });
    
    return (
      <div className="progress-pane">
        <h2>{paneHeader}</h2>
        <div className="picture-choices">{pictureChoices}</div>
      </div>
    );
  }
});

module.exports = ProgressPane;