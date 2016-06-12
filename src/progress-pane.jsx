var React = require('react');

var ChoosePicture = require('./choose-picture');
var ProgressPicture = require('./progress-picture');

var ProgressPane = React.createClass({

  render: function() {
    var paneHeader = this.props.isPrinting ? 'Printing' : 'Choose Your Prints';
    var handler = this.props.handlePrintChange;
    var sizeOptions = this.props.sizeOptions;
    
    var pictureChoices = null;
    var inProgressChoices = null;
    var completedChoices = null;
    if (!this.props.isPrinting) {
        pictureChoices = this.props.pictures.map(function(picture, i) {
            return <ChoosePicture key={i} sizeOptions={sizeOptions} picture={picture} handlePrintChange={handler}/>;
        });
    } else {
        inProgressChoices = this.props.queued.map(function(size, i) {
            return size.prints.map(function(picture, j) {
                if (picture.state === "in progress") {
                    return <ProgressPicture key={picture.title + i} queuedPicture={picture} printSize={size.size}/>;
                }
            });
        });
        completedChoices = this.props.queued.map(function(size, i) {
            return size.prints.map(function(picture, j) {
                if (picture.state === "completed") {
                    return <ProgressPicture key={picture.title + i} queuedPicture={picture} printSize={size.size}/>;
                }
            });
        });
    }
    
    return (
      <div className="progress-pane">
        <h2>{paneHeader}</h2>
        <div className="picture-choices">{pictureChoices}</div>
        <div className="picture-in-progress">{inProgressChoices}</div>
        <div className="picture-completed">{completedChoices}</div>
      </div>
    );
  }
});

module.exports = ProgressPane;