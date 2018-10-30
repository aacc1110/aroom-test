console.log(Math.round(1.6)); //2
console.log(Math.round(1.4)); //1

function sum(first, second){ //(first, second) = parameter(매개변수)
    console.log('a');
    return first + second; // return은 어떤값을 출력한다는 의미와 함수를 종료한다는 2가지 의미를 가지는 특수한 키워드이다.
    console.log('b');
}
sum(2,4); // (2,4) = argument(인자) 

console.log(Math.round(1.6));
console.log(sum(2,4));