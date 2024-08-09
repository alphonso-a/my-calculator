document.querySelectorAll('.sub-sub-container').forEach(sub_sub_container => {
    sub_sub_container.addEventListener('click', event => {
        sub_sub_container.querySelector("p").click();
    })
})

document.querySelectorAll('.input').forEach(input => {
    input.addEventListener('click', event => {
        if(input.classList.contains('digit') 
            && num.length < 9)
            addDigit(
                input.getAttribute('id')
            );
        if(input.classList.contains('symbol'))
            applySymbol(
                input.getAttribute('id')
            );
    })
})

const input = document.getElementById('main');
const inputSize = window.getComputedStyle(input).getPropertyValue('font-size');
const inputStyle = input.style;

const equation = {
    first: null,
    second: null,
    operator: null,
    result: null
}

var equations = [];

var num = [];
var lastResult = null;

var positive = true;
var x = 0.1; 
var y = 0.1;

addDigit = digit => {
    lastResult = null;

    num.push(digit);
    output(num);
}

removeDigit = () => {
    if(num.length != 0)
        num.pop();

    output(num);
    
    if(num.length == 0)
        output(0);
}

deleteInput = () => {
    if(equations[0] != null && equations[0].result === null)
        equations.shift();
    
    reset();

    output(0);
    eqOutput("");
}

finalizeOp = () => { 
    if(num.length === 0)
        return null;

    if(positive === false)
        return -(combineDigits());
    else
        return combineDigits();
}

combineDigits = () => {
    let numStr = num.join("");

    if(numStr.includes("."))
        return parseFloat(numStr);
    else
        return Number(numStr);
}

parseEq = (num, operator = null) => {
    var op;

    if(num === null)
        return

    op = initEq(op);

    if(op.first === null){
        addFirst(op, num, operator); 
        console.log(equations);
        return;
    }

    addSecond(op, num, operator);
    console.log(equations);
}

initEq = op => {
    if(equations.length === 0 || equations[0].result != null){
        op = Object.create(equation);
        equations.unshift(op);
    }else{
        op = equations[0];
    }

    return op;
}

addFirst = (op , num, operator) => {
    op.first = num;
    op.operator = operator;

    if(operator === "=")
        lastResult = finalizeEq(op); 
    
    reset();
    eqOutput();
}

addSecond = (op , num, operator) => {
    op.second = num;

    if(operator === "=")
        lastResult = finalizeEq(op); 
    else 
        parseEq(finalizeEq(op), operator);

    reset();
    return;
}

reset = () => {
    num = [];
    positive = true;
    x = 0.1; 
    y = 0.1;
}

finalizeEq = op => {
    if(op.second === null)
        op.result = eval(op.first);
    else
        op.result = eval(op.first + 
                         op.operator + 
                         op.second)

    console.log(op.result);
    output(notation(op.result));

    eqOutput();
    eqHistory();
    return op.result;
}

notation = value => {
    if(typeof value === 'string'){
        let match = value.match(/\(([^)]+)\)/);

        if(match[1].length < 9)
            return '√' + match[1];
        else 
            return '√' + Number.parseFloat(match[1]).toExponential(5);
    }

    if(value.toString().length > 9){
        return Number.parseFloat(value).toExponential(5);
    }else
        return value;
    
}

output = value => {
    var mainOutput = document.getElementById('main');

    if(Array.isArray(value)){
        if(positive)
            mainOutput.innerText = value.join("");
        else
            mainOutput.innerText = -(value.join(""));
    }
    else
        mainOutput.innerText = value;    
}

eqOutput = value => {
    var subOutput = document.getElementById('sub');

    if (value != null) {
        subOutput.innerText = value;
        return
    }

    let output = notation(equations[0].first) + 
                 " " + 
                 equations[0].operator;

    if(equations[0].second != null)
        output += " " + notation(equations[0].second);

    if(equations[0].result != null &&
       equations[0].operator != "=")
        output += " = ";


    subOutput.innerText = output;
}

eqHistory = () => {
    var history = document.getElementById('history');


    history.innerHTML = '';

    for(let i = 0; i < equations.length; i++){
        let equation = '<div class="equation" id="' + i + '">'
        + '<p class="expression">' 
            + notation(equations[i].first)
            + ' ' 
            + (equations[i].operator === '=' ? ' ' : equations[i].operator) 
            + ' ' 
            + (equations[i].second === null ? ' ' : notation(equations[i].second)) + 
        '</p>' 
        + '<p class="answer">' + ' = ' + notation(equations[i].result) + '</p>' 
        + '</div>' ;

        history.innerHTML += equation;
    }
}

changeOperator = operator => {
    equations[0].operator = operator;
    
    if(operator === '='){
        lastResult = finalizeEq(equations[0]);
        reset();
    }

    eqOutput();
}

applySymbol = symbol => {

    if(symbol === 'sq-root'){ 
        console.log('hello')
        if(num.length === 0 && lastResult === null)
            return

        let radicand = (num.length === 0) ? lastResult : finalizeOp(num);

        let value = 'Math.sqrt(' + radicand + ')';
        
        parseEq(value, '=');
        return
    }

    if(symbol === 'plus-minus'){
        if(positive === true)
            positive = false
        else
            positive = true

        output(num);
        return
    }
    
    if(symbol === 'decimal-point'){
        if((!(num.includes('.')) && (num.length === 0))){
            num[0] = '0.';
        }

        else if (num[num.length-1] === '.'){
            num.pop();
        }

        else if ((!(num.includes('.'))) && (num[0] !== '0.')){
            num.push('.');
        }

        output(num);
        return
    }

    if(symbol === 'back'){
        removeDigit();
        console.log(num);
        return
    }

    if(symbol === 'delete'){
        deleteInput();
        lastResult = null;
        return
    }

    if(num.length != 0){
        parseEq(finalizeOp(), symbol);
        return;
    }
    
    if(lastResult != null){
        parseEq(lastResult, symbol);
        lastResult = null;
        return;
    }

    if(equations[0].operator != null &&
       equations[0].result === null){
        changeOperator(symbol);
        return;
    };
}