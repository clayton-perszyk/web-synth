var WaveFormCtrl = React.createClass({

  handleChange: function(e) {
    this.props.updateWaveForm(e.target.value);
  },

  render: function() {
    return <div id="wavform-ctrl" className="col-md-4">
      <form id="wave-form" onChange={this.handleChange}>
      <h3 className="center-wave">Wave Form</h3>
        <label> Sine
            <input id='sine' type='radio' name='wave-form' value='sine' />
        </label>
        <label> Sawtooth
            <input id='sawtooth' type='radio' name='wave-form' value='sawtooth' />
        </label>
        <label> Square
            <input id='square' type='radio' name='wave-form' value='square' defaultChecked />
        </label>
        <label> Triangle
            <input id='triangle' type='radio' name='wave-form' value='triangle' />
        </label>
      </form>
    </div>;
  }
});
