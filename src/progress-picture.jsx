var React = require('react');

var ProgressPicture = React.createClass({

  render: function() {
    return (
      <div className="progress-picture">
        <img src={this.props.queuedPicture.path}/>
        <p>{this.props.queuedPicture.title}</p>
        <p>{this.props.queuedPicture.state}</p>
        <p>{this.props.printSize}cm</p>
      </div>
    );
  }
});

module.exports = ProgressPicture;