window.FreqBarVisualisation = React.createClass({

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
    return <div className="viz">
      <canvas id="canvas" width="400" height="200"></canvas>
      <VisualisationCtrl
        toggleViz={this.props.toggleViz}
        updateWaveForm={this.props.updateWaveForm}
       />
    </div>;
  }
});
