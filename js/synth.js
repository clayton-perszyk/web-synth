var VisualisationCtrl = React.createClass({

  handleChange: function(e) {
    this.props.toggleViz(e.target.value);
  },

  render: function() {
    return <div id="visualisation-ctrl">
      <h3>Visualisation Selection</h3>
      <form id="vis-control" onChange={this.handleChange}>
        <label> Frequency Bars
            <input id='freq-bars' type='radio' name='viz' value='frequency' defaultChecked />
        </label>
        <label> Oscilliscope
            <input id='oscilliscope' type='radio' name='viz' value='oscilliscope' />
        </label>
      </form>
    </div>
  }
});

var OsilliscopeVisualiztion = React.createClass({

    componentDidMount: function() {
      this.canvas = document.getElementById('canvas');
      this.canvasContext = this.canvas.getContext('2d');
      window.requestAnimationFrame(this.drawOscilliscope);
    },

    drawOscilliscope: function() {
      var data;
      var width;
      var length;
      var width;
      var x;


      length = this.props.analyser.frequencyBinCount;
      data = new Uint8Array(length);
      this.props.analyser.getByteTimeDomainData(data);
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasContext.fillStyle = 'black'
      this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasContext.lineWidth = 2;
      this.canvasContext.strokeStyle = '#00f891';
      this.canvasContext.beginPath();
      width = canvas.width * 1.0 / length;
      x = 0;

      for (var i = 0; i < length; i++) {
        var v = data[i] /128;
        var y = v * this.canvas.height / 2;

        if (i === 0) {
          this.canvasContext.moveTo(x, y);
        } else {
          this.canvasContext.lineTo(x, y);
        }

        x += width;
      }

      this.canvasContext.lineTo(this.canvas.width, this.canvas.height / 2);
      this.canvasContext.stroke();

      window.requestAnimationFrame(this.drawOscilliscope);
    },

    render: function() {
      return <div className="col-md-5">
        <canvas id="canvas" width="400" height="200"></canvas>
        <VisualisationCtrl toggleViz={this.props.toggleViz} />
      </div>;
    }
});

var FreqBarVisualisation = React.createClass({

  componentDidMount: function() {
    this.canvas = document.getElementById('canvas');
    this.canvasContext = this.canvas.getContext('2d');
    window.requestAnimationFrame(this.drawFreqData);
  },

  drawFreqData: function() {
    var freqBinCountArray;
    var numOfBars;
    var offsetX;
    var barWidth;
    var barHeight;
    var randColorNum;

    freqBinCountArray = new Uint8Array(this.props.analyser.frequencyBinCount);
    this.props.analyser.getByteFrequencyData(freqBinCountArray);
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    numOfBars = 1000;
    for (var i = 0; i < numOfBars; i++) {
      this.canvasContext.fillStyle = '#00e3f8';
      offsetX = i;
      barWidth = -2;
      barHeight = -((freqBinCountArray[i]));
      this.canvasContext.fillRect(offsetX, this.canvas.height, barWidth, barHeight);
    }

    window.requestAnimationFrame(this.drawFreqData);
  },

  render: function() {
    return <div className="col-md-5">
      <canvas id="canvas" width="400" height="200"></canvas>
      <VisualisationCtrl toggleViz={this.props.toggleViz} />
    </div>;
  }
});

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

var Filters = React.createClass({

  handleChange: function(e) {
    this.props.updateFilter(e.target.name, e.target.value);
  },

  render: function() {
      return <div id="filters" className="col-md-4">
          <form id="filter-one" onChange={this.handleChange}>
          <h3>Filter 1</h3>
          <div className="filter-ctrl">
          <label> High-Pass
           <input  className='high-pass filter-input' type='radio' name='filter-one' value='highpass' defaultChecked />
          </label>
         </div>
         <div className="filter-ctrl">
          <label> Low-Pass
            <input className='low-pass filter-input' type='radio' name='filter-one' value='lowpass' />
          </label>
         </div>
         <div className="filter-ctrl">
          <label> Band Pass
            <input className='band-pass filter-input' type='radio' name='filter-one' value='bandpass' />
          </label>
          </div>
          <div className='cutoff-freq'>
            <label> Cutoff frequency
              <input className='filter-freq' type='range' min='0' max='5000' step='100' value={this.props.filterOneCutOffFreq} name='filter-freq-one' />
            </label>
          </div>
        </form>

        <form id="filter-two" onChange={this.handleChange}>
          <h3>Filter 2</h3>
          <div className="filter-ctrl">
           <label> High-Pass
            <input className='high-pass' type='radio' name='filter-two' value='highpass' defaultChecked />
           </label>
          </div>
          <div className="filter-ctrl">
           <label> Low-Pass
             <input className='low-pass' type='radio' name='filter-two' value='lowpass' />
           </label>
          </div>
          <div className="filter-ctrl">
           <label> Band Pass
             <input className='band-pass' type='radio' name='filter-two' value='bandpass' />
           </label>
          </div>
          <div id='cutoff-freq'>
            <label> Cutoff frequency
              <input className='filter-freq' type='range' min='0' max='5000' step='100' value={this.props.filterTwoCutOffFreq} name='filter-freq-two' />
            </label>
          </div>
        </form>
     </div>;
  }
});

