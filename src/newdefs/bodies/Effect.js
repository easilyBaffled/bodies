import kindOf from "kind-of";
import { match } from "../utils";
import { time, affectTargets } from "./primatives";
import { findAttributeByNodeType } from "./utils";

export class Effect {
    static tickDown( affect ) {
        if ( "duration" in affect ) affect.duration -= time.TICK;
        if ( affect.duration <= 0 ) {
            affect.dead = true;
            affect.func = "noop";
        }
    }

    static getAffectTargetAttribute( body, affect ) {
        return body.attributes[ affect.targetAttribute ];
    }

    static getEffectTargetBody( affect, targetDef ) {
        return targetDef[ affect.targetBody ?? affectTargets.SELF ];
    }

    static getAffectTargetId( body, affect ) {
        return findAttributeByNodeType( body, affect.targetAttribute );
    }

    static getAffectFunc( affect ) {
        const { func, value } = affect;
        return {
            add: ( target ) =>
                match(
                    {
                        array:   () => target.concat( value ),
                        default: () => target + value,
                        object:  () => {
                            if ( !( value.id in value ) ) {
                                throw new Error(
                                    `${JSON.stringify( value, null, 2 )} must have an id`
                                );
                            }
                            return Object.assign( target, { [ value.id ]: value });
                        }
                    },
                    kindOf( target )
                ),
            concat: ( arr ) => arr.concat( value ),
            emit:   () => {},
            noop:   ( v ) => v,
            reduce: ( v ) => v - value,
            set:    () => value
        }[ func ];
    }
}
