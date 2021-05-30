import produce from "immer";
import "../game-ecosystem";
import { FlatWorld, flatWorld } from "../bodies/flatWorld";
import { kart } from "../bodies/luigi";
import { not, isId } from "../utils";
import { greenShell } from "../bodies/greenShell";
import { mushroom } from "../bodies/mushroom";
import { attr, affectTargets, events } from "../bodies/primatives";
import { Body } from "../bodies/Body";
import { findAttributeByNodeType } from "../bodies/utils";

const getBodyEffectById = ( body, id ) =>
    body.standardAffects[ id ] || body.temporaryAffects[ id ];

const getBodyEventAffects = ( body, eventType ) => {
    const affectIds = body.events[ eventType ].actions;
    return affectIds.map( ( id ) => getBodyEffectById( body, id ) );
};

const getBodyById = ( world, id ) => FlatWorld.getBody( world, id );

const isDead = ( body ) =>
    !( findAttributeByNodeType( body, attr.ALIVE )?.value ?? true );
const getPosition = ( body ) =>
    findAttributeByNodeType( body, attr.POSITION )?.value;

const getBodiesAtPosition = ( world, position ) =>
    Object.values( world.attributes[ attr.BODIES ].value ).filter( ( body ) =>
        FlatWorld.isSamePosition( getPosition( body ), position )
    );

function removeDeadBody( world, body ) {
    if ( isDead( body ) ) delete world.attributes[ attr.BODIES ].value[ body.id ];
}

// apply a bodies TICK event affects to itself
const tickBody = ( bodyId ) => ( immerWorld ) => {
    const body = getBodyById( immerWorld, bodyId );
    const collidingBodies = getBodiesAtPosition(
        immerWorld,
        getPosition( body )
    ).filter( not( isId( body.id ) ) );

    collidingBodies.forEach( ( cB ) => {
        getBodyEventAffects( cB, events.COLLISION ).forEach( ( affect ) => {
            Body.applyEffect(
                affect,
                {
                    [ affectTargets.SELF ]:     cB,
                    [ affectTargets.COLLIDER ]: body
                },
                immerWorld
            );
        });
        removeDeadBody( immerWorld, cB );
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

    getBodyEventAffects( body, events.TICK ).forEach( ( affect ) => {
        Body.applyEffect(
            affect,
            {
                [ affectTargets.SELF ]: body
            },
            immerWorld
        );
    });

    removeDeadBody( immerWorld, body );
};

const tick = ( world, bodyId ) => produce( world, tickBody( bodyId ) );

/**
 * I should try to make all of my `immer`/affecting functions actualy labeled `function`
 * and all of my getters and checks arrow functions
 */

const getLuigi = ( world ) => FlatWorld.getBody( world, "luigi" );

describe( "move a body", () => {
    let world;
    beforeEach( () => {
        world = FlatWorld.addBody( flatWorld, kart );
    });
    it( "should move", () => {
        const expected = produce( kart, ( k ) => {
            k.attributes[ attr.SPEED ].value += 1;
            k.attributes[ attr.POSITION ].value += 1;
        });

        const actual = getLuigi( tick( world, "luigi" ) );

        expect( actual ).to.eqls( expected );
    });
    it( "should not move if condition fails", () => {
        const newKart = produce( kart, ( k ) => {
            k.attributes[ attr.POSITION ].value += 6;
        });
        world = FlatWorld.addBody( flatWorld, newKart );

        const expected = produce( newKart, ( k ) => {
            k.attributes[ attr.SPEED ].value += 1;
        });

        const actual = getLuigi( tick( world, "luigi" ) );

        expect( actual ).to.eqls( expected );
    });
    it( "speed should not exceed max", () => {
        const newKart = produce( kart, ( k ) => {
            k.attributes[ attr.SPEED ].value = k.attributes[ attr.SPEED ].maxValue;
        });

        world = FlatWorld.addBody( flatWorld, newKart );

        const expected = produce( newKart, ( k ) => {
            k.attributes[ attr.POSITION ].value += 1;
        });

        const actual = getLuigi( tick( world, "luigi" ) );

        expect( actual ).to.eqls( expected );
    });
    it( "should collid with Shell", () => {
        world = FlatWorld.addBodies( flatWorld, kart, greenShell );

        const expected = FlatWorld.addBodies(
            flatWorld,
            produce( kart, ( k ) => {
                k.attributes[ attr.SPEED ].value = 1;
                k.attributes[ attr.POSITION ].value = 1;
            })
        );

        const actual = tick( world, "luigi" );

        expect( actual ).to.eqls( expected );
    });
    it( "shell should catch it and collide", () => {
        const luigi = produce( kart, ( k ) => {
            k.attributes[ attr.POSITION ].value = 7;
        });

        const shell = produce( greenShell, ( k ) => {
            k.attributes[ attr.SPEED ].value = 10;
            k.attributes[ attr.POSITION ].value = 5;
        });

        world = FlatWorld.addBodies( flatWorld, luigi, shell );

        const expected = FlatWorld.addBodies(
            flatWorld,
            produce( kart, ( k ) => {
                k.attributes[ attr.SPEED ].value = 1;
                k.attributes[ attr.POSITION ].value = 7;
            })
        );

        const actual = [
            "luigi",
            "greenShell",
            "luigi",
            "greenShell",
            "luigi"
        ].reduce( tick, world );

        expect( actual ).to.eqls( expected );
    });
    it( "should reduce speed if over max", () => {
        world = FlatWorld.addBody(
            flatWorld,
            produce( kart, ( k ) => {
                k.attributes[ attr.SPEED ].value = 10;
            })
        );

        const expected = produce( kart, ( k ) => {
            k.attributes[ attr.SPEED ].value = 9;
            k.attributes[ attr.POSITION ].value = 1;
        });

        const actual = getLuigi( tick( world, "luigi" ) );
        expect( actual ).to.eqls( expected );
    });
    it( "should use a boost item to increase speed", () => {
    // # luigi has a mushroom and gets a temporary speed boost
    // luigi has a mushroom in the inventory
        const luigi = produce( kart, ( k ) => {
            k.holding[ mushroom.id ] = mushroom;
        });

        world = FlatWorld.addBody( flatWorld, luigi );

        const newWorld = FlatWorld.dispatch( world, {
            payload: { itemId: mushroom.id, sourceId: luigi.id },
            type:    "use_item"
        });

        const expected = produce( kart, ( k ) => {
            k.attributes[ attr.SPEED ].value = 7;
            k.attributes[ attr.POSITION ].value = 1;
        });

        const actual = getLuigi( tick( newWorld, "luigi" ) );

        expect( actual ).to.eqls( expected );
    });
    // it.only("should use a shell item and add a new shell to the world", () => {
    //   const luigi = produce(kart, (k) => {
    //     k.holding[greenShell.id] = greenShell;
    //   });

    //   const world = FlatWorld.create(createSegment, {
    //     bodies: {
    //       luigi
    //     }
    //   });

    //   const newWorld = FlatWorld.dispatch(world, {
    //     type: "use_item",
    //     payload: { itemId: greenShell.id, sourceId: luigi.id }
    //   });

    //   const expected = FlatWorld.create(createSegment, {
    //     bodies: {
    //       luigi,
    //       greenShell
    //     }
    //   });

    //   const actual = tickWorld(newWorld);

    //   // const actual = tick(newWorld, "luigi").getBody('luigi');

    //   expect(actual).to.eqls(expected);
    // });
});
