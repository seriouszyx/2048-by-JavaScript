var board = new Array();
var score = 0;
var step = 0;
var specialCase = new Array();
if (!window.localStorage.getItem('top')) {
    window.localStorage.setItem('top', 0);
}

window.onload = function () {
    newGame();
    keyDown();
}
//初始化并生成两个随机数
function newGame() {
    initial();
    //生成两个随机数
    getRandomNumber();
    getRandomNumber();

    if (restart) {
        document.getElementById('over').style.display = 'none';
    }
    //初始化分数
    score = 0;
    step = 0;
    updateScore(score);
    updateStep(step);
}

//判断是否执行restart
function restart() {
    var oOver = document.getElementById('over');
    if (oOver.style.display === 'none') {
        return false;
    } else {
        return true;
    }
}

//初始化
function initial() {


    //初始化移动的div --> 二维数组board
    for (let i = 0; i < 4; i++) {
        board[i] = new Array();
        specialCase[i] = new Array();
        for (let j = 0; j < 4; j++) {
            board[i][j] = 0;
            specialCase[i][j] = false;
        }
    }
    //对board进行显示上的设定
    updateBoardView();

    score = 0;
    step = 0;
}

//通过board值改变可以动的cellDiv的样式
function updateBoardView() {
    var oDiv = document.getElementById('content');

    //update topScore
    if (window.localStorage.getItem('top') < score) {
        window.localStorage.setItem('top', score);
    }
    updateTopScore();

    oDiv.innerHTML = '';

    //初始化背景
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            var aDiv1 = document.createElement('div');
            aDiv1.className = 'iniDiv';
            aDiv1.style.top = 20 + 120 * i + 'px';
            aDiv1.style.left = 20 + 120 * j + 'px';
            oDiv.appendChild(aDiv1);
        }
    }

    //创建可移动的cellDiv
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            var aDiv2 = document.createElement('div');
            aDiv2.indexX = i;
            aDiv2.indexY = j;
            aDiv2.className = 'cellDiv';
            oDiv.appendChild(aDiv2);
        }
    }
    //通过board的值改变cellDiv的样式
    var aCellDiv = document.getElementsByClassName('cellDiv');
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 16; k++) {
                if (board[i][j] === 0) {
                    if (aCellDiv[k].indexX === i && aCellDiv[k].indexY === j) {
                        aCellDiv[k].style.width = 0;
                        aCellDiv[k].style.height = 0;
                        aCellDiv[k].style.top = 70 + aCellDiv[k].indexX * 120 + 'px';
                        aCellDiv[k].style.left = 70 + aCellDiv[k].indexY * 120 + 'px';
                    }
                } else if (board[i][j] !== 0) {
                    if (aCellDiv[k].indexX === i && aCellDiv[k].indexY === j) {
                        aCellDiv[k].style.width = '100px';
                        aCellDiv[k].style.height = '100px';
                        aCellDiv[k].style.top = 20 + aCellDiv[k].indexX * 120 + 'px';
                        aCellDiv[k].style.left = 20 + aCellDiv[k].indexY * 120 + 'px';
                        aCellDiv[k].style.backgroundColor = cellDivBgColor(board[i][j]);
                        aCellDiv[k].style.color = cellDivColor(board[i][j]);
                        aCellDiv[k].innerText = board[i][j];
                    }
                }
            }

            specialCase[i][j] = false;
        }
    }

}
//记录当前数据
function setRecord() {
    window.sessionStorage.setItem('cScore', score);
    window.sessionStorage.setItem('cStep', step);
    window.sessionStorage.setItem('cBoard', JSON.stringify(board));
}

//不同数字的背景颜色
function cellDivBgColor(number) {
    switch (number) {
        case 2: return '#eee4da'; break;
        case 4: return '#ede0c8'; break;
        case 8: return '#f2b179'; break;
        case 16: return '#f59563'; break;
        case 32: return '#f67c5f'; break;
        case 64: return '#f65e3b'; break;
        case 128: return '#edcf72'; break;
        case 256: return '#edcc61'; break;
        case 512: return '#9c0'; break;
        case 1024: return '#33b5e5'; break;
        case 2048: return '#09c'; break;
    }

    return 'black';
}

//不同数字的字体颜色
function cellDivColor(number) {
    if (number <= 4) {
        return '#776e65';
    }

    return '#ffffff';
}


