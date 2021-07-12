import React, { Component } from 'react';

class Cell extends Component {
  render () {
    let content = null

    if (this.props.status === 'covered') {
      content = 'C'
    } else if (this.props.status === 'flagged') {
      content = 'F'
    } else if (this.props.status === 'hasBomb') {
      content = 'B'
    } else {
      content = this.props.value
    }

    return (
      <div
        className="cell"
        onContextMenu={ (e) => e.preventDefault() }
        onMouseDown={
          (e) => {
            this.props.onClick(e.buttons)
          }
        }
      >
        {content}
      </div>
    )
  }
}


export default Cell;
