window.EnvelopeModes = React.createClass({

  handleChange: function(e) {
    this.props.updateEnvelopeMode(e.target.value);
  },

  render: function() {
    return <div id="envelope-modes">
    <h4 className="center">Envelope Mode</h4>
    <form id="egModeCtrl" onChange={this.handleChange}>
     <label> High
         <input id='eg-high' type='radio' name='egMode' value='10'  />
     </label>
     <label> Medium
         <input id='eg-medium' type='radio' name='egMode' value='5' />
     </label>
     <label> Low
         <input id='eg-low' type='radio' name='egMode' value='1' defaultChecked />
     </label>
    </form>
  </div>;
  }
});
