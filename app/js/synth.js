

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

      if (this.props.note === key.note) {
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
      note: null
    }
  },

  componentDidMount: function() {
    console.log("mounted");
    this.canvas = document.getElementById('canvas');
    this.canvasContext = canvas.getContext('2d');
    var context = new AudioContext();
    var gain = context.createGain();
    this.analyser = context.createAnalyser();
    this.keys = {};

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({
        sysex: false
      }).then(this.onMIDISuccess, this.onMIDIFailure);
    } else {
      alert("No Midi support on " + navigator + " browser.");
    }

    for (var i = 48; i <= 84; i++) {
      var osc = context.createOscillator();
      this.keys[i] = osc;
    }

    for (var key in this.keys) {
        this.keys[key].connect(gain);
        this.keys[key].gain = 0;
        this.keys[key].type = "triangle";
        this.keys[key].frequency.value = 0;
        this.keys[key].start();
    }

    gain.connect(this.analyser);
    this.analyser.connect(context.destination);

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
        this.onNote(note, velocity);
        this.setState({note: note});
        break;
      case 128:
        this.offNote(note, velocity);
        this.setState({note: null});
        break;
    }
  },

  onNote: function(note, velocity) {
    console.log("onNote");
    var osc = this.keys[note];
    var freq = this.noteToFreq(note);
    osc.frequency.value = freq;

    for (var i = 0; i <= velocity; i++) {
      osc.gain += 1;
    }

    velocity = osc.gain;
  },

  offNote: function(note, velocity) {
    console.log("offNote");
    var osc = this.keys[note];
    osc.frequency.value = 0;

    for (var i = velocity; i >= 0; i--) {
      osc.gain -= 1;
    }

    velocity = 0;
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
      <Keyboard note={this.state.note} />
    </div>;
  }
});

ReactDOM.render(
  <Synth />,
  document.getElementById('container')
);
