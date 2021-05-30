import kindof from "kind-of";
import _ from "lodash";
export const isId = ( id ) => ( body ) => body.id === id;

export const not =
  ( fn ) =>
      ( ...args ) =>
          !fn( ...args );

export const toDict =
  ( propType ) =>
      ( ...arr ) =>
          arr.flat().reduce( ( acc, o ) => Object.assign( acc, { [ o[ propType ] ]: o }), {});

export const toDictById = toDict( "id" );

export const typeToId = ( obj ) =>
    obj.id ? obj : Object.assign({}, obj, { id: obj.type });

export const withTypesForIds = ( ...objs ) => objs.map( typeToId );

export const match = ( obj, key ) => {
    const matchingValue = obj[ key ] ?? obj.default;
    return kindof( matchingValue ) === "function" ? matchingValue() : matchingValue;
};

export const byType = ( attributeType ) =>
    _.matchesProperty( "type", attributeType );

export const applyMaxBound = ( attr, value ) =>
    Number.isFinite( attr.maxValue ) ? Math.min( attr.maxValue, value ) : value;
