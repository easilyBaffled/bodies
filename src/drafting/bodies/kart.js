import { toDictById, withTypesForIds } from "./utils";
import { attr, affect, attribute, events, condition, opp, MAXLENGTH } from "./primatives";
import { Attr } from './attr';

const adder = x => 0.250 * x - 0.250;
const mult = x => -0.00417 * x + 0.0125;
const evalAngle = ( attr, angle ) => mult( attr ) * angle + adder( attr );

const roundTo = ( number, decimals ) => Number( number.toFixed( decimals ) );

/** @type {Body} */
export class Kart {
    static evaluateSegment( kart, seg ) {
        const speed = Attr.get( kart, attr.MAX_SPEED );
        const handling = Attr.get( kart, attr.HANDLING );
        const length = roundTo( Attr.get( seg, attr.LENGTH ) ) / 100;
        const angle = Attr.get( seg, attr.ANGLE );


        // const speedVal = roundTo( evalAngle( speed, angle ), 2 );
        // const handlingVal = roundTo( evalAngle( handling, angle ), 2 );


        if ( speed > handling ) {
        	const lengthEval = ( length / MAXLENGTH ) / 2; // the halving is because the angle should be more important than length
            const angleEval = evalAngle( speed, angle ) + angle === 180 ? 5 : 0;

            return angleEval + lengthEval;
        } else {
            const lengthEval = ( 1 - ( length / MAXLENGTH ) ) / 2;
            const angleEval =  evalAngle( 5 - handling, angle ); // evalAngle was written for karts with greater speed, so it has to be inverted for speedsters
            return angleEval + lengthEval;
        }

        /**
		 * If a kart has better handling than speed then it's going to prefer short tracks and large turns
		 * If a kart has better speed than handling it's going to prefer a long track with smaller turns
		 */

        // return { handlingVal, length, speedVal };


    }

    static create({ speed, handling, accel, name }) {
        return {
        	accel,
            attributes: toDictById(
                withTypesForIds(
                    attribute({ type: attr.SPEED, value: 0  }),
                    attribute({ type: attr.MAX_SPEED, value: speed  }),
                    attribute({ type: attr.HANDLING, value: handling  }),
                    attribute({ type: attr.ACCEL, value: accel  }),
                    attribute({ type: attr.POSITION, value: 0  })
                )
            ),
            events: {
                [ events.TICK ]: {
                    actions: [ affect.ACCEL, affect.MOVE, "normalize-speed" ],
                    id:      4,
                    type:    events.TICK
                }
            },
            handling,
            holding:         toDictById(),
            id:              name,
            maxSpeed:        speed,
            name,
            speed:           0,
            standardAffects: toDictById(
                withTypesForIds(
                    {
                        condition: condition.lessThan(
                            { attribute: attr.SPEED },
                            {
                                attribute: attr.SPEED,
                                property:  "maxValue"
                            }
                        ),
                        func:            "add",
                        targetAttribute: attr.SPEED,
                        type:            affect.ACCEL,
                        value:           1
                    },
                    {
                        condition: condition.greaterThan(
                            { attribute: attr.SPEED },
                            {
                                attribute: attr.SPEED,
                                property:  "maxValue"
                            }
                        ),
                        func:            "reduce",
                        targetAttribute: attr.SPEED,
                        type:            affect.NORM,
                        value:           1
                    },
                    {
                        func:            "add",
                        targetAttribute: attr.POSITION,
                        type:            affect.MOVE,
                        value:           { attribute: attr.SPEED }
                    }
                )
            ),
            temporaryAffects: toDictById()
        };
    }
}
