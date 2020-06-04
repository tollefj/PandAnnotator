// https://stackoverflow.com/a/3410557
export default function getIndices(searchStr, str, caseSensitive=true) {
    var searchStrLen = searchStr.length;
    if (searchStrLen === 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}
