const newGameBoard = (function gameBoard(){
    let boardSize = 3;
    let board = [];
    let markers = ["X", "O"]
    let winMarker = null;
    const startBoard = ()=>{
        for(let i = 0; i < boardSize; i++){
            let newRow = [];
            for(let j = 0; j < boardSize; j++){
                newRow.push(0);
            }
            board.push(newRow);
        }
    }
    const getMarkers = ()=>markers

    const isFilled = ()=>{
        for(let i = 0; i < boardSize; i++){
            for(let j = 0; j < boardSize; j++){
                if(board[i][j] == 0){
                    return false
                }
            }
        }
        return true
    }
    const checkRowWin = (markers)=>{
        for(let i = 0; i < boardSize; i++){
            let firstItem = board[i][0];
            if(markers.includes(firstItem) &&
                (board[i].every(item=>item === firstItem)) == true){
                winMarker = firstItem;
                return true
            }
        }
        return false
    }

    const checkColumnWin = (markers)=>{
        let columnArray = []
        for(let i = 0; i < boardSize; i++){
            columnArray.push(i)
        }
        // Get values in each column
        const columns = columnArray.map(colIndex => board.map(row => row[colIndex]));

        for(let i = 0; i < boardSize; i++){
            let firstItem = columns[i][0];
            if(markers.includes(firstItem) &&
                (columns[i].every(item=>item === firstItem)) == true){
                winMarker = firstItem;
                return true
            }
        }
        return false
    }

    const isWin = ()=>{
        // check row win
        if(checkRowWin(markers)==true){
            return true
        }
        // check column win
        if(checkColumnWin(markers)==true){
            return true
        }
        // check diagonal win
        return false
    }

    const getWinMarker = ()=>{
        return winMarker
    }

    const dropMarker = (row, col, marker)=>{
        // if the spot has been filled, ignore
        if(board[row][col] !== 0){return false}
        board[row][col] = marker
        console.table(board)
        return true
    }

    const getBoardSize = ()=>boardSize;

    startBoard()
    return {
        board, dropMarker, isFilled, getMarkers,
        isWin, getWinMarker, getBoardSize}
})()

function GameController(){
    let gameBoard = newGameBoard;
    let markers = newGameBoard.getMarkers();
    let playerOne = player("Ola1", markers[0]);
    let playerTwo = player("Ola2", markers[1]);
    let players = [playerOne, playerTwo];
    let currentPlayer = players[0];
    let gameOver = false;

    const switchPlayerTurn = ()=>{
        if(gameOver == true){return}
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
        console.log(`It is ${currentPlayer.name}'s turn`)
    }

    const getWinner = ()=>{
        if(gameBoard.isWin() == false){ return null}
        return players.filter((player)=>player.marker === gameBoard.getWinMarker())[0]
    }

    const checkGame = ()=>{
        if(gameBoard.isFilled() == true){
            gameOver = true;
        }
        let theWinner = getWinner();
        if(gameBoard.isWin() == true && theWinner != null){
            gameOver = true;
            theWinner.addPoint();
            console.log(`${theWinner.name} wins! Start new round.`)
        }
    }

    const playTurn = (theRow, theCol)=>{
        if(theRow > 2 || theCol > 2){return}
        if(gameOver == true){return}
        // if marker was dropped succesfully
        if(gameBoard.dropMarker(theRow, theCol, currentPlayer.marker)==true){
            checkGame()
            switchPlayerTurn()
        }
    }
    return {playTurn}
}

function player(name, marker){
    let points = 0;
    const getPoints = ()=>points;
    const addPoint = ()=>points++;
    return {name, marker, getPoints, addPoint}
}

// function domDisplayController(){

// }
const myGame = GameController()