// useRef and useEffect: DOM interaction
// http://localhost:3000/isolated/exercise/05-classes.js

import React, { useEffect } from 'react'
import VanillaTilt from 'vanilla-tilt'

// If you'd rather practice refactoring a class component to a function
// component with hooks, then go ahead and do this exercise.

function Tilt(props) {
  const tiltRef = React.useRef()

  useEffect(()=> {
    const tiltNode = tiltRef.current
    const vanillaTiltOptions = {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    }
    VanillaTilt.init(tiltNode, vanillaTiltOptions)

    return () => tiltNode.vanillaTilt.destroy()
  }, [])

  return (
    <div ref={tiltRef} className="tilt-root">
      <div className="tilt-child">{props.children}</div>
    </div>
  )
}

class TiltClass extends React.Component {
  tiltRef = React.createRef()
  componentDidMount() {
    const tiltNode = this.tiltRef.current
    const vanillaTiltOptions = {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    }
    VanillaTilt.init(tiltNode, vanillaTiltOptions)
  }
  componentWillUnmount() {
    this.tiltRef.current.vanillaTilt.destroy()
  }
  render() {
    return (
      <div ref={this.tiltRef} className="tilt-root">
        <div className="tilt-child">{this.props.children}</div>
      </div>
    )
  }
}

function App() {
  return (
    <>
      <Tilt>
        <div className="totally-centered">vanilla-tilt.js</div>
      </Tilt>
      <TiltClass>
        <div className="totally-centered">vanilla-tilt.js</div>
      </TiltClass>
    </>
  )
}

export default App
