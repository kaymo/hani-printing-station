var React = require('react');

var ChoosePicture = React.createClass({

  render: function() {
    var handler = this.props.handlePrintChange;
    var title = this.props.picture.title;
    var sizeChoices = this.props.sizeOptions.map(function(option) {
        return <button key={option} className="add-print-button" onClick={handler.bind(null, option, title, 1)}>+ {option}cm</button>;        
    });
    
    return (
      <div className="picture-choice">
        <p>{this.props.picture.title}</p>
        <img src={this.props.picture.path}/>
        <div className="add-print-buttons">{sizeChoices}</div>
      </div>
    );
  }
});

module.exports = ChoosePicture;