import React from 'react';
import {render} from 'react-dom';

var Keyboard = React.createClass({
  handleMouseDown: function(e) {
    this.props.processMessage(144, e.target.id, 1);
  },

  handleMouseUp: function(e) {
    this.props.processMessage(128, e.target.id, 1);
  },

  handleMouseOut: function(e) {
    this.props.offNote(e.target.id, 1);
  },

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
      {note: 84, className: 'white last'},
    ];

    var keyElms = keys.map(function(key, index){
      var className = key.className;
      var note = keys[index].note;
      if (this.props.notes.indexOf(key.note) !== -1) {
        className = "on " + className;
      }

      return <div id={note} className={className} key={index} />
    }, this);

    return <div id="keys"
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseOut={this.handleMouseUp}>
      {keyElms}
    </div>;
  }
});

export default Keyboard;
