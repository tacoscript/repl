import React from 'react';

var baseStyleHorizontal = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  boxSizing: 'border-box',
};

var baseStyleVertical = {
  position: 'absolute',
  left: 0,
  right: 0,
  boxSizing: 'border-box',
};

var noop = () => {};

/**
 * Creates a left-right split pane inside its container.
 */
export default React.createClass({
  getInitialState: function() {
    return {
      dividerPosition: 50,
    };
  },
  getInitialProps: function() {
    return {
      onToggle: noop,
    };
  },

  _onMouseDown: function(e) {
    var now = +new Date();
    if (now - this._lastMouseDown < 250) {
      return this.props.onToggle(e);
    }
    this._lastMouseDown = now;
    var vertical = this.props.vertical;
    var max = vertical ? global.innerHeight : global.innerWidth;
    global.document.body.style.cursor = vertical ? 'row-resize' : 'col-resize';
    var moveHandler = function(event) {
      event.preventDefault();
      this.setState({
        dividerPosition: ((vertical ? event.pageY : event.pageX) / max) * 100});
    }.bind(this);
    var upHandler = function() {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      global.document.body.style.cursor = '';

      if (this.props.onResize) {
        this.props.onResize();
      }
    }.bind(this);

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  },

  _getDividerStyles: function(dividerPos) {
    var styleA;
    var styleB;
    var dividerStyle;
    var offset =
      0 <= dividerPos && dividerPos < 1 ? 2.5 * (1 - dividerPos) :
      99 < dividerPos && dividerPos <= 100 ? -2.5 * (dividerPos - 99) : 0;
    if (this.props.vertical) {
      // top
      styleA = {
        ...baseStyleVertical,
        top: 0,
        height: dividerPos + '%',
        paddingBottom: 3,
      };
      // bottom
      styleB = {
        ...baseStyleVertical,
        bottom: 0,
        height: (100 - dividerPos) + '%',
        paddingTop: 3,
      };
      dividerStyle = {
        ...baseStyleVertical,
        top: dividerPos + '%',
        height: 5,
        marginTop: -2.5 + offset,
        zIndex: 100,
      };
    } else {
      // left
      styleA = {
        ...baseStyleHorizontal,
        left: 0,
        width: dividerPos + '%',
        paddingRight: 3,
      };
      // right
      styleB = {
        ...baseStyleHorizontal,
        right: 0,
        width: (100 - dividerPos) + '%',
        paddingLeft: 3,
      };
      dividerStyle = {
        ...baseStyleHorizontal,
        left: dividerPos + '%',
        width: 5,
        marginLeft: -2.5 + offset,
        zIndex: 100,
      };
    }
    return {styleA, styleB, dividerStyle};
  },

  render: function() {
    var children = this.props.children;

    if (!Array.isArray(children) || children.filter(x => x).length !== 2) {
      return (
        <div className={this.props.className}>
          <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
            {this.props.children}
          </div>
          {this.props.onToggle == null || this.props.onToggle === noop ? null :
            <div
              className={
                'splitpane-divider' + (this.props.vertical ? ' vertical' : '')
              }
              onClick={this.props.onToggle}
              style={this._getDividerStyles(children[0] ? 100 : 0).dividerStyle}
            />
          }
        </div>
      );
    }

    var {styleA, styleB, dividerStyle} = this._getDividerStyles(this.state.dividerPosition);
    return (
      <div className={this.props.className}>
        <div style={styleA}>
          {this.props.children[0]}
        </div>
        <div
          className={
            'splitpane-divider' + (this.props.vertical ? ' vertical' : '')
          }
          onMouseDown={this._onMouseDown}
          style={dividerStyle}
        />
        <div style={styleB}>
          {this.props.children[1]}
        </div>
      </div>
    );
  },
});
