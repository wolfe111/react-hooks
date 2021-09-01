// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  // const storageName = window.localStorage.getItem('name')
  // const [name, setName] = React.useState(storageName || initialName)
  console.log('Rendering')


  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  // React.useEffect(() => {
  //   window.localStorage.setItem('name', name)
  // }, [name])

  const [name, setName] = useLocalStorageState2('name', initialName) 

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App;

// my attempt to save whatever into local state (not sure if it actually works)
export function useLocalStorageState(key, defaultValue) {
  const [value, setValue] = React.useState(() => {
    console.log('only ran once');
    const localStorageValue = window.localStorage.getItem(key)
    return (localStorageValue && JSON.parse(localStorageValue).value) || defaultValue;
  })

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify({value}))
  }, [value, key])

  return [value, setValue];
}

// enables you to save whatever into local state
export function useLocalStorageState2(
  key, 
  defaultValue = '', 
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse
} = {}) {
  const [value, setValue] = React.useState(() => {
    const localStorageValue = window.localStorage.getItem(key)
    if(localStorageValue) {
      return deserialize(localStorageValue);
    } 
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  // this gives an object that can be mutated that doesnt cause rerenders 
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
