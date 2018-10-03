import { LOCAL_STORAGE_KEY } from '../constants';

export const isGridVisible = state => state[LOCAL_STORAGE_KEY];

export const getGridOptions = state => state.options;
