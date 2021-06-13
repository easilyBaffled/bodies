import { createSlice } from '@reduxjs/toolkit';
export const deltaTime = 0.167;

const initialState = {
    trackLenMapping:    {},
    trackPath:       ''
};

const raceSlice = createSlice({

    initialState,
    name:     'buildSlice',
    reducers: {
        tick( s, { payload }) {}
    }
});

export const { tick } = raceSlice.actions;
export const actions =  raceSlice.actions;

export default raceSlice.reducer;
