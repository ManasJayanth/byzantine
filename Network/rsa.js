var c, m;
var pt = [], ct = [];

function mult(plaintext, key, n){
    var k = 1;
    for (var j = 1; j <= key; j++) {
        k = (k * plaintext) % n;
    }
    return k;
}

function gcd (a, b){
    if(b == 0) {
        return 1;
    }
    while(b){
        var rem = a % b;
        a = b;
        b = rem;
    }
    return a;
}

var i, j; // for loop
var p, q; //The prime numbers
var d, e; //d -> private key e -> public key
var z, n; //n = p * q and z = (p-1) * (q-1)

p = 11; q = 23;

n = p * q;
z = (p - 1) * (q - 1);

//--- Calculating e ---//
for(i = 2; i < z; i++) {
    if((gcd(z, i)) == 1){
        e = i;
        break;
    }
}

//--- Calculating d ---/
for(j = n; j >= 1; j--){
    if(((e * j) % z) == 1){
        d = j; //private key
        break;
    }
}

exports.process = function (message, key) {
    for(i = 0; i < message.length; i++)
        pt[i] = message.charCodeAt(i);

    for(i = 0; i < message.length; i++){
        ct[i] = mult(pt[i], key, n);
    }

    var decryptedText = '';
    for(i = 0; i < message.length; i++){
        // pt[i] = mult(ct[i], d, n);
        decryptedText += String.fromCharCode(ct[i]);
    }

    return decryptedText;
};

exports.getPublicKey = function () {
    return e;
};

exports.getPrivateKey = function () {
    return d;
};

// console.log(exports.process(exports.process('I am here', exports.getPublicKey()), exports.getPrivateKey()));
