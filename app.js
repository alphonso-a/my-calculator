document.querySelectorAll('.sub-sub-container').forEach(sub_sub_container => {
    sub_sub_container.addEventListener('click', event => {
        sub_sub_container.querySelector("p").click();
    })
})

document.querySelectorAll('.input').forEach(input => {
    input.addEventListener('click', event => {
        if(input.classList.contains('digit'))
            addDigit(input.getAttribute('id'));
        if(input.classList.contains('symbol'))
            applySymbol(input.getAttribute('id'));
    })
})

const inputSize = window.getComputedStyle(document.getElementById('main')).getPropertyValue('font-size');

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
    changeSize();
}

removeDigit = () => {
    if(num.length != 0)
        num.pop();

    temp = null;

    output(num);
    
    if(num.length == 0)
        defaultSize();
    else
        changeSize('-');
}

changeSize = mode => {

    if(mode === '-'){

        document.getElementById('main').style.fontSize = (parseFloat(document.getElementById('main').style.fontSize) + 3) + 'px';

    }else{

        document.getElementById('main').style.fontSize = (parseFloat(inputSize) - (3 * num.length)) + 'px';

    }
}

defaultSize = () => {
    document.getElementById('main').style.fontSize = null;
}


deleteInput = () => {
    if(equations[0] != null && equations[0].result === null)
        equations.shift();
    
    reset();
    temp = null;

    output("");
    subOutput("");
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
    subOutput();
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
    
    output(operation.result);
    subOutput();
    return operation.result;
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

subOutput = value => {
    var subOutput = document.getElementById('sub');

    if (value != null) {
        subOutput.innerText = value;
        return
    }

    let output = equations[0].first + 
                 " " + 
                 equations[0].operator;

    if(equations[0].second != null)
        output += " " + equations[0].second;

    if(equations[0].result != null &&
       equations[0].operator != "=")
        output += " = ";


    subOutput.innerText = output;
}

changeOperator = operator => {
    equations[0].operator = operator;
    
    if(operator === '='){
        temp = finalizeEquation(equations[0]);
        reset();
    }

    subOutput();
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
        output('0');
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