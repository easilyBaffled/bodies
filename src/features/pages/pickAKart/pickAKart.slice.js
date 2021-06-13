import { createSlice } from '@reduxjs/toolkit';
import { Kart } from "../../../drafting/bodies/kart";
import { toDictById } from "../../../drafting/bodies/utils";

const getNextKey = ( obj, id ) => {
    const list = Object.keys( obj );
    const i = list.indexOf( id ) + 1;
    return list[ ( i === list.length ) ? 0 : i ];
};

const initialState = {
    availableKarts: toDictById([
        {
            accel:    4,
            handling: 5,
            name:     "Bug",
            speed:    2.25
        },
        {
            accel:    4,
            handling: 4.5,
            name:     "Dart",
            speed:    2.75
        },
        {
            accel:    3.75,
            handling: 3.75,
            name:     "Balanced",
            speed:    3.5
        },
        // {
        //     accel:    3.25,
        //     handling: 3.25,
        //     name:     "Rosalina",
        //     speed:    4
        // },
        {
            accel:    3.25,
            handling: 3,
            name:     "Speedster",
            speed:    4.5
        },
        {
            accel:    3,
            handling: 2.5,
            name:     "Power House",
            speed:    4.75
        }
    ].map( k =>
        Kart.create( k )
    ) )
};

const pickAKartSlice = createSlice({
    initialState,
    name:     'pickAKartSlice',
    reducers: {
    	pickAKart( s, { payload: kart }) {
            delete s.availableKarts[ kart.id ];
        }
    }
});

export const { pickAKart } = pickAKartSlice.actions;


export default pickAKartSlice.reducer;
