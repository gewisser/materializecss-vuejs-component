/**
 * Created by Roman on 31.08.2017.
 */


//export default ver = '1.0';

export function implodeObj(array, idsName, conditionKey, conditionVal) {
    var ret = '';

    if (!Array.isArray(array))
        return ret;

    array.forEach(function(item, i, arr) {
        if (item[conditionKey] == conditionVal) {
            if (ret !== '')
                ret += ',';

            ret+=item[idsName]
        }
    });

    return ret;
}