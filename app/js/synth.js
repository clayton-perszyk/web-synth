var MasterVolume = React.createClass({
  handleChange: function(e) {
      this.props.updateVolumeLevel(e.target.value);
  },

  render: function() {
    return <div id="masterVolume">
      <label> Master Volume
        <input onChange={this.handleChange} id='master-gain' type='range' min='0' max='1' step='0.1' value='1' />
      </label>
    </div>
  }
});

var EnvelopeModes = React.createClass({

  handleChange: function(e) {
    this.props.updateEnvelopeMode(e.target.value);
  },

  render: function() {
    return <div>
    <h1>Modes: </h1>
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
    return <div>
      <MasterVolume />
      <h1>Envelope</h1>
      <form id='envelope' onChange={this.handleChange}>
       <label> Attack
           <input id='attack' type='range' min='0' max='1' step='0.05' value={this.props.attack} name='attack' />
       </label>
       <label> Decay
           <input id='decay' type='range' min='0' max='1' step='0.05' value={this.props.decay} name='decay' />
       </label>
       <label> Sustain
           <input id='sustain' type='range' min='0' max='1' step='0.05' value={this.props.sustain} name='sustain' />
       </label>
       <label> Release
         <input id='release' type='range' min='0' max='1' step='0.05' value={this.props.release} name='release' />
       </label>
      </form>
      <EnvelopeModes updateEnvelopeMode={this.props.updateEnvelopeMode}/>
    </div>
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
      console.log("this.props.notes", this.props.notes);
      if (this.props.notes.indexOf(key.note) !== -1) {
        className = "on " + className;
      }

      return <div className={className} key={index} />
    }, this);

    return <div id="keys">
      {keyElms}
    </div>
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
      volume: 0.5
    }
  },

  componentDidMount: function() {
    console.log("mounted");
    this.canvas = document.getElementById('canvas');
    this.canvasContext = canvas.getContext('2d');
    this.context = new AudioContext();
    this.vca = this.context.createGain();
    this.master = this.context.createGain();
    this.analyser = this.context.createAnalyser();
    this.keys = {};
    this.activeKeys = {};

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
        this.keys[key].type = "triangle";
        this.keys[key].frequency.value = 0;
        this.keys[key].start();
    }

    this.vca.connect(this.master);
    this.master.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    this.vca.gain.value = 0;
    this.master.gain.value = this.state.volume;

    window.requestAnimationFrame(this.drawFreqData);
  },

  onMIDISuccess: function(midi) {
    console.log("success");
    var inputs = midi.inputs.values();

    for (var input of inputs) {
      input.onmidimessage = this.onMidiMessage;
    }
  },

  onMIDIFailure: function() {
    console.log("Cannot connect: ", e);
  },

  onMidiMessage: function(midiEvent) {
    console.log("midiMesssage");
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
    console.log("processMessage");
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

    console.log(decayVal, attackVal, sustainVal, vcaGain);

    vcaGain.cancelScheduledValues(0);
    vcaGain.setValueAtTime(0, currTime);
    vcaGain.linearRampToValueAtTime(1, currTime + attackVal);
    vcaGain.linearRampToValueAtTime(sustainVal, (currTime + attackVal + decayVal));
  },

  envOff: function(vcaGain, releaseVal, osc, note) {
    var currTime = this.context.currentTime;
    console.log(releaseVal);

    releaseVal *= this.state.egMode;

    console.log("release time", releaseVal, "currTime", currTime);

    vcaGain.cancelScheduledValues(0);
    osc.frequency.cancelScheduledValues(0);
    osc.frequency.setValueAtTime(this.noteToFreq(note), currTime);
    vcaGain.setValueAtTime(vcaGain.value, currTime);
    vcaGain.linearRampToValueAtTime(0, currTime + releaseVal);
    osc.frequency.setValueAtTime(0, currTime + releaseVal);
  },

  onNote: function(note, velocity) {
    console.log("onNote");
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
    console.log("offNote");
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
    console.log(mode);
  },

  updateVolumeLevel: function(volume) {
    this.master.gain.value = volume;
    this.setState({volume: volume});
  },

  drawFreqData: function() {
    var freqBinCountArray;
    var numOfBars;
    var offsetX;
    var barWidth;
    var barHeight;
    var randColorNum;

    freqBinCountArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(freqBinCountArray);
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    numOfBars = 1000;
    for (var i = 0; i < numOfBars; i++) {
      this.canvasContext.fillStyle = 'lightblue';
      offsetX = i;
      barWidth = -2;
      barHeight = -((freqBinCountArray[i]));
      this.canvasContext.fillRect(offsetX, this.canvas.height, barWidth, barHeight);
    }

    window.requestAnimationFrame(this.drawFreqData);
  },


  render: function() {
    return <div>
      <EnvelopeGenerator
        updateEnvelopeValues={this.updateEnvelopeValues}
        updateEnvelopeMode={this.updateEnvelopeMode}
      />
      <Keyboard notes={this.state.notes} />
    </div>;
  }
});

ReactDOM.render(
  <Synth />,
  document.getElementById('container')
);
