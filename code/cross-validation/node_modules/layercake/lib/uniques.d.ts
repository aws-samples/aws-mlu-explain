/**
    Calculate unique values from a list with an optional iterator string or function. By default return the transformed value if iteratee exists.
    @param {Array} list An array of values or objects.
    @param {String|Function} [accessor] An optional accessor function that takes an object and returns the value to judge uniqueness by. If accessor is a string instead of a function, judges uniqueness by the property named by accessor on each of the objects.
    @param {Boolean} [transform=true] If true, return the transformed value from accessor.
    @returns {Array}
*/
export default function uniques(list: any[], accessor?: string | Function, transform?: boolean): any[];
