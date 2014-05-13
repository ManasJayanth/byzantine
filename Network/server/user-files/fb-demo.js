var FB = require('fb');
FB.setAccessToken('CAAUh1bJx2agBAFZATzHkNIHlUCjD18kaukq7rZC6HbvxR9IdjKoJacuSbZChmvyjiSGdcD2ZCjgTJkit7jpPYpo4RQ4D4r8jGnilkjsgobEvAsQ4iZC5vW9EZChf2oyFrOuURfU2yoqBG8SLmNTqH5STmeBIMDZC3sbrFxXZC6TclrZAVi78kIKs537HwujXMmY4ZD');

var extractEtag;
FB.api('', 'post', { 
    batch: [
        { method: 'get', relative_url: '4' },
        { method: 'get', relative_url: 'me/friends?limit=50' },
        { method: 'get', relative_url: 'fql?q=' + encodeURIComponent('SELECT uid FROM user WHERE uid=me()' ) }, /* fql */
        { method: 'get', relative_url: 'fql?q=' + encodeURIComponent(JSON.stringify([
                    'SELECT uid FROM user WHERE uid=me()',
                    'SELECT name FROM user WHERE uid=me()'
                ])) }, /* fql multi-query */
        { method: 'get', relative_url: 'fql?q=' + encodeURIComponent(JSON.stringify({
                    id: 'SELECT uid FROM user WHERE uid=me()',
                    name: 'SELECT name FROM user WHERE uid IN (SELECT uid FROM #id)'
                })) }, /* named fql multi-query */
        { method: 'get', relative_url: '4', headers: { 'If-None-Match': '"7de572574f2a822b65ecd9eb8acef8f476e983e1"' } }, /* etags */
        { method: 'get', relative_url: 'me/friends?limit=1', name: 'one-friend' /* , omit_response_on_success: false */ },
        { method: 'get', relative_url: '{result=one-friend:$.data.0.id}/feed?limit=5'}
    ]
}, function(res) {
    var res0, res1, res2, res3, res4, res5, res6, res7,
        etag1;

    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }

    res0 = JSON.parse(res[0].body);
    res1 = JSON.parse(res[1].body);
    res2 = JSON.parse(res[2].body);
    res3 = JSON.parse(res[3].body);
    res4 = JSON.parse(res[4].body);
    res5 = res[5].code === 304 ? undefined : JSON.parse(res[5].body);   // special case for not-modified responses
                                                                        // set res5 as undefined if response wasn't modified.
    res6 = res[6] === null ? null : JSON.parse(res[6].body);
    res7 = res6 === null ? JSON.parse(res[7].body) : undefined; // set result as undefined if previous dependency failed

    if(res0.error) {
        console.log(res0.error);
    } else {
        console.log('Hi ' + res0.name);
        etag1 = extractETag(res[0]); // use this etag when making the second request.
        console.log(etag1);
    }

    if(res1.error) {
        console.log(res1.error);
    } else {
        console.log(res1);
    }

    if(res2.error) {
        console.log(res2.error);
    } else {
        console.log(res2.data);
    }

    if(res3.error) {
        console.log(res3.error);
    } else {
        console.log(res3.data[0].fql_result_set);
        console.log(res3.data[1].fql_result_set);
    }

    if(res4.error) {
        console.log(res4.error);
    } else {
        console.log(res4.data[0].fql_result_set);
        console.log(res4.data[0].fql_result_set);
    }

    // check if there are any new updates
    if(typeof res5 !== "undefined") {
        // make sure there was no error
        if(res5.error) {
            console.log(error);
        } else {
            console.log('new update available');
            console.log(res5);
        }
    }
    else {
        console.log('no updates');
    }

    // check if dependency executed successfully    
    if(res[6] === null) {
        // then check if the result it self doesn't have any errors.
        if(res7.error) {
            console.log(res7.error);
        } else {
            console.log(res7);
        }
    } else {
        console.log(res6.error);
    }
});

extractETag = function(res) {
    var etag, header, headerIndex;
    for(headerIndex in res.headers) {
        header = res.headers[headerIndex];
        if(header.name === 'ETag') {
            etag = header.value;
        }
    }
    return etag;
};
