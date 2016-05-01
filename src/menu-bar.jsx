var React = require('react');
var _ = require('underscore');

var MenuBar = React.createClass({
  render: function() {
    var handler = this.props.handlePrinterChange;
    var currentPrinter = this.props.printer;
    var printers = this.props.printers;
    var printerChoices = _.mapObject(printers, function(printer, printerKey) {
        return (
            <button 
                key={printerKey}
                onClick={handler.bind(null, printerKey)} 
                className={currentPrinter === printerKey ? "menu-selected-printer" : "menu-unselected-printer"} 
                disabled={printer.disabled}>
                {printer.name}
            </button>
        );
    });
    
    return (
      <div className="menu">
        <div className="menu-title">
            <h1>Hani's Printing Station</h1>
        </div>
        <div className="menu-printers">
            {_.values(printerChoices)}
        </div>
      </div>
    );
  }
});

module.exports = MenuBar;