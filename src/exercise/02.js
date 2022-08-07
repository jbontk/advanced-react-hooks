// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
    fetchPokemon,
    PokemonForm,
    PokemonDataView,
    PokemonInfoFallback,
    PokemonErrorBoundary,
} from '../pokemon'

function asyncReducer(state, action) {
    switch (action.type) {
        case 'pending': {
            return {status: 'pending', data: null, error: null}
        }
        case 'resolved': {
            return {status: 'resolved', data: action.data, error: null}
        }
        case 'rejected': {
            return {status: 'rejected', data: null, error: action.error}
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

function useSafeDispatch(dispatch) {
    const mountedRef = React.useRef(false);

    React.useLayoutEffect(() => {
        mountedRef.current = true;

        // useLayoutEffect:
        // it is called as soon as we are mounted (does not wait for the browser to paint the screen),
        // and ensures that the cleanup is called as soon as we are unmounted w/o waiting for anything either
        return () => {
            console.log('Unmounting useSafeDispatch');
            mountedRef.current = false;
        }
    }, []);

    return React.useCallback((...args) => {
        if (mountedRef.current) {
            dispatch(...args);
        } else {
            console.log('Not dispatching because unmounting useSafeDispatch');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

function useAsync(initialState) {
    const [state, unsafeDispatch] = React.useReducer(asyncReducer, initialState);

    const dispatch = useSafeDispatch(unsafeDispatch);

    const run = React.useCallback((promise) => {
        if (!promise) return;

        dispatch({type: 'pending'});
        promise.then(
            data => {
                console.log('Data resolved', data)
                dispatch({type: 'resolved', data})
            },
            error => {
                dispatch({type: 'rejected', error})
            },
        );
    }, [dispatch]);

    return {...state, run};
}

function PokemonInfo({pokemonName}) {
    const {data: pokemon, status, error, run} = useAsync({status: pokemonName ? 'pending' : 'idle'});

    React.useEffect(() => {
        if (!pokemonName) return;

        const pokemonPromise = fetchPokemon(pokemonName);
        run(pokemonPromise);
    }, [pokemonName, run]);

    switch (status) {
        case 'idle':
            return <span>Submit a pokemon</span>
        case 'pending':
            return <PokemonInfoFallback name={pokemonName}/>
        case 'rejected':
            throw error
        case 'resolved':
            return <PokemonDataView pokemon={pokemon}/>
        default:
            throw new Error('This should be impossible')
    }
}

function App() {
    const [pokemonName, setPokemonName] = React.useState('')

    function handleSubmit(newPokemonName) {
        setPokemonName(newPokemonName)
    }

    function handleReset() {
        setPokemonName('')
    }

    return (
        <div className="pokemon-info-app">
            <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit}/>
            <hr/>
            <div className="pokemon-info">
                <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
                    <PokemonInfo pokemonName={pokemonName}/>
                </PokemonErrorBoundary>
            </div>
        </div>
    )
}

function AppWithUnmountCheckbox() {
    const [mountApp, setMountApp] = React.useState(true)
    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={mountApp}
                    onChange={e => setMountApp(e.target.checked)}
                />{' '}
                Mount Component
            </label>
            <hr/>
            {mountApp ? <App/> : null}
        </div>
    )
}

export default AppWithUnmountCheckbox
