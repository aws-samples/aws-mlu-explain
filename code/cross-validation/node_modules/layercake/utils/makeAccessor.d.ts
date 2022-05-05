/**
    Make an accessor from a string, number, function or an array of the combination of any
    @param {String|Number|Function|Array} acc The accessor function, key or list of them.
    @returns {Function} An accessor function.
*/
export default function makeAccessor(acc: string | number | Function | any[]): Function;
