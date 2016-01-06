window.VisualisationCtrl = React.createClass({

  handleChange: function(e) {
    this.props.toggleViz(e.target.value);
  },

  render: function() {
    return <div id="visualisation-ctrl">
      <h3>Visualisation Selection</h3>
      <form id="vis-control" onChange={this.handleChange}>
        <label> Frequency Bars
            <input id='freq-bars' type='radio' name='viz' value='frequency'  />
        </label>
        <label> Oscilliscope
            <input id='oscilliscope' type='radio' name='viz' value='oscilliscope' defaultChecked />
        </label>
      </form>
    </div>
  }
});
