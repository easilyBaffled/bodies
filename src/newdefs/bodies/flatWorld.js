import { flow } from 'lodash';
import produce, { current } from "immer";
import { isId, not, isDead } from "../utils";
import { attr, affectTargets, events } from "./primatives";
import { Effect } from "./Effect";
import { Attr } from "./Attr";
import { Body } from "./Body";

const toDict =
	( propType ) =>
	    ( ...arr ) =>
	        arr.flat().reduce( ( acc, o ) => Object.assign( acc, { [ o[ propType ] ]: o }), {});

const toDictById = toDict( "id" );

const withTypesForIds = ( ...objs ) => objs.map( typeToId );

const typeToId = ( obj ) =>
    obj.id ? obj : Object.assign({}, obj, { id: obj.type });

const getEffectTarget = ( affect, targets ) =>
    targets[ affect?.targetBody ?? affectTargets.SELF ];

export class FlatWorld {
    static tick( world ) {
        return produce( world, immerWorld => {
            // Apply temporary Effects
            Object.values( immerWorld.temporaryAffects ).forEach( ( affect ) => {
                Body.applyEffect(
                    affect,
                    {
                        [ affectTargets.SELF ]: immerWorld
                    },
                    immerWorld
                );

                if ( affect.dead ) delete immerWorld.temporaryAffects[ affect.id ];
            });

            // Apply Effects
            Body.getEventAffects( immerWorld, events.TICK ).forEach( ( affect ) => {
                Body.applyEffect(
                    affect,
                    {
                        ...Attr.get( immerWorld, attr.BODIES ).reduce(
                            ( acc, b ) => Object.assign( acc, { [ b.id ]: b }),
                            {}
                        ),
                        [ affectTargets.ALL ]:  Attr.get( immerWorld, attr.BODIES ),
                        [ affectTargets.SELF ]: immerWorld
                    },
                    immerWorld
                );
            });

            // Updates Bodies
            FlatWorld.getBodies( immerWorld ).forEach( body => {
                const collidingBodies = FlatWorld.getBodiesAtPostion(
                    immerWorld,
                    Body.getPosition( body )
                ).filter( not( isId( body.id ) ) );

                collidingBodies.forEach( ( cB ) => {
                    Body.getEventAffects( cB, events.COLLISION ).forEach( ( affect ) => {
                        Body.applyEffect(
                            affect,
                            {
                                [ affectTargets.SELF ]:     cB,
                                [ affectTargets.COLLIDER ]: body
                            },
                            immerWorld
                        );
                    });
                    FlatWorld.removeDeadBody( immerWorld, cB );
                });

                Object.values( body.temporaryAffects ).forEach( ( affect ) => {
                    Body.applyEffect(
                        affect,
                        {
                            [ affectTargets.SELF ]: body
                        },
                        immerWorld
                    );

                    if ( affect.dead ) delete body.temporaryAffects[ affect.id ];
                });

                Body.getEventAffects( body, events.TICK ).forEach( ( affect ) => {
                    Body.applyEffect(
                        affect,
                        {
                            [ affectTargets.SELF ]: body
                        },
                        immerWorld
                    );
                });

                FlatWorld.removeDeadBody( immerWorld, body );
            });
        });

    }

    static removeDeadBody( world, body ) {
        if ( isDead( body ) ) delete world.attributes[ attr.BODIES ].value[ body.id ];
    }

    static getBodiesAtPostion( world, position ) {
        return FlatWorld.getBodies( world ).filter( ( body ) =>
            FlatWorld.isSamePosition( Body.getPosition( body ), position )
        );
    }

    static create( segmentTemplate, rest ) {
        return {
            ...rest,
            board:            Array.from({ length: 10 }, ( __, i ) => segmentTemplate( i ) ),
            temporaryAffects: {}
        };
    }
    static addBody( world, body ) {
        return produce( world, ( w ) => {
            flow(
                ( _ ) => Attr.get( _, attr.BODIES ),
                _ => Effect.add( _, body )
            )( w );
        });
    }

    static addBodies( world, ...bodies ) {
        return produce( world, ( w ) => {
            bodies.forEach(
                ( body ) => {
                    flow(
                        ( _ ) => Attr.get( _, attr.BODIES ),
                        _ => Effect.add( _, body )
                    )( w );
                }
            );
        });
    }
    static getBody( world, id ) {
        return Attr.get( world, attr.BODIES, id );
    }

    static getBodies( world ) {
        return Object.values( Attr.get( world, attr.BODIES ) );
    }

    static getSegment( world, index ) {
        return Attr.get( world, attr.LEVEL, index );
        // return world.attributes[ attr.LEVEL ].value[ index ];
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
                        [ affectTargets.WORLD ]:  w
                    });

                    if ( effect.type === events.SPAWN )
                        item.attributes[ attr.POSITION ].value = Body.getPosition( sourceBody, effect.placement );


                    effectTarget.temporaryAffects[ effect.id ] = {
                        duration:   1,
                        ...effect,
                        targetBody: affectTargets.SELF,
                        value:      effect.value === affectTargets.SELF ? item : effect.value
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
                actions: [],
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
