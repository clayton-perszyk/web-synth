import React from 'react';
import {render} from 'react-dom';
import OsilliscopeVisualiztion from './osilliscopeVisualiztion';
import EnvelopeGenerator from './envelopeGenerator'
import Filters from './filters'
import FreqBarVisualisation from './freqBarVisualisation'
import Keyboard from './keyboard'
import WaveFormCtrl from './waveFormCtrl'


function makeDistortionCurve(distortionLevel) {
   var k = typeof distortionLevel === 'number' ? distortionLevel : 50,
   n_samples = 44100,
   curve = new Float32Array(n_samples),
   deg = Math.PI / 180,
   i = 0,
   x;

   for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }

   return curve
}

var Synth = React.createClass({
  getInitialState: function() {
    return {
      notes: [],
      attack: 0,
      decay: 0,
      sustain: 0.1,
      release: 0,
      egMode: 1,
      volume: 1,
      waveForm: 'square',
      filterOneType: 'highpass',
      filterTwoType: 'highpass',
      filterOneCutOffFreq: 0,
      filterTwoCutOffFreq: 0,
      visualisation: 'oscilliscope',
    }
  },

  componentWillMount: function() {
    this.context = new AudioContext();
    this.vca = this.context.createGain();
    this.master = this.context.createGain();
    this.filterOne = this.context.createBiquadFilter();
    this.filterTwo = this.context.createBiquadFilter();
    this.distortion = this.context.createWaveShaper();
    this.analyser = this.context.createAnalyser();
    this.keys = {};
    this.activeKeys = {};
  },

  componentDidMount: function() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({
        sysex: false
      }).then(this.onMIDISuccess, this.onMIDIFailure);
    } else {
      alert("No Midi support on " + navigator + " browser.");
    }

    for (var i = 48; i <= 84; i++) {
      var osc = this.context.createOscillator();
      this.keys[i] = osc;
    }

    for (var key in this.keys) {
        this.keys[key].connect(this.vca);
        this.keys[key].gain = 0;
        this.keys[key].type = this.state.waveForm;
        this.keys[key].frequency.value = 0;
        this.keys[key].start();
    }

    this.vca.connect(this.distortion);
    this.distortion.connect(this.filterOne);
    this.filterOne.connect(this.filterTwo);
    this.filterTwo.connect(this.master);
    this.master.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    this.filterOne.frequency.value = this.state.filterOneCutOffFreq;
    this.filterOne.type = this.state.filterOneType;
    this.filterTwo.frequency.value = this.state.filterTwoCutOffFreq;
    this.filterTwo.type = this.state.filterTwoType;
    this.master.gain.value = this.state.volume;
    this.vca.gain.value = 0;
    this.analyser.maxDecibels = 2;
    this.analyser.minDecibels = -100;
    this.analyser.smoothingTimeConstant = 0.85;
  },

  onMIDISuccess: function(midi) {
    var inputs = midi.inputs.values();

    for (var input of inputs) {
      input.onmidimessage = this.onMidiMessage;
    }
  },

  onMIDIFailure: function() {
    console.log("Cannot connect: ", e);
  },

  onMidiMessage: function(midiEvent) {
    var data = midiEvent.data;
    var command = data[0] >> 4;
    var channel = data[0] & 0xf;
    var type = data[0] & 0xf0;
    var note = data[1];
    var velocity = velocity || data[2];

    this.processMessage(type, note, velocity);
  },

  noteToFreq: function(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  },

  processMessage: function(onOrOff, note, velocity) {
    var index;
    var nextState;
    var note = Number(note);
    switch (onOrOff) {
      case 144:
        nextState = this.state.notes.concat([note]);
        this.onNote(note, velocity);
        this.setState({notes: nextState});
        break;
      case 128:
        index = this.state.notes.indexOf(note);
        this.offNote(note, velocity);
        if (this.state.notes.length > 1) {
          this.state.notes.splice(index, 1)
          nextState = {notes: this.state.notes};
        } else {
          nextState = {notes: []};
        }
        this.setState(nextState);
        break;
    }
  },

  envOn: function(vcaGain, attackVal, decayVal, sustainVal) {
    var currTime = this.context.currentTime;

    attackVal *= this.state.egMode;
    decayVal *= this.state.egMode;

    vcaGain.cancelScheduledValues(0);
    vcaGain.setValueAtTime(0, currTime);
    vcaGain.linearRampToValueAtTime(1, currTime + attackVal);
    vcaGain.linearRampToValueAtTime(sustainVal, (currTime + attackVal + decayVal));
  },

  envOff: function(vcaGain, releaseVal, osc, note) {
    var currTime = this.context.currentTime;

    releaseVal *= this.state.egMode;

    vcaGain.cancelScheduledValues(0);
    osc.frequency.cancelScheduledValues(0);
    osc.frequency.setValueAtTime(this.noteToFreq(note), currTime);
    vcaGain.setValueAtTime(vcaGain.value, currTime);
    vcaGain.linearRampToValueAtTime(0, currTime + releaseVal);
    osc.frequency.setValueAtTime(0, currTime + releaseVal);
  },

  onNote: function(note, velocity) {
    var osc = this.keys[note];
    var currTime = this.context.currentTime;

    if (osc === undefined) {
      return;
    }

    this.activeKeys[note] = true;

    osc.frequency.cancelScheduledValues(0);
    osc.frequency.setValueAtTime(this.noteToFreq(note), currTime);

    if (Object.keys(this.activeKeys).length === 1) {
      this.vca.gain.value = velocity / 127;
    }

    this.envOn(this.vca.gain, this.state.attack, this.state.decay, this.state.sustain);
  },

  offNote: function(note, velocity) {
    var osc = this.keys[note];
    var currTime = this.context.currentTime;

    if (osc === undefined) {
      return;
    }

    delete this.activeKeys[note];

    osc.frequency.cancelScheduledValues(0);
    osc.frequency.setValueAtTime(this.noteToFreq(note), currTime);
    osc.frequency.setValueAtTime(0, currTime + 0.1);


    if (Object.keys(this.activeKeys).length === 0) {
      this.envOff(this.vca.gain, this.state.release, osc, note);
    }
  },

  updateEnvelopeValues: function(name, value) {
    if (name === 'attack') {
      this.setState({attack: value});
    } else if (name === 'decay') {
      this.setState({decay: value});
    } else if (name === 'sustain') {
      this.setState({sustain: value});
    } else if (name === 'release') {
      this.setState({release: value});
    }
  },

  updateEnvelopeMode: function(mode) {
    this.setState({egMode: mode});
  },

  updateVolumeLevel: function(volume) {
    this.master.gain.value = volume;
    this.setState({volume: volume});
  },

  updateFilter: function(name, value) {
    console.log("name", name, "value", value);
    if (name === 'filter-one') {
      this.filterOne.type = value;
      this.setState({filterOneType: value});
    } else if (name === 'filter-two') {
      this.filterTwo.type = value;
      this.setState({filterTwoType: value});
    } else if (name === 'filter-freq-one') {
      this.filterOne.frequency.value = value;
      this.setState({filterOneCutOffFreq: value});
    } else if (name === 'filter-freq-two') {
      this.filterTwo.frequency.value = value;
      this.setState({filterTwoCutOffFreq: value});
    } else {
      console.log("Name or value not valid.");
    }
  },

  updateWaveForm: function(newValue) {
    this.setState({waveForm: newValue});
    for (var key in this.keys) {
      this.keys[key].type = newValue;
    }
  },

  updateDistortionValue: function(distortion) {
    if (distortion === 'on') {
      this.distortion.curve = makeDistortionCurve(200);
    } else {
      this.distortion.curve = makeDistortionCurve(0);
    }
  },

  toggleViz: function(newValue) {
    this.setState({visualisation: newValue});
  },

  render: function() {
    var viz;

    if (this.state.visualisation === 'frequency') {
      viz = <FreqBarVisualisation
        analyser={this.analyser}
        toggleViz={this.toggleViz}
        updateWaveForm={this.updateWaveForm}
      />
    } else {
      viz = <OsilliscopeVisualiztion
        analyser={this.analyser}
        toggleViz={this.toggleViz}
        updateWaveForm={this.updateWaveForm}
      />
    }


    return <div id="synth">
        <div id="logo"><img src="../../../images/midi_synth_opti_gray.png"></img></div>
        <div id="controls">
          <EnvelopeGenerator
              attack={this.state.attack}
              decay={this.state.decay}
              sustain={this.state.sustain}
              release={this.state.release}
              updateEnvelopeValues={this.updateEnvelopeValues}
              updateEnvelopeMode={this.updateEnvelopeMode}
           />
          {viz}
          <Filters
            updateFilter={this.updateFilter}
            filterOneCutOffFreq={this.state.filterOneCutOffFreq}
            filterTwoCutOffFreq={this.state.filterTwoCutOffFreq}
          />
          <WaveFormCtrl
            updateDistortionValue={this.updateDistortionValue}
            updateWaveForm={this.updateWaveForm}
            updateVolumeLevel={this.updateVolumeLevel}
            volume={this.state.volume}
            distortionLevel={this.state.distortionLevel}
          />
        </div>
        <div>
          <Keyboard
            notes={this.state.notes}
            processMessage={this.processMessage}
            offNote={this.offNote}
          />
        </div>
    </div>;
  }
});


render(
  <Synth />,
  document.getElementById('container')
);
