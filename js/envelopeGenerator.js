var EnvelopeGenerator = React.createClass({

  handleChange: function(e) {
    this.props.updateEnvelopeValues(e.target.name, e.target.value);
  },

  render: function() {
    return <div id="envelope" className="col-md-3">
      <h3 className="center">Envelope</h3>
      <form onChange={this.handleChange}>
      <div className="env-ctrl-right">
        <label> Attack
          <input id='attack' type='range' min='0' max='1' step='0.05' value={this.props.attack} name='attack' defaultValue />
        </label>
       </div>
       <div className="env-ctrl-right">
        <label> Decay
          <input id='decay' type='range' min='0' max='1' step='0.05' value={this.props.decay} name='decay' defaultValue />
        </label>
       </div>
       <div className="env-ctrl-left">
        <label> Sustain
          <input id='sustain' type='range' min='0' max='1' step='0.05' value={this.props.sustain} name='sustain' defaultValue />
        </label>
       </div>
       <div className="env-ctrl-left">
        <label> Release
         <input id='release' type='range' min='0' max='1' step='0.05' value={this.props.release} name='release' defaultValue/>
        </label>
       </div>
      </form>
      <EnvelopeModes updateEnvelopeMode={this.props.updateEnvelopeMode}/>
    </div>;
  }
});
