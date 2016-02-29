window.DistortionGenerator = React.createClass({

  handleChange: function(e) {
    this.props.updateDistortionValues(e.target.name, e.target.value);
  },

  render: function() {
    return <div id="distortion">
      <h3>Envelope</h3>
      <form onChange={this.handleChange}>
      <div>
        <label> Level
          <input onChange={this.handleChange} id='attack' type='range' min='0' max='1' step='0.05' value={this.props.distortion} name='distortion' />
        </label>
       </div>
      </form>
    </div>;
  }
});
