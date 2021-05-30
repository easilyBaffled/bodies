import produce from "immer";
import { toDictById, withTypesForIds } from "../utils";
import { attr, affectTargets, events } from "./primatives";

const getEffectTarget = ( affect, targets ) =>
    targets[ affect?.targetBody ?? affectTargets.SELF ];

export class FlatWorld {
    static create( segmentTemplate, rest ) {
        return {
            ...rest,
            board:            Array.from({ length: 10 }, ( __, i ) => segmentTemplate( i ) ),
            temporaryAffects: {}
        };
    }
    static addBody( world, body ) {
        return produce( world, ( w ) => {
            w.attributes[ attr.BODIES ].value[ body.id ] = body;
        });
    }

    static addBodies( world, ...bodies ) {
        return produce( world, ( w ) => {
            bodies.forEach(
                ( body ) => ( w.attributes[ attr.BODIES ].value[ body.id ] = body )
            );
        });
    }
    static getBody( world, id ) {
        return world.attributes[ attr.BODIES ].value[ id ];
    }
    static getSegment( world, index ) {
        return world.attributes[ attr.LEVEL ].value[ index ];
    }
    static isSamePosition( a, b ) {
        return a === b;
    }
    static dispatch( world, event ) {
        const { type, payload } = event;
        const actors = {
            use_item: ( w, { itemId, sourceId }) => {
                const sourceBody = w.attributes[ attr.BODIES ].value[ sourceId ];
                const item = sourceBody.holding[ itemId ];

                const itemEffectIds = item.events[ events.USE ].actions;
                itemEffectIds.forEach( ( id ) => {
                    const effect = item.standardAffects[ id ];
                    const effectTarget = getEffectTarget( effect, {
                        [ affectTargets.SELF ]:   item,
                        [ affectTargets.HOLDER ]: sourceBody,
                        [ affectTargets.WORLD ]:  world
                    });

                    effectTarget.temporaryAffects[ effect.id ] = {
                        duration:   1,
                        ...effect,
                        targetBody: affectTargets.SELF
                    };
                });

                delete sourceBody.holding[ itemId ];
            }
        };

        return produce( world, ( w ) => actors[ type ]( w, payload ) );
    }
}

const createSegment = ( speed ) => ({
    attributes: toDictById(
        withTypesForIds({ maxValue: 5, type: attr.SPEED, value: speed })
    )
});

export const flatWorld = {
    attributes: toDictById(
        withTypesForIds(
            {
                type:  attr.BODIES,
                value: {}
            },
            {
                type:  attr.LEVEL,
                value: Array.from({ length: 10 }, ( __, i ) => createSegment( i ) )
            }
        )
    ),
    events: toDictById(
        withTypesForIds(
            {
                actions: [ 3 ],
                type:    events.TICK
            },
            {
                actions: [ "stun", "selfDestruct" ],
                type:    events.COLLISION
            },
            {
                actions: [ "create" ],
                type:    events.USE
            }
        )
    ),
    id:              "flatWorld",
    name:            "Flat World",
    standardAffects: toDictById(
        withTypesForIds({
            func:            "emit",
            targetAttribute: attr.BODIES,
            type:            "emit",
            value:           events.TICK
        })
    ),
    temporaryAffects: {}
};
