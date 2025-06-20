const gameBoard = (function(){
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

    const getRowMatch = ()=>{
        let rowMatch = []
        for(let i = 0; i < boardSize; i++){
            rowMatch.push(board[i])
        }
        return rowMatch
    }

    const getColumnMatch = ()=>{
        let columnArray = []
        for(let i = 0; i < boardSize; i++){
            columnArray.push(i)
        }
        // Get values in each column
        const columns = columnArray.map(colIndex => board.map(row => row[colIndex]));
        return columns
    }

    const getDiagonalMatch = ()=>{
        const diagonals = [];
        let rightDiagonal = [];
        for(let i = 0; i < boardSize; i++){
            for(let j = 0; j < boardSize; j++){
                if(i==j){
                    rightDiagonal.push(board[i][j])
                }
            }
        }
        diagonals.push(rightDiagonal);
        let leftDiagonal = [];
        let iCount = 0;
        for(let i = 0; i < boardSize; i++){
            iCount++
            let jCount = 0;
            for(let j = boardSize-1; j >= 0; j--){
                jCount++;
                if(iCount==jCount){
                    leftDiagonal.push(board[i][j])
                }
            }
        }
        diagonals.push(leftDiagonal);
        return diagonals
    }

    const isWin = ()=>{
        let allMatches = [...getColumnMatch(),
            ...getRowMatch(), ...getDiagonalMatch()];
        for(let i = 0; i < allMatches.length; i++){
            let firstItem = allMatches[i][0];
            if(markers.includes(firstItem) &&
                (allMatches[i].every(item=>item === firstItem)) == true){
                winMarker = firstItem;
                return true
            }
        }
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

const GameController = (function(){
    // let gameBoard = gameBoard;
    let markers = gameBoard.getMarkers();
    let playerOne = null;
    let playerTwo = null;
    let players = [];
    let currentPlayer = null;
    let gameOver = false;
    let status = ""
    let scores = "";

    const getScores = ()=>scores;

    const getStatus = ()=>status;

    const switchPlayerTurn = ()=>{
        if(gameOver == true){return}
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
        status = `It is ${currentPlayer.name}'s turn`;
    }

    const setPlayers = (nameOne, nameTwo)=>{
        playerOne = player(nameOne, markers[0]);
        playerTwo = player(nameTwo, markers[1]);
        players.push(playerOne);
        players.push(playerTwo);
        currentPlayer = players[0];
    }
    const getWinner = ()=>{
        if(gameBoard.isWin() == false){ return null}
        return players.filter((player)=>player.marker === gameBoard.getWinMarker())[0]
    }

    const checkWinning = ()=>{
        let theWinner = getWinner();
        if(gameBoard.isWin() == true && theWinner != null){
            gameOver = true;
            theWinner.addPoint();
            status = `${theWinner.name} wins! Start new round.`;
            scores = `
            ${playerOne.name}: ${playerOne.getPoints()},
            ${playerTwo.name}: ${playerTwo.getPoints()}`
            currentPlayer = theWinner;
        }else{
            if(gameBoard.isFilled() == true){
                gameOver = true;
                status = "You draw! Start new round.";
                scores = `
                    ${playerOne.name}: ${playerOne.getPoints()},
                    ${playerTwo.name}: ${playerTwo.getPoints()}`
                currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
            }
        }
    }

    const setRound = ()=>{
        gameOver = false;
        currentPlayer = players[0];
        status = `It is ${currentPlayer.name}'s turn`;
        scores = ""

    }

    const playTurn = (theRow, theCol)=>{
        if(theRow > 2 || theCol > 2){return}
        if(gameOver == true){return}
        // if marker was dropped succesfully
        if(gameBoard.dropMarker(theRow, theCol, currentPlayer.marker)==true){
            checkWinning()
            switchPlayerTurn()
        }
    }
    return {
        setPlayers,
        playTurn, getScores, getStatus, setRound}
})()

function player(name, marker){
    let points = 0;
    const getPoints = ()=>points;
    const addPoint = ()=>points++;
    return {name, marker, getPoints, addPoint}
}

const domDisplayController = (function (){
    let scoresDiv = document.querySelector("#scores-div");
    let statusDiv = document.querySelector("#status-div");
    let boardDiv = document.querySelector("#board-div");
    let startRoundBtn = document.querySelector("#round-btn");
    let restartBtn = document.querySelector("#restart-btn");
    let startBtn = document.querySelector(".start-btn");
    let playerDiv = document.querySelector(".players-div");
    // let firstPlayerName
    let newGame = GameController;

    const getPlayersName = ()=>{
        let nameOne = document.querySelector("input[name='player-one']").value;
        let nameTwo = document.querySelector("input[name='player-two']").value;
        if(nameOne==null || nameTwo==null){
            return false
        }
        if(nameOne == nameTwo){
            return false
        }
        newGame.setPlayers(nameOne, nameTwo);
        return true
    }

    const startGame = ()=>{
        if(getPlayersName()==true){
            playerDiv.classList.add("hide");
            newGame.setRound();
            renderBoard()
        }
    }
    const showScores = ()=>{
        scoresDiv.textContent = newGame.getScores();
    }

    const showStatus = ()=>{
        statusDiv.textContent = newGame.getStatus();
    }
    const renderBoard = ()=>{
        boardDiv.innerHTML = "";
        let theBoard = gameBoard.board
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
        gameBoard.resetBoard();
        newGame.setRound();
        renderBoard();
    }
    startRoundBtn.addEventListener("click", cleanBoard);
    restartBtn.addEventListener("click", ()=>{
        window.location.reload()
    })
    startBtn.addEventListener("click", startGame)
})()
domDisplayController;