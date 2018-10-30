// array, object

var f = function(){   // 자바스크립트에서 함수는 처리해야될 일에대한 
    console.log(1+1);      // 정보를 담고있는 일종의 구문이자 
    console.log(1+2);      // 동시에 변수에 담을수 있는 값이다.
};

//console.log(f);
//f();
var a = [f]; // 배열에 f라는 원소를 담는다. f는 함수이다.
a[0]();

var o = {     //object(객체)의 원소로 f함수를 준다.
    func:f
};
o.func();


// var i = if(true){console.log(1)}; //조건문은 변수값이 될수 없다.

// var w = while(true){console.log(1)};  //반복문은 변수값이 될수 없다.