var React = require('react');

var QueuedPicture = React.createClass({
    render: function() {
        const pictureTitle = this.props.queuedPicture.title;
        const pictureSize  = this.props.printSize;
        const num = this.props.queuedPicture.number;
        const buttonMinus = !this.props.isPrinting ? 
                                    <button className="queued-picture-change" onClick={this.props.handlePrintChange.bind(null, pictureSize, pictureTitle, -1)}>-</button>
                                    : null;
        const buttonPlus  = !this.props.isPrinting ? 
                                    <button className="queued-picture-change" onClick={this.props.handlePrintChange.bind(null, pictureSize, pictureTitle, 1)}>+</button>
                                    : null;
        return (
            <div className="queued-picture">
                <img src={this.props.queuedPicture.path}/>
                <p className="queued-picture-title">{pictureTitle}</p>
                {buttonMinus}
                <p className="queued-picture-number">x {num}</p>
                {buttonPlus}
            </div>
        );
    }
});

module.exports = QueuedPicture;