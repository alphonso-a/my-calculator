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
var temp = null;

var positive = true;
var x = 0.1; 
var y = 0.1;

addDigit = digit => {
    if (temp != null)
        temp = null

    num.push(digit);
    output(num);
}

removeDigit = () => {
    if(num.length != 0)
        num.pop();

    temp = null;

    output(num);
    
    if(num.length == 0)
        output(0);
}

deleteInput = () => {
    if(equations[0] != null && equations[0].result === null)
        equations.shift();
    
    reset();
    temp = null;

    output(0);
    eqOutput("");
}

finalizeNumber = () => { 
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

handleEquation = (num, operator = null) => {
    var operation;


    if(num === null)
        return

    operation = initializeEquation(operation);

    if(operation.first === null){
        addFirst(operation, num, operator); 
        console.log(operation);
        return;
    }

    addSecond(operation, num, operator);
    console.log(equations);
}

initializeEquation = operation => {
    if(equations.length === 0 || equations[0].result != null){
        operation = Object.create(equation);
        equations.unshift(operation);
    }else{
        operation = equations[0];
    }

    return operation;
}

addFirst = (operation , num, operator) => {
    operation.first = num;
    operation.operator = operator;

    if(operator === "=")
        temp = finalizeEquation(operation); 
    
    reset();
    eqOutput();
}

addSecond = (operation , num, operator) => {
    operation.second = num;

    if(operator === "=")
        temp = finalizeEquation(operation); 
    else 
        handleEquation(finalizeEquation(operation), operator);

    reset();
    return;
}

reset = () => {
    num = [];
    positive = true;
    x = 0.1; 
    y = 0.1;
}

finalizeEquation = operation => {
    if(operation.second === null)
        operation.result = operation.first;
    else
        operation.result = eval(operation.first + 
                                operation.operator + 
                                operation.second)
    

    output(notation(operation.result));

    eqOutput();
    eqHistory();
    return operation.result;
}

notation = value => {
    if(value.toString().length > 9){
        return Number.parseFloat(value).toExponential(5);
    }else{
        return value;
    }
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
            + (equations[i].second === null ? ' ' : equations[i].second) + 
        '</p>' 
        + '<p class="answer">' + ' = ' + notation(equations[i].result) + '</p>' 
        + '</div>' ;

        history.innerHTML += equation;
    }
}

changeOperator = operator => {
    equations[0].operator = operator;
    
    if(operator === '='){
        temp = finalizeEquation(equations[0]);
        reset();
    }

    eqOutput();
}

applySymbol = symbol => {

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
        return
    }

    if(num.length != 0){
        handleEquation(finalizeNumber(), symbol);
        return;
    }
    
    if(temp != null){
        handleEquation(temp, symbol);
        temp = null;
        return;
    }

    if(equations[0].operator != null){
        changeOperator(symbol);
        return;
    };
}