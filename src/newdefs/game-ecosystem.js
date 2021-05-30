// https://www.graphql-code-generator.com/#live-demo
// https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html

/* ATOMS|PRIMATIVES */
/**
 * @typedef {string} ID
 */

/**
 * @typedef {number} Range
 */

/**
 * @typedef  {('self' | 'collider' | Range)} TargetBody
 */

/**
 * @typedef {("noop" | "add" | "reduce")} Func
 */

/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * A number, or a string containing a number.
 * @typedef {(number|string|Point)} Value
 */

/**
 * @typedef {Object} Target
 * @property {('target')} type
 * @property {TargetBody} [body]
 * @property {string} attribute
 */

/**
 * @typedef {Object} Condition
 * @property {string} type
 * @property {Target} leftTarget
 * @property {('>'|'<'|'===')} opperator
 * @property {Target} rightTarget
 */

/* Molecules */

/**
 * @typedef {Object} Node
 * @property {string} type
 * @property {ID} id
 * @property {Value} [value]
 */

/**
 * @typedef {Node} Attribute
 * @property {number} [maxValue]
 */

/**
 * @typedef {Node} Affect
 * @property {string} targetAttribute
 * @property {TargetBody} [targetBody]
 * @property {Condition} condition
 * @property {Func} func
 */

/**
 * @typedef {Node} Event
 * @property {ID[]} affects
 */

/* ORGANISMS */
/**
 * @typedef {Node} Body
 * @property {string} name
 * @property {Object.<ID, Attribute>} attributes
 * @property {Object.<ID, Affect>} standardAffects
 * @property {Object.<ID, Affect>} temporaryAffects
 * @property {Object.<ID, Event>} events
 */

/* ECOSYSTEM */

/**
 * @typedef {Object} World
 * @property {Object.<ID, Body>} bodies
 */