//获得任意位置任意数字
function getRandomNumber() {
    if (noSpace(board))
        return false;


    //随机一个位置
    var randX = parseInt(Math.floor(Math.random() * 4));
    var randY = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while (times < 50) {
        if (board[randX][randY] === 0)
            break;

        randX = parseInt(Math.floor(Math.random() * 4));
        randY = parseInt(Math.floor(Math.random() * 4));

        times++;
    }
    if (times === 50) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    randX = i;
                    randY = j;
                }
            }
        }
    }
    //随机一个数字
    var randomNumber = Math.random() < 0.5 ? 2 : 4;
    //显示
    board[randX][randY] = randomNumber;
    showNumber(randX, randY, randomNumber);

    return true;
}


//判断游戏是否结束
function noSpace(board) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }

    return true;
}

//显示数字动画
function showNumber(i, j, randomNumber) {
    var aCellDiv = document.getElementsByClassName('cellDiv');
    for (let k = 0; k < 16; k++) {
        if (aCellDiv[k].indexX === i && aCellDiv[k].indexY === j) {
            aCellDiv[k].style.backgroundColor = cellDivBgColor(randomNumber);
            aCellDiv[k].style.color = cellDivColor(randomNumber);
            aCellDiv[k].innerText = randomNumber;
            Move(aCellDiv[k], 4, { 'width': 100, 'height': 100, 'top': 20 + aCellDiv[k].indexX * 120, 'left': 20 + aCellDiv[k].indexY * 120 })
        }
    }
}

//运动函数
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}
function Move(obj, n, json, fn) {
    clearInterval(obj.timer)
    obj.timer = setInterval(function () {
        var Stop = true;
        for (let attr in json) {
            var cur = parseInt(getStyle(obj, attr));
            var speed = (json[attr] - cur) / n;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (json[attr] != cur) {
                Stop = false;
            }
            obj.style[attr] = cur + speed + 'px';
            if (Stop) {
                clearInterval(obj.timer);
                if (fn) fn();
            }
        }
    }, 30)
}

//按键
function keyDown() {
    document.onkeydown = function (ev) {
        var ev = ev || window.event;
        switch (ev.keyCode) {
            case 37:
                if (moveLeft()) {
                    setTimeout(function () {
                        getRandomNumber();
                    }, 200);
                    setTimeout(function () {
                        isGameOver();
                    }, 300);
                }
                break;
            case 38:
                if (moveUp()) {
                    setTimeout(function () {
                        getRandomNumber();
                    }, 200);
                    setTimeout(function () {
                        isGameOver();
                    }, 300);
                }
                break;
            case 39:
                if (moveRight()) {
                    setTimeout(function () {
                        getRandomNumber();
                    }, 200);
                    setTimeout(function () {
                        isGameOver();
                    }, 300);
                }
                break;
            case 40:
                if (moveDown()) {
                    setTimeout(function () {
                        getRandomNumber();
                    }, 200);
                    setTimeout(function () {
                        isGameOver();
                    }, 300);
                }
                break;
            default:
                break;
        }
    }
}

//左移函数
function moveLeft() {
    //判断是否能够向左移动
    if (!canMoveLeft(board)) {
        return false;
    }
    setRecord();

    //moveLeft
    //落脚位置是否为空
    //落脚位置数字是否相等
    //移动路径中是否有障碍物
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            if (board[i][j] !== 0) {
                //遍历当前位置左侧的元素
                for (let k = 0; k < j; k++) {
                    if (board[i][k] === 0 && noBlock(i, k, j, board)) {
                        //move
                        showMove(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] === board[i][j] && noBlock(i, k, j, board) && !specialCase[i][k]) {
                        //move
                        //add
                        showMove(i, j, i, k);
                        board[i][k] *= 2;
                        board[i][j] = 0;

                        //add score
                        score += board[i][k];
                        updateScore(score);

                        specialCase[i][k] = true;
                        continue;
                    }
                }

            }
        }
    }
    setTimeout(function () {
        updateBoardView();
    }, 50)

    //add step
    step += 1;
    updateStep(step);

    return true;
}

//判断是否能够向左移动
function canMoveLeft(board) {
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            if (board[i][j] !== 0) {
                if (board[i][j - 1] === 0 || board[i][j - 1] === board[i][j]) {
                    return true;
                }
            }
        }
    }

    return false;
}


