const game = (function (){
})()

function gameBoard(){
    let gameboard = []
    return {gameboard}
}

function player(name, marker){
    let points = 0;
    const getPoints = ()=>points;
    const addPoint = ()=>points++;
    return {name, marker, getPoints, addPoint}
}