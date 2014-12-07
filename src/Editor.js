/**@jsx React.DOM */
/*jshint browser:true, newcap:false, expr:true*/
"use strict";

var CodeMirror = require('codemirror');
require('codemirror/mode/javascript/javascript');
var Immutable = require('immutable');
var PubSub = require('pubsub-js');
var React = require('react/addons');

var Editor = React.createClass({

  getValue: function() {
    return this.codeMirror && this.codeMirror.getValue();
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.value !== this.codeMirror.getValue()) {
      this.codeMirror.setValue(nextProps.value);
    }
  },

  shouldComponentUpdate: function() {
    return false;
  },

  componentDidMount: function() {
    this._CMHandlers = [];
    this._subscriptions = [];
    this.codeMirror = CodeMirror(
      this.refs.container.getDOMNode(),
      {
        value: this.props.value,
        lineNumbers: true
      }
    );

    if (this.props.onContentChange) {
      this._onContentChange();
    }

    this._bindCMHandler('changes', () => {
      clearTimeout(this._updateTimer);
      this._updateTimer = setTimeout(this._onContentChange, 200);
    });
    this._bindCMHandler('cursorActivity', () => {
      clearTimeout(this._updateTimer);
      this._updateTimer = setTimeout(this._onActivity, 100);
    });

    // This is some really ugly hack to change the highlight in the editor from
    // anywhere - don't do this in a real React app!
    this._markerRange = null;
    this._mark = null;
    this._subscriptions.push(
      PubSub.subscribe('CM.HIGHLIGHT', function(_, loc) {
        if (Immutable.is(loc, this._markerRange)) return;
        this._markerRange = loc;
        if (this._mark) this._mark.clear();
        this._mark =
          this.codeMirror.markText(
            loc.from,
            loc.to,
            {className: 'marked'}
          );
      }.bind(this)),

      PubSub.subscribe('CM.CLEAR_HIGHLIGHT', function() {
        this._markerRange = null;
        if (this._mark) {
          this._mark.clear();
          this._mark = null;
        }
      }.bind(this))
    );
  },

  componentWillUnmount: function() {
    this._unbindHandlers();
    this._markerRange = null;
    this._mark = null;
    var container = this.refs.container.getDOMNode();
    container.removeChild(container.children[0]);
    this.codeMirror = null;
  },

  _bindCMHandler: function(event, handler) {
    this._CMHandlers.push(event, handler);
    this.codeMirror.on(event, handler);
  },

  _unbindHandlers: function() {
    var cmHandlers = this._CMHandlers;
    for (var i = 0; i < cmHandlers.length; i += 2) {
      this.codeMirror.off(cmHandlers[i], cmHandlers[i+1]);
    }
    this._subscriptions.forEach(function(token) {
      PubSub.unsubscribe(token);
    });
  },

  _onContentChange: function() {
    this.props.onContentChange && this.props.onContentChange({
      value: this.codeMirror.getValue(),
      cursor: this.codeMirror.getCursor()
    });
  },

  _onActivity: function() {
    this.props.onActivity && this.props.onActivity(this.codeMirror.getCursor());
  },

  onReset: function() {
    this.props.onReset && this.props.onReset();
  },

  render: function() {
    return (
      <div id="Editor" ref="container" />
    );
  }
});

module.exports = Editor;
