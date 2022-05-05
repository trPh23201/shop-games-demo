export const queryByEnterUrl = (_page, _limit, _sort, _order, tag, name) => {
    var queryString = (_page && _limit) ? `_page=${_page}&_limit=${_limit}` : ''; //paginate
    queryString += (_sort && _order) ? `&_sort=${_sort}&_order=${_order}` : ''; //sort
    queryString += tag ? `&tags_like=${tag}` : ''; //query tag
    queryString += name ? `&name_like=${name}` : ''; //query by search name
    return queryString;
}

export const queryByScrollPagi = (_page, _limit, _sort, _order, tag, name, page) => {
    var queryString = (_page && _limit) ? `_page=${page}&_limit=${_limit}` : '';
    queryString += (_sort && _order) ? `&_sort=${_sort}&_order=${_order}` : '';
    queryString += tag ? `&tags_like=${tag}` : '';
    queryString += name ? `&name_like=${name}` : '';
    return queryString;
}

export const queryBySort = (_page, _limit, _sort, _order, tag, name, sort, order) => {
    var queryString = (_page && _limit) ? `_page=${_page}&_limit=${_limit}` : '';
    queryString += (_sort && _order) ? `&_sort=${sort}&_order=${order}` : '';
    queryString += tag ? `&tags_like=${tag}` : '';
    queryString += name ? `&name_like=${name}` : '';
    return queryString;
}

export const queryByTag = (_page, _limit, _sort, _order, queryName, name) => {
    var queryString = (_page && _limit) ? `_page=${1}&_limit=${_limit}` : '';
    queryString += (_sort && _order) ? `&_sort=${_sort}&_order=${_order}` : '';
    queryString += name === '' ? '' : `&tags_like=${name}`;
    queryString += queryName ? `&name_like=${queryName}` : '';
    return queryString;
}

export const queryBySearch = (_page, _limit, _sort, _order, tag, keyWord) => {
    var queryString = (_page && _limit) ? `_page=${1}&_limit=${_limit}` : '';
    queryString += (_sort && _order) ? `&_sort=${_sort}&_order=${_order}` : '';
    queryString += tag ? `&tags_like=${tag}` : '';
    queryString += keyWord !== '' ? `&name_like=${keyWord}` : '';
    return queryString;
}