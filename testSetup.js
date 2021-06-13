// import each from 'mocha-each'
import { JSDOM } from 'jsdom';
import { expect } from "chai";
import { current } from "immer";

const { window } = new JSDOM( '<!DOCTYPE html><html><head></head><body></body></html>' );
global.document = window.document;
global.window = window;
global.navigator = { userAgent: 'node.js' };
global.expect = expect;

global.current = ( o ) => {
    try {
        return current( o );
    } catch ( e ) {
        console.error( e );
        return o;
    }
};
// const _log = console.log
// console.log = (...args) => {
// 	_log(...args, chalk.blue(get()[0].getFileName()))
// }

/**
 *
 * @param {*} v
 * @param {...any} rest
 */
console.tap = ( v, ...rest ) => ( console.log( v, ...rest ), v );

/**
 *
 * @param {*} v
 * @param {...any} rest
 */
console.current = ( v, ...rest ) => ( console.log( current( v ), ...rest ), v );
