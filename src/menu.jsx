var React = require('react');
var ReactDOM = require('react-dom');

var MenuBar = React.createClass({
  render: function() {
    return (
      <h1>{this.props.headerMessage}</h1>
    );
  }
});