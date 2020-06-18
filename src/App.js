import React from 'react';
import './App.css';
import TodoComponent from './components/todoComponent';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import UserAccountReducer from './store/reducers/userAccountReducer';
// import {initStore} from './stores';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const rootReducer = combineReducers({
  userAccountReducer: UserAccountReducer
});


const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <TodoComponent />
      </div>
    </Provider>

  );
}

export default App;
