import kindOf from "kind-of";
import { match } from "../utils";
import { affectTargets, time } from "./primatives";
import { findAttributeByNodeType } from "./utils";

export class Effect {
    static add( target, value ) {
        return match(
            {
                array:   () => target.concat( value ),
                default: () => target + value,
                object:  () => {
                    if ( !( 'id' in value ) ) {
                        throw new Error(
                            `${JSON.stringify( value, null, 2 )} must have an id`
                        );
                    }
                    return Object.assign( target, { [ value.id ]: value });
                }
            },
            kindOf( target )
        );
    }

    static reduce( target, value ) {
    	return target - value;
    }

    static noop( target ) {
    	return target;
    }

    static set( target, value ) {
    	return value;
    }

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
        return t => Effect[ func ]( t, value );
    }
}