//上移函数
function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }
    setRecord();
    for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {
            if (board[i][j] !== 0) {
                for (let k = 0; k < i; k++) {
                    if (board[k][j] === 0 && noBlock2(j, k, i, board)) {
                        //move
                        showMove(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] === board[i][j] && noBlock2(j, k, i, board) && !specialCase[k][j]) {
                        //move
                        //add
                        showMove(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;

                        score += board[k][j];
                        updateScore(score);

                        specialCase[k][j] = true;
                        continue;
                    }
                }

            }
        }
    }
    //add step
    step += 1;
    updateStep(step);

    setTimeout(function () {
        updateBoardView();
    }, 50)
    return true;
}
//判断是否能够向上移动
function canMoveUp(board) {
    for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {
            if (board[i][j] !== 0) {
                if (board[i - 1][j] === 0 || board[i - 1][j] === board[i][j]) {
                    return true;
                }
            }
        }
    }

    return false;
}

//右移函数
function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }
    setRecord();
    for (let i = 0; i < 4; i++) {
        for (let j = 2; j > -1; j--) {
            if (board[i][j] !== 0) {
                for (let k = 3; k > j; k--) {
                    if (board[i][k] === 0 && noBlock(i, j, k, board)) {
                        showMove(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] === board[i][j] && noBlock(i, j, k, board) && !specialCase[i][k]) {
                        showMove(i, j, i, k);
                        board[i][k] *= 2;
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore(score);

                        specialCase[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }

    //add step
    step += 1;
    updateStep(step);

    setTimeout(function () {
        updateBoardView();
    }, 50)
    return true;
}
//判断能否向右移动
function canMoveRight(board) {
    for (let i = 0; i < 4; i++) {
        for (let j = 2; j > -1; j--) {
            if (board[i][j] !== 0) {
                if (board[i][j + 1] === 0 || board[i][j] === board[i][j + 1]) {
                    return true;
                }
            }
        }
    }

    return false;
}

//下移函数
function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }
    setRecord();
    for (let j = 0; j < 4; j++) {
        for (let i = 2; i > -1; i--) {
            if (board[i][j] !== 0) {
                for (let k = 3; k > i; k--) {
                    if (board[k][j] === 0 && noBlock2(j, k, i, board)) {
                        showMove(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] === board[i][j] && noBlock2(j, k, i, board) && !specialCase[k][j]) {
                        showMove(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;

                        score += board[k][j];
                        updateScore(score);

                        specialCase[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    //add step
    step += 1;
    updateStep(step);

    setTimeout(function () {
        updateBoardView();
    }, 50)
    return true;
}
//判断能否向下移动
function canMoveDown(board) {
    for (let j = 0; j < 4; j++) {
        for (let i = 2; i > -1; i--) {
            if (board[i][j] !== 0) {
                if (board[i + 1][j] === 0 || board[i][j] === board[i + 1][j]) {
                    return true;
                }
            }
        }
    }

    return false;
}

//判断水平路径上是否有障碍物
function noBlock(row, col1, col2, board) {
    for (let i = col1 + 1; i < col2; i++) {
        if (board[row][i] !== 0) {
            return false;
        }
    }

    return true;
}
//判断竖直路径上是否有障碍物
function noBlock2(col, row1, row2, board) {
    for (let i = row1 + 1; i < row2; i++) {
        if (board[i][col] !== 0) {
            return false;
        }
    }

    return true;
}
//cellDiv移动动画
function showMove(fromX, fromY, toX, toY) {
    var aCellDiv = document.getElementsByClassName('cellDiv');
    for (let k = 0; k < 16; k++) {
        if (aCellDiv[k].indexX === fromX && aCellDiv[k].indexY === fromY) {
            Move(aCellDiv[k], 8, { 'top': 20 + toX * 120, 'left': 20 + toY * 120 });
        }
    }
}

//判断游戏是否结束
function isGameOver() {
    if (noSpace(board) && cannotMove(board)) {
        gameOver();
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 2048) {
                gameOver();
            }
        }
    }

}

//当noSpace时是否可以移动
function cannotMove(board) {
    if (canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board)) {
        return false;
    }

    return true;
}

//游戏结束
function gameOver() {
    document.getElementById('over').style.display = 'block';
}

//将score显示
function updateScore(score) {
    document.getElementById('score').innerHTML = score;
}

//将step显示
function updateStep(step) {
    document.getElementById('step').innerHTML = step;
}

//将topScpre显示
function updateTopScore() {
    document.getElementById('top').innerText = window.localStorage.getItem('top');
}
//撤销回上一步按键
function back() {
    score = parseInt(window.sessionStorage.getItem('cScore'));
    step = parseInt(window.sessionStorage.getItem('cStep'));
    board = JSON.parse(window.sessionStorage.getItem('cBoard'));
    updateScore(score);
    updateStep(step);
    updateBoardView();
}


