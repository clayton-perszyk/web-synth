import React from 'react';
import {render} from 'react-dom';

var Distortion = React.createClass({

  handleChange: function(e) {
    this.props.updateDistortionValue(e.target.value);
  },

  render: function() {
    return <div id="distortion">
      <h3>Distortion</h3>
      <form onChange={this.handleChange}>
        <div className="distortion-ctrl">
          <label> On
              <input type='radio' name='distortion' value='on' />
          </label>
        </div>
        <div className="distortion-ctrl">
          <label> Off
             <input type='radio' name='distortion' value='off' defaultChecked />
          </label>
        </div>
      </form>
    </div>;
  }
});

export default Distortion;
