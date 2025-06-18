const newGameBoard = (function gameBoard(){
    let boardSize = 3;
    let board = [];
    let markers = ["X", "O"]
    let winMarker = null;
    const startBoard = ()=>{
        for(let i = 0; i < boardSize; i++){
            let newRow = [];
            for(let j = 0; j < boardSize; j++){
                newRow.push("");
            }
            board.push(newRow);
        }
    }
    const getMarkers = ()=>markers

    const isFilled = ()=>{
        for(let i = 0; i < boardSize; i++){
            for(let j = 0; j < boardSize; j++){
                if(board[i][j] == ""){
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
        if(board[row][col] !== ""){return false}
        board[row][col] = marker
        return true
    }
    const resetBoard = ()=>{
        for(let i = 0; i < boardSize; i++){
            let newRow = board[i];
            for(let j = 0; j < boardSize; j++){
                newRow[j] = "";
            }
        }
    }

    const getBoardSize = ()=>boardSize;

    startBoard()
    return {
        board, dropMarker, isFilled, getMarkers,
        isWin, getWinMarker, getBoardSize, resetBoard}
})()

function GameController(){
    let gameBoard = newGameBoard;
    let markers = newGameBoard.getMarkers();
    let playerOne = player("Ola1", markers[0]);
    let playerTwo = player("Ola2", markers[1]);
    let players = [playerOne, playerTwo];
    let currentPlayer = players[0];
    let gameOver = false;
    let status = "";
    let scores = "";

    const getScores = ()=>scores;

    const getStatus = ()=>status;

    const switchPlayerTurn = ()=>{
        if(gameOver == true){return}
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
        status = `It is ${currentPlayer.name}'s turn`;
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
            status = `${theWinner.name} wins! Start new round.`;
            scores = `
            ${playerOne.name}: ${playerOne.getPoints()},
            ${playerTwo.name}: ${playerTwo.getPoints()}`
            currentPlayer = theWinner;
        }
    }

    const setRound = ()=>{
        gameOver = false;
        currentPlayer = players[0];
        status = `It is ${currentPlayer.name}'s turn`;

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
    return {playTurn, getScores, getStatus, setRound}
}

function player(name, marker){
    let points = 0;
    const getPoints = ()=>points;
    const addPoint = ()=>points++;
    return {name, marker, getPoints, addPoint}
}

function domDisplayController(){
    let scoresDiv = document.querySelector("#scores-div");
    let statusDiv = document.querySelector("#status-div");
    let boardDiv = document.querySelector("#board-div");
    let startRoundBtn = document.querySelector("#round-btn");
    let restartBtn = document.querySelector("#restart-btn");
    // let firstPlayerName
    let newGame = GameController()

    // const getPlayersName = ()=>{

    // }
    const showScores = ()=>{
        scoresDiv.textContent = newGame.getScores();
    }

    const showStatus = ()=>{
        statusDiv.textContent = newGame.getStatus();
    }
    const renderBoard = ()=>{
        boardDiv.innerHTML = "";
        let theBoard = newGameBoard.board
        for(let i = 0; i < theBoard.length; i++){
            for(let j = 0; j < theBoard.length; j++){
                let newBtn = document.createElement("button");
                newBtn.setAttribute("class", "play-btn");
                newBtn.addEventListener("click",()=>{
                    newGame.playTurn(i, j);
                    renderBoard();
                })
                newBtn.textContent=theBoard[i][j]
                boardDiv.appendChild(newBtn);
            }
        }
        showScores();
        showStatus();
    }
    const cleanBoard = ()=>{
        newGameBoard.resetBoard();
        renderBoard();
        newGame.setRound();
    }
    startRoundBtn.addEventListener("click", cleanBoard);
    restartBtn.addEventListener("click", ()=>{
        //reload page
    })
    renderBoard()
}
domDisplayController()