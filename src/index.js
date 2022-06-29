import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] }
    }
  }
  return null
}

function Square(props) {
  return (
    <button
      className={'square ' + (props.isWinning ? 'square--winning' : null)}
      onClick={() => {
        // 避免 this 造成的困扰，使用箭头函数
        props.onClick()
      }}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square isWinning={this.props.winningSquares.includes(i)} key={'square ' + i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
  }

  render() {
    const winner = calculateWinner(this.props.squares)
    let status
    if (winner) {
      status = 'Winner: ' + winner
    } else {
      status = 'Next player: ' + (this.props.xIsNext ? 'X' : 'O')
    }

    return (
      <div>
        {[0, 1, 2].map((i) => {
          return (
            <div className="board-row" key={i}>
              {[0, 1, 2].map((j) => {
                return this.renderSquare(i * 3 + j)
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props) // 定义子类的构造函数时，都需要调用 super 方法，必须以此为开头。
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      coordinate: [],
      stepNumber: 0,
      xIsNext: true,
      isDescending: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({ history: history.concat([{ squares: squares }]), coordinate: [...this.state.coordinate, i], stepNumber: history.length, xIsNext: !this.state.xIsNext })
  }

  jumpTo(step) {
    this.setState({ history: this.state.history.slice(0, step + 1), stepNumber: step, xIsNext: step % 2 === 0 })
  }

  sortHistory() {
    this.setState({
      isDescending: !this.state.isDescending,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start'
      return (
        <li key={move} className={this.state.stepNumber === move ? 'active' : null}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          {move !== 0 ? (
            <strong className="location">
              [{Math.floor(this.state.coordinate[move - 1] / 3) + 1}, {(this.state.coordinate[move - 1] % 3) + 1}]
            </strong>
          ) : (
            ''
          )}
        </li>
      )
    })

    let status
    if (winner) {
      status = 'Winner: ' + winner.player
    } else if (!current.squares.includes(null)) {
      status = 'No One Wins'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board winningSquares={winner ? winner.line : []} squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
          <button onClick={() => this.sortHistory()}>Sort by: {this.state.isDescending ? 'Descending' : 'Asending'}</button>
        </div>
      </div>
    )
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Game />)
