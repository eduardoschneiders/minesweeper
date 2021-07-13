import { Component } from 'react';
import './Cell.css'

class Cell extends Component {
  render () {
    let content = null

    if (this.props.status === 'covered') {

    } else if (this.props.status === 'flagged') {
      content = '🚩'
    } else if (this.props.status === 'hasBomb') {
      content = '💣'
    } else {
      if (this.props.value !== 0) { content = this.props.value }
    }

    return (
      <div
        className={'cell ' + this.props.status}
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
