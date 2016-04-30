var React = require('react');

var MenuBar = React.createClass({
  render: function() {
    var handler = this.props.handlePrinterChange;
    var currentPrinter = this.props.printer;
    var printerChoices = this.props.printers.map(function(printer) {
        return <button key={printer.key}
                       onClick={handler.bind(null, printer.key)} 
                       className={currentPrinter === printer.key ? "menu-selected-printer" : "menu-unselected-printer"} 
                       disabled={printer.disabled}>
                       {printer.name}
               </button>;
    });
    
    return (
      <div className="menu">
        <div className="menu-title">
            <h1>Hani's Printing Station</h1>
        </div>
        <div className="menu-printers">
            {printerChoices}
        </div>
      </div>
    );
  }
});

module.exports = MenuBar;