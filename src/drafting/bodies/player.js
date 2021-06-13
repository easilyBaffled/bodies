import { Attr } from '../bodies/attr';
import { toDictById, withTypesForIds } from "./utils";
import { attr, attribute } from "./primatives";
import { Kart } from "./kart";

export class Player {
    static create({ name, isABot = true }) {
        return {
            attributes: toDictById(
                withTypesForIds(
                    attribute({ type: attr.IS_A_BOT, value: isABot  }),
                    attribute({ type: attr.CARDS, value: []  }),
                    attribute({ type: attr.KART, value: null  })
                )
            ),
            [ attr.LAPS ]:      0,
            events:           {},
            holding:          {},
            id:               name,
            name,
            standardAffects:  {},
            temporaryAffects: toDictById()
        };
    }
    static getPreferedCard( player, cards ) {
    	const kart = Attr.get( player, attr.KART );

        return cards.slice().sort(
            ( a, b ) => Kart.evaluateSegment( kart, a ) - Kart.evaluateSegment( kart, b )
        )[ 0 ];

    }
}
