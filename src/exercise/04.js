// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React from 'react'
import {useLocalStorageState} from '../utils'

function Board({onClick, squares}) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status here */}
      {/* <div className="status">{status}</div> */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      {/* <button className="restart" onClick={restart}>
        restart
      </button>
      <button className="restart" onClick={pause}>
        pause
      </button> */}
    </div>
  )
}

function Move({number, isCurrent, onClick}) {
  return (
    <li>
      <button disabled={isCurrent} onClick={() => onClick(number)}>{number !== 0 ? `Go to move ${number}` : `Go to game start`} {isCurrent && `(current)`}</button>
    </li>
  )
}

function Game() {
  const [currentMove, setCurrentMove] = useLocalStorageState('currentMove', 0)
  const [history, setHistory] = useLocalStorageState('history', [Array(9).fill(null)])

  const currentSquares = history[currentMove]

  const nextValue = calculateNextValue(currentSquares)
  // - winner ('X', 'O', or null)
  const winner = calculateWinner(currentSquares)
  // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return
    }
    const newSquares  = [...currentSquares]
    newSquares[square] = nextValue

    const newHistory = [...history.slice(0, currentMove + 1), newSquares]
    setCurrentMove(history.length)

    setHistory(newHistory)
  }

  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrentMove(0)
  }

  // function pause() {
  //   // 🐨 set the squares to `Array(9).fill(null)`
  //   // setSquares(Array(9).fill(null))
  //   setSquares(Array(9).fill(null))
  // }

  function onMoveClick(moveNumber) {
    setCurrentMove(moveNumber)
  }

  function createMoves() {
    return (
      <ol>
        {history.map((move, i) => <Move key={i} number={i} isCurrent={currentMove === i} onClick={(j) => onMoveClick(j)} />)}
      </ol>
    )
  }

  const moves = createMoves()


  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={(i) => selectSquare(i)} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  debugger
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
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
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export function useLocalStorageStateMyVersion(
  key, 
  defaultValue, 
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse
} = {}) {
  const [value, setValue] = React.useState(() => {
    return  deserialize(window.localStorage.getItem(key)) || defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current

    if(prevKey !== key) {
      window.localStorage.remove(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(value))
  }, [value, key, serialize])

  return [value, setValue];
}

export default App
