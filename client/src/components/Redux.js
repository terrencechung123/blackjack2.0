import { createStore, combineReducers } from 'redux';

const initialState = { 
    counter: 0,
};

const counterReducer = (state = initialState)