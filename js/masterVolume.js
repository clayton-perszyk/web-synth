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
