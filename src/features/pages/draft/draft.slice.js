import { createSlice } from '@reduxjs/toolkit';
import { Segment } from "../../../drafting/bodies/segment";
import { toDictById } from "../../../drafting/bodies/utils";

const getNextKey = ( obj, id ) => {
    const list = Object.keys( obj );
    const i = list.indexOf( id ) + 1;
    return list[ ( i === list.length ) ? 0 : i ];
};
//
// const availableCards = Array( 10 ).fill( Array( 10 ).fill( 0 ) )
//     .flatMap(
//         ( row, x ) => {
//             return row.map( ( __, y ) => {
//                 const pos = { x: x * 2, y: y * 2};
//                 return Segment.create({ controlPoint: { x, y: 0 }, endPoint: pos }, `${x} ${y}` );
//             });
//         }
//     );

const availableCards = [
    // "m 0 0 q 0 2 0 3",
    // "m 0 0 q 0 2 0 4",
    // "m 0 0 q 0 2 0 5",
    // "m 0 0 q 0 2 0 6",
    // "m 0 0 q 0 2 0 7",
    // "m 0 0 q 0 2 0 8",
    // "m 0 0 q 0 2 0 9",
    "m 0 0 q 2 0 2 2",
    "m 0 0 q 2 0 2 3",
    "m 0 0 q 2 0 2 4",
    "m 0 0 q 2 0 2 5",
    "m 0 0 q 2 0 2 6",
    "m 0 0 q 2 0 3 0",
    "m 0 0 q 3 0 3 2",
    "m 0 0 q 3 0 3 3",
    "m 0 0 q 3 0 3 4",
    "m 0 0 q 3 0 3 5",
    "m 0 0 q 3 0 3 6",
    "m 0 0 q 3 0 3 7",
    "m 0 0 q 3 0 3 8",
    "m 0 0 q 3 0 3 9",
    "m 0 0 q 2 0 4 0",
    "m 0 0 q 4 0 4 2",
    "m 0 0 q 4 0 4 3",
    "m 0 0 q 4 0 4 4",
    "m 0 0 q 4 0 4 5",
    "m 0 0 q 4 0 4 6",
    "m 0 0 q 4 0 4 7",
    "m 0 0 q 4 0 4 8",
    "m 0 0 q 4 0 4 9",
    "m 0 0 q 2 0 5 0",
    "m 0 0 q 5 0 5 3",
    "m 0 0 q 5 0 5 4",
    "m 0 0 q 5 0 5 5",
    "m 0 0 q 5 0 5 6",
    "m 0 0 q 5 0 5 7",
    "m 0 0 q 5 0 5 8",
    "m 0 0 q 5 0 5 9",
    "m 0 0 q 3 0 6 0",
    "m 0 0 q 6 0 6 4",
    "m 0 0 q 6 0 6 5",
    "m 0 0 q 6 0 6 6",
    "m 0 0 q 6 0 6 7",
    "m 0 0 q 6 0 6 8",
    "m 0 0 q 6 0 6 9",
    "m 0 0 q 5 0 10 0",
    "m 0 0 q 10 0 10 10",
    "m 0 0 q 10 0 10 12",
    "m 0 0 q 10 0 10 14",
    "m 0 0 q 10 0 10 16",
    "m 0 0 q 6 0 12 0",
    "m 0 0 q 12 0 12 10",
    "m 0 0 q 12 0 12 12",
    "m 0 0 q 12 0 12 14",
    "m 0 0 q 12 0 12 16",
    "m 0 0 q 7 0 14 0",
    "m 0 0 q 14 0 14 10",
    "m 0 0 q 14 0 14 12",
    "m 0 0 q 14 0 14 14",
    "m 0 0 q 14 0 14 16",
    "m 0 0 q 8 0 16 0",
    "m 0 0 q 16 0 16 10",
    "m 0 0 q 16 0 16 12",
    "m 0 0 q 16 0 16 14",
    "m 0 0 q 16 0 16 16"
].map(
    path => Segment.create( path, path )
).sort( () => 0.5 - Math.random() );

const initialState = {
    availableCards,
    showingCards:   availableCards.splice( 0, 5 )
};

const draftSlice = createSlice({
    initialState,
    name:     'draftSlice',
    reducers: {
        pickACard( s, { payload }) {
        	const { card } = payload;
            const i = s.showingCards.findIndex( c => c.id === card.id );
            s.showingCards.splice( i, 1 );
            if ( s.showingCards.length === 1 )
                s.showingCards = s.availableCards.splice( 0, 5 );

        }
    }
});

export const { pickACard } = draftSlice.actions;
export const actions =  draftSlice.actions;

export default draftSlice.reducer;
