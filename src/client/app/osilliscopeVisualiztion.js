import React from 'react';
import {render} from 'react-dom';
import VisualisationCtrl from './visualisationCtrl'

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
      this.canvasContext.strokeStyle = '#00FF66';
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
      return <div className="viz">
        <canvas id="canvas" width="400" height="200"></canvas>
        <VisualisationCtrl
          toggleViz={this.props.toggleViz}
          updateWaveForm={this.props.updateWaveForm}
         />
      </div>;
    }
});

export default OsilliscopeVisualiztion;
