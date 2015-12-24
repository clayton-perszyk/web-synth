window.Filters = React.createClass({

  handleChange: function(e) {
    this.props.updateFilter(e.target.name, e.target.value);
  },

  render: function() {
      return <div id="filters">
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
