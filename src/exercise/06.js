// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useEffect, useState} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [infoState, setInfoState] = useState({
    pokemon: null,
    status: 'idle',
    error: null,
  })

  // const handleError = React.useErrorHandler()

  // const [pokemon, setPokemon] = useState(null)
  // const [error, setError] = useState(null)
  // const [status, setStatus] = useState('idle')
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!

  useEffect(() => {
    if (pokemonName) {
      setInfoState({status: 'pending', error: null})
      fetchPokemon(pokemonName).then(
        pokemonData => setInfoState({pokemon: pokemonData, status: 'resolved'}),
        error => setInfoState({status: 'rejected', error}),
      )
    }
  }, [pokemonName])

  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, make sure to update the loading state
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => { /* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  // 💣 remove this
  if (infoState.status === 'idle') {
    return 'Submit a pokemon'
  } else if (infoState.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (infoState.status === 'rejected') {
    throw infoState.error
    // handleError(infoState.error)
    // return (
    //   <div role="alert">
    //     There was an error:{' '}
    //     <pre style={{whiteSpace: 'normal'}}>{infoState.error?.message}</pre>
    //   </div>
    // )
  } else if (infoState.status === 'resolved') {
    return <PokemonDataView pokemon={infoState?.pokemon} />
  }

  throw new Error('This should be impossible')

  // if (error) {
  //   return (
  //     <div role="alert">
  //       There was an error:{' '}
  //       <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
  //     </div>
  //   )
  // }

  // return pokemon ? (
  //   <PokemonDataView pokemon={pokemon} />
  // ) : (
  //   <PokemonInfoFallback name={pokemonName} />
  // )
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error?.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          resetKeys={[pokemonName]}
          FallbackComponent={ErrorFallback}
          onReset={() => setPokemonName('')}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