var MasterVolume = React.createClass({
  handleChange: function(e) {
      this.props.updateVolumeLevel(e.target.value);
  },

  render: function() {
    return <div id="master-volume" className="col-md-3">
      <label> Master Volume
        <input onChange={this.handleChange} id='master-gain' type='range' min='0' max='1' step='0.1' value='1' />
      </label>
    </div>;
  }
});

var EnvelopeModes = React.createClass({

  handleChange: function(e) {
    this.props.updateEnvelopeMode(e.target.value);
  },

  render: function() {
    return <div id="envelope-modes">
    <h4 className="center">Envelope Mode</h4>
    <form id="egModeCtrl" onChange={this.handleChange}>
     <label> High
         <input id='eg-high' type='radio' name='egMode' value='10' />
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

var Keyboard = React.createClass({
  render: function() {
    var keys = [
      {note: 48, className: 'white'},
      {note: 49, className: 'black'},
      {note: 50, className: 'white'},
      {note: 51, className: 'black'},
      {note: 52, className: 'white more'},
      {note: 53, className: 'white'},
      {note: 54, className: 'black'},
      {note: 55, className: 'white'},
      {note: 56, className: 'black'},
      {note: 57, className: 'white'},
      {note: 58, className: 'black'},
      {note: 59, className: 'white more'},
      {note: 60, className: 'white'},
      {note: 61, className: 'black'},
      {note: 62, className: 'white'},
      {note: 63, className: 'black'},
      {note: 64, className: 'white more'},
      {note: 65, className: 'white'},
      {note: 66, className: 'black'},
      {note: 67, className: 'white'},
      {note: 68, className: 'black'},
      {note: 69, className: 'white'},
      {note: 70, className: 'black'},
      {note: 71, className: 'white more'},
      {note: 72, className: 'white'},
      {note: 73, className: 'black'},
      {note: 74, className: 'white'},
      {note: 75, className: 'black'},
      {note: 76, className: 'white more'},
      {note: 77, className: 'white'},
      {note: 78, className: 'black'},
      {note: 79, className: 'white'},
      {note: 80, className: 'black'},
      {note: 81, className: 'white'},
      {note: 82, className: 'black'},
      {note: 83, className: 'white more'},
      {note: 84, className: 'white'},
    ];

    var keyElms = keys.map(function(key, index){
      var className = key.className;
      if (this.props.notes.indexOf(key.note) !== -1) {
        className = "on " + className;
      }

      return <div className={className} key={index} />
    }, this);

    return <div id="keys" className="col-md-12">
      {keyElms}
    </div>;
  }
});


var Synth = React.createClass({
  getInitialState: function() {
    return {
      notes: [],
      attack: 0,
      decay: 0,
      sustain: 1,
      release: 0,
      egMode: 1,
      volume: 0.5,
      waveForm: 'square',
      filterOneType: 'highpass',
      filterTwoType: 'highpass',
      filterOneCutOffFreq: 0,
      filterTwoCutOffFreq: 0,
      visualisation: 'frequency'
    }
  },

  componentWillMount: function() {
    this.context = new AudioContext();
    this.vca = this.context.createGain();
    this.master = this.context.createGain();
    this.filterOne = this.context.createBiquadFilter();
    this.filterTwo = this.context.createBiquadFilter();
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

    this.vca.connect(this.filterOne);
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
    this.analyser.minDecibels = -80;
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
    switch (onOrOff) {
      case 144:
        var nextState = this.state.notes.concat([note]);
        this.onNote(note, velocity);
        this.setState({notes: nextState});
        break;
      case 128:
        this.offNote(note, velocity);
        this.setState({notes: []});
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

  toggleViz: function(newValue) {
    this.setState({visualisation: newValue});
  },

  render: function() {
    var viz;

    if (this.state.visualisation === 'frequency') {
      viz = <FreqBarVisualisation
        analyser={this.analyser}
        toggleViz={this.toggleViz}
      />
    } else {
      viz = <OsilliscopeVisualiztion
        analyser={this.analyser}
        toggleViz={this.toggleViz}
      />
    }

    return <div>
      <div id="controls">
        <div className="row">
          <h2 id="logo">LOGO</h2>
        </div>
        <div className="row">
          <Filters
            updateFilter={this.updateFilter}
            filterOneCutOffFreq={this.state.filterOneCutOffFreq}
            filterTwoCutOffFreq={this.state.filterTwoCutOffFreq}
          />
          {viz}
          <MasterVolume />
        </div>
        <div className="row">
          <WaveFormCtrl
            updateWaveForm={this.updateWaveForm}
          />
          <EnvelopeGenerator
              attack={this.state.attack}
              decay={this.state.decay}
              sustain={this.state.sustain}
              release={this.state.release}
              updateEnvelopeValues={this.updateEnvelopeValues}
              updateEnvelopeMode={this.updateEnvelopeMode}
           />
        </div>
      </div>
      <div className="row">
        <Keyboard
          notes={this.state.notes}
        />
      </div>
    </div>;
  }
});


ReactDOM.render(
  <Synth />,
  document.getElementById('container')
);
