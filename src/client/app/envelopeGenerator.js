import React from 'react';
import {render} from 'react-dom';
import EnvelopeModes from './envelopeModes'

var EnvelopeGenerator = React.createClass({

  handleChange: function(e) {
    this.props.updateEnvelopeValues(e.target.name, e.target.value);
  },

  render: function() {
    return <div id="envelope">
      <h3>Envelope</h3>
      <form onChange={this.handleChange}>
      <div className="env-ctrl-right">
        <label> Attack
          <input onChange={this.handleChange} id='attack' type='range' min='0' max='1' step='0.05' value={this.props.attack} name='attack' defaultValue />
        </label>
       </div>
       <div className="env-ctrl-right">
        <label> Decay
          <input onChange={this.handleChange} id='decay' type='range' min='0' max='1' step='0.05' value={this.props.decay} name='decay' defaultValue />
        </label>
       </div>
       <div className="env-ctrl-left">
        <label> Sustain
          <input onChange={this.handleChange} id='sustain' type='range' min='0' max='1' step='0.05' value={this.props.sustain} name='sustain' defaultValue />
        </label>
       </div>
       <div className="env-ctrl-left">
        <label> Release
         <input onChange={this.handleChange} id='release' type='range' min='0' max='1' step='0.05' value={this.props.release} name='release' defaultValue/>
        </label>
       </div>
      </form>
      <EnvelopeModes updateEnvelopeMode={this.props.updateEnvelopeMode}/>
    </div>;
  }
});

export default EnvelopeGenerator;
