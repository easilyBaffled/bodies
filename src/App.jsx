import React, { useEffect } from "react";
import "./App.scss";
import Avatar from "boring-avatars";

import { connect } from "react-redux";
import { Segment } from "./drafting/bodies/segment";
import PickAKart from "./features/pages/pickAKart/PickAKart";
import Draft from "./features/pages/draft/Draft";
import Build from "./features/pages/build/Build";
import Race from "./features/pages/race/Race";
import { pages, progressPage } from "./features/game/game.slice";
import { CardList } from "./app/CardList";
import { attr } from "./drafting/bodies/primatives";
// const curves = [
//     {
//         a:    0,
//         path: "q 500 300 500 50"
//     },
//     {
//         a:    21.801409486351787,
//         path: "q 500 300 600 50"
//     },
//     {
//         a:    45,
//         path: "q 500 300 700 100"
//     },
//     {
//         a:    59.03624346792648,
//         path: "q 500 300 750 150"
//     },
//     {
//         a:    71.56505117707799,
//         path: "q 500 300 800 200"
//     },
//     {
//         a:    74.05460409907712,
//         path: "q 500 300 850 200"
//     },
//     {
//         a:    81.869897645844,
//         path: "q 500 300 850 250"
//     },
//     {
//         a:    82.87498365109819,
//         path: "q 500 300 900 250"
//     },
//     {
//         a:    90,
//         path: "q 500 300 900 300"
//     },
//     {
//         a:    97.12501634890178,
//         path: "q 500 300 900 350"
//     },
//     {
//         a:    104.03624346792648,
//         path: "q 500 300 900 400"
//     },
//     {
//         a:    101.30993247402019,
//         path: "q 500 300 1000 400"
//     }
// ];
//
// const segs = curves.map( ({ a, path }) => Segment.create( path, a ) );
//
// const table = karts.map(
// 	(  kart ) => [
// 		kart,
// 		segs.reduce(
// 			( row, s ) => {
// 				s.attributes.ANGLE.value = s.name
// 				return row.concat({ angle: s.attributes.ANGLE.value.toFixed(), value: Kart.evaluateSegment( kart, s ) })
// 			}, []
// 		)
// 	]
// );
//
// table.forEach(
// 	([ n, t ]) => {
// 		console.log(n.name,{ handling:  n.attributes.handling.value, speed: n.attributes.speed.value }, n.attributes.handling.value > n.attributes.speed.value? 'Should have high handling score' : 'Should have high speed score' )
// 		console.table(t)
// 	}
// )

const GameOver = ({ winner }) => (
    <>
        <h1>{winner.name} Won!</h1>
        <p>Thank you so much for playing!</p>
        <button>Play Again</button>
    </>
);

const ConnectedGameOver = connect( ( s ) => s.game, { progressPage });

/* eslint-disable sort-keys-fix/sort-keys-fix */
const pageComponents = {
    [ pages.PICKAKART ]:   PickAKart,
    [ pages.DRAFT ]:       Draft,
    [ pages.BUILDATRACK ]: Build,
    [ pages.RACE ]:        Race,
    [ pages.GAMEOVER ]:    ConnectedGameOver
};
/* eslint-enable sort-keys-fix/sort-keys-fix */
// const nums = [ 0, 10, 12, 14, 16 ];
//
// const availableCards = nums.flatMap( x =>
//     nums.map( y => {
//         const endPoint = { x, y };
//         const controlPoint = y === 0 ? { x: x / 2, y } : { x, y: 0 };
//         return Segment.create(
//             { controlPoint, endPoint },
//             `${x} ${y}`
//         );
//     })
// ).filter( c => !Number.isNaN( c.attributes[ attr.ANGLE ].value ) );

// const availableCards = Array( 10 )
//     .fill( Array( 10 ).fill( 0 ) )
//     .flatMap( ( row, x ) => {
//         return row.map( ( __, y ) => {
//             const pos = { x: ( x ), y: ( y )  };
//             return Segment.create(
//                 { controlPoint: { x, y: 0 }, endPoint: pos },
//                 `${x} ${y}`
//             );
//         });
//     });

function App({ game }) {
    const Page = pageComponents[ game.currentPage ];
    // const [ cards, setCards ] = React.useState( availableCards );
    //
    // useEffect(
    //     () => {
    //         const res = cards.map(
    //             c => c.attributes[ attr.PATHSTR ].value
    //         );
    //         console.log( res );
    //     },
    // 	[ cards ]
    // );

    return (
        <div className="App">
            {/* <CardList*/}
            {/*    cards={cards}*/}
            {/*    clickHandler={( card ) =>*/}
            {/*        setCards( ( cardList ) => cardList.filter( ( c ) => c.id !== card.id ) )*/}
            {/*    }*/}
            {/* />*/}
            {game.currentPage !== pages.RACE &&
			game.currentPage !== pages.GAMEOVER ? (
                    <>
                        <h3 className="header"> Current Pick:
                            <Avatar
                                size={50}
                                name={game.players[ game.activePlayerId ].name}
                                variant="beam"
                            />
                        </h3>
                        <h3 className="header">
						Turn Order:{" "}
                            {game.turnOrder.map( ( name ) => (
                                <>
                            	<Avatar size={25} name={name} variant="beam" />
                                </>
                            ) )}
                        </h3>
                    </>
                ) : (
                    ""
                )}
            <Page></Page>
        </div>
    );
}

export default connect( ( s ) => s )( App );
