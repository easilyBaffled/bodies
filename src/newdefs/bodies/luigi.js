import { toDictById } from "../utils";
import { attr, attribute, events } from "./primatives";

/** @type {Body} */
export const kart = {
    attributes: toDictById(
        attribute.speed({
            maxValue: 5,
            value:    3
        }),
        attribute.position({
            value: 0
        })
    ),
    events: {
        [ events.TICK ]: {
            actions: [ 2, 3, "normalize-speed" ],
            id:      4,
            type:    events.TICK
        }
    },
    holding:         toDictById(),
    id:              "luigi",
    name:            "luigi",
    standardAffects: toDictById(
        {
            condition: {
                opperator:   "<",
                rightTarget: {
                    attribute: attr.SPEED,
                    property:  "maxValue",
                    type:      "target"
                },
                target: {
                    attribute: attr.SPEED,
                    type:      "target"
                },
                type: "BinaryCondition"
            },
            func:            "add",
            id:              2,
            targetAttribute: attr.SPEED,
            type:            "accelerate",
            value:           1
        },
        {
            condition: {
                opperator:   ">",
                rightTarget: {
                    attribute: attr.SPEED,
                    property:  "maxValue",
                    type:      "target"
                },
                target: {
                    attribute: attr.SPEED,
                    type:      "target"
                },
                type: "BinaryCondition"
            },
            func:            "reduce",
            id:              "normalize-speed",
            targetAttribute: attr.SPEED,
            type:            "normalize.speed",
            value:           1
        },
        {
            condition: {
                opperator:   ">=",
                rightTarget: {
                    attribute: attr.SPEED,
                    body:      "segment",
                    type:      "target"
                },
                target: {
                    attribute: attr.SPEED,
                    type:      "target"
                },
                type: "BinaryCondition"
            },
            func:            "add",
            id:              3,
            targetAttribute: attr.POSITION,
            type:            "move",
            value:           1
        }
    ),
    temporaryAffects: toDictById()
};
