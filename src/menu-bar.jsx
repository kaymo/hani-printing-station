var React = require('react');
var _ = require('underscore');
var cn = require('classnames');

var MenuBar = React.createClass({
  render: function() {
    const handler = this.props.handlePrinterChange;
    const currentPrinter = this.props.printer;
    const printers = this.props.printers;
    const printerChoices = _.mapObject(printers, function(printer, printerKey) {
        const classes = cn({"menu-selected-printer": currentPrinter === printerKey},
                           {"menu-unselected-printer": currentPrinter !== printerKey},
                           {"menu-printing-printer": printer.isPrinting});
        return (
            <button 
                key={printerKey}
                onClick={handler.bind(null, printerKey)} 
                className={classes} 
                disabled={printer.disabled}>
                <p>{printer.name}</p>
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