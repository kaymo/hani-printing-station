var React = require('react');
var cn = require('classnames');

var ProgressPicture = React.createClass({

  render: function() {
    const statusClass = cn("progress-picture-status", this.props.queuedPicture.state.replace(/ /g,''));
    return (
      <div className="progress-picture">
        <img src={this.props.queuedPicture.path}/>
        <p className="progress-picture-title">{this.props.queuedPicture.title}</p>
        <p>{this.props.printSize}cm x {this.props.queuedPicture.number}</p>
        <p className={statusClass}>{this.props.queuedPicture.state}</p>
      </div>
    );
  }
});

module.exports = ProgressPicture;