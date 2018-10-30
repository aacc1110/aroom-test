var members = ['egoing', 'k885j', 'hoya']; // array type
console.log(members[1]);
var i = 0;
while(i < members.length){
    console.log('array loop:', members[i]);
    i += 1;
}

var roles = {                               // object type
    'programmer': 'egoing',                 // name, key
    'designer': 'k885j',
    'manager': 'hoya'};

console.log(roles.designer);
console.log(roles['manager']);

for(var n in roles){
    console.log('object:', n, 'value:', roles[n]);
    console.log(n);
}