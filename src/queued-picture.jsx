var React = require('react');

var QueuedPicture = React.createClass({
    render: function() {
        const pictureTitle = this.props.queuedPicture.title;
        const pictureSize  = this.props.printSize;
        const num = this.props.queuedPicture.number;
        return (
            <div className="queued-picture">
                <img src={this.props.queuedPicture.path}/>
                <p className="queued-picture-title">{pictureTitle}</p>
                <button className="queued-picture-change" onClick={this.props.handlePrintChange.bind(null, pictureSize, pictureTitle, -1)}>-</button>
                <p className="queued-picture-number">{num} print{num===1 ? " " : "s"}</p>
                <button className="queued-picture-change" onClick={this.props.handlePrintChange.bind(null, pictureSize, pictureTitle,  1)}>+</button>
            </div>
        );
    }
});

module.exports = QueuedPicture;