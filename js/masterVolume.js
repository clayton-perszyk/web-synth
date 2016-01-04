window.MasterVolume = React.createClass({
  handleChange: function(e) {
      this.props.updateVolumeLevel(e.target.value);
  },

  render: function() {
    return <div id="master-volume">
      <label> <h3>Master Volume</h3>
        <input onChange={this.handleChange} id='master-gain' type='range' min='0' max='1' step='0.1' value={this.props.volume} />
      </label>
    </div>;
  }
});
