import { React, useState, useEffect } from "react"

import { Row, Col, Button, Modal } from "react-bootstrap"



// import { Button } from "bootstrap";






const Board = () => {


    class LinkedListNode {
        constructor(val) {
            this.value = val;
            this.next = null;

        }
    }

    class SinglyLinkedList {
        constructor(val) {

            const node = new LinkedListNode(val);
            this.head = node;
            // this.tail = node;

        }
    }

    const [board, setBoard] = useState(Createboard());
    const [snakeCell, setSnakeCell] = useState({ "55": 1 });
    const [foodCell, setFoodCell] = useState(36);
    const [poisonCell, setPoisonCell] = useState(-1);
    const [snake, setSnake] = useState(new SinglyLinkedList(55));
    const [show, setShow] = useState(false);
    const [score, setScore] = useState(0);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    var c = 0;


    function handleGameOver() {
        const audioEl = document.getElementsByClassName("audio-element")[1]
        audioEl.currentTime = 0;
        // audioEl.volume = 1;
        audioEl.play();
        setTimeout(() => {
            audioEl.pause();

        }, 120)
        clearInterval(setRef);

        localStorage.setItem("gameOver", JSON.stringify(true));
        handleShow();



    }

    function handleGameWon() {

    }

    function gameRestart() {
        console.log("hii i m game restart")
        // localStorage.setItem("gameOver", JSON.stringify(false));


        // localStorage.setItem("snakeCell", JSON.stringify({ "55": 1 }));
        // localStorage.setItem("foodCell", JSON.stringify(36));
        // localStorage.setItem("poisonCell", JSON.stringify(-1));
        handleClose();
        // localStorage.setItem("gameOver", JSON.stringify(false));



    }


    // increasing length of snake while eating food/poison
    function IncreaseHeadOnEating(dir) {
        var localStorageScore = JSON.parse(localStorage.getItem("score"));
        localStorage.setItem("score", JSON.stringify(localStorageScore + 4));
        var currHeadValue = snake.head.value;
        var currHeadRow = rowCol[String(currHeadValue)].row;
        var currHeadCol = rowCol[String(currHeadValue)].col;

        var { nextRow, nextCol, isValid } = nextHeadHandler(currHeadRow, currHeadCol, dir);
        if (isValid) {

            //    changing head of the linked list to the new head
            const nextHead = new LinkedListNode(board[nextRow - 1][nextCol - 1]);
            var currHead = snake.head;
            nextHead.next = currHead;
            snake.head = nextHead;
            var localStorageSnakeCell = JSON.parse(localStorage.getItem("snakeCell"));
            localStorageSnakeCell = { ...localStorageSnakeCell, [String(snake.head.value)]: 1 };
            if (Object.keys(localStorageSnakeCell).length == (12 * 14)) {
                handleGameWon();
            }
            localStorage.setItem("snakeCell", JSON.stringify(localStorageSnakeCell));





        }
        else {
            handleGameOver();
        }




    }


    // to take randomly whether to put poison or food

    function FoodOrPosionRandom() {

        var temp = Math.floor(Math.random() * 2) + 1;
        var Choice = (temp == 1) ? "food-cell" : "poison-cell";
        return temp;




    }

    // choosing grid to display food/poison randomly

    function FoodOrPoisonCell() {


        var localStorageSnakeCell = JSON.parse(localStorage.getItem("snakeCell"));

        var valueNew;

        // food/poison should not be on snake body
        while (true) {
            var row = Math.floor(Math.random() * 12) + 1;
            var col = Math.floor(Math.random() * 14) + 1;
            valueNew = board[row - 1][col - 1];

            if (String(valueNew) in localStorageSnakeCell)
                continue;
            break;
        }



        var Choice = FoodOrPosionRandom();


        if (Choice == 1) {
            localStorage.setItem("foodCell", JSON.stringify(valueNew));
            localStorage.setItem("poisonCell", JSON.stringify(-1));

            setFoodCell(valueNew);
            setPoisonCell(-1);

        }
        if (Choice == 2) {
            localStorage.setItem("foodCell", JSON.stringify(-1));
            localStorage.setItem("poisonCell", JSON.stringify(valueNew));

            setPoisonCell(valueNew);
            setFoodCell(-1);

        }



    }







    // To initiaze local storage only once at the restart and start of game 


    useEffect(() => {
        console.log("hii ");
        localStorage.setItem("snakeCell", JSON.stringify(snakeCell));
        localStorage.setItem("foodCell", JSON.stringify(foodCell));
        localStorage.setItem("poisonCell", JSON.stringify(poisonCell));
        localStorage.setItem("gameOver", JSON.stringify(false));
        localStorage.setItem("score", JSON.stringify(0));




    }, [c])





    // to change the background color the cell which is having snake body

    function cellType(cellValue) {

        var localStorageSnakeCell = JSON.parse(localStorage.getItem("snakeCell"));

        let temp = "";
        if (localStorageSnakeCell)
            temp = String(cellValue) in localStorageSnakeCell ? "snake-cell" : "";

        return temp;

    }



    // to find the row and col of the value of grid 
    const [rowCol, setRowCol] = useState(createRowCol());

    function createRowCol() {
        var temp = {};
        let counter = 1;
        for (let i = 1; i <= 12; i++) {

            for (let j = 1; j <= 14; j++) {

                temp[counter] = { "row": i, "col": j };
                counter++;
            }

        }

        return (temp);



    }

    // to create the board

    function Createboard() {


        let board = [];
        let counter = 1;
        for (let i = 0; i < 12; i++) {
            let rowOfBoard = [];
            for (let j = 0; j < 14; j++) {
                rowOfBoard.push(counter);

                counter++;
            }
            board.push(rowOfBoard);
        }


        return board;

    }

    // it will give what value should be incremented and value should be decremented from row and col while 
    // going to a particular direction

    const [direction, setDirection] = useState({ "37": [-1, 0], "38": [0, -1], "39": [1, 0], "40": [0, 1] });

    // it will provide rol and col and if it is valid(inside the grid or not ) of the next head

    function nextHeadHandler(row, col, dir) {

        let nextCol = col + direction[String(dir)][0];
        let nextRow = row + direction[String(dir)][1];
        let isValid = false;

        if (nextCol >= 1 && nextCol <= 14 && nextRow >= 1 && nextRow <= 12) {
            isValid = true;
            return { nextRow, nextCol, isValid };
        }
        return { nextRow, nextCol, isValid };


    }

    // reverse the direction of snake on poison eating

    function reverseDirection() {
        var currHead = snake.head;



        var prev = null;

        var next;

        while (currHead) {
            next = currHead.next;
            currHead.next = prev;
            prev = currHead;
            currHead = next;
        }

        snake.head = prev;

    }

    function newDirection() {
        var currHeadValue = snake.head.value;
        var headNextValue = snake.head.next.value;
        var currHeadRow = rowCol[String(currHeadValue)].row;
        var currHeadCol = rowCol[String(currHeadValue)].col;

        var headNextRow = rowCol[String(headNextValue)].row;
        var headNextCol = rowCol[String(headNextValue)].col;

        if (currHeadCol === headNextCol) {
            if (currHeadRow < headNextRow)
                return 38;
            if (currHeadRow > headNextRow)
                return 40;
        }
        if (currHeadRow === headNextRow) {
            if (currHeadCol < headNextCol)
                return 37;
            if (currHeadCol > headNextCol)
                return 39;
        }


    }

    let setRef = null;

    function moveSnakeHandler(keyNumber) {

        var dirc = keyNumber;
        setRef = setInterval(function moveSnake() {

            var currHeadValue = snake.head.value;
            var currHeadRow = rowCol[String(currHeadValue)].row;
            var currHeadCol = rowCol[String(currHeadValue)].col;

            var { nextRow, nextCol, isValid } = nextHeadHandler(currHeadRow, currHeadCol, dirc);
            if (isValid) {

                //    changing head of the linked list to the new head

                var localStorageSnakeCell = JSON.parse(localStorage.getItem("snakeCell"));

                if (String(board[nextRow - 1][nextCol - 1]) in localStorageSnakeCell) {
                    handleGameOver();
                }

                const nextHead = new LinkedListNode(board[nextRow - 1][nextCol - 1]);
                var currHead = snake.head;
                nextHead.next = currHead;
                snake.head = nextHead;


                // removing tail from the linked list
                currHead = snake.head;

                while (currHead.next.next) {
                    currHead = currHead.next;
                }

                var NodePrevToTail = currHead;
                var tailValue = currHead.next.value;
                NodePrevToTail.next = null;

                // adding value of the new node in localstorage for snakecell and removing tail value from it

                var localStorageSnakeCell = JSON.parse(localStorage.getItem("snakeCell"));
                delete localStorageSnakeCell[String(tailValue)];

                localStorageSnakeCell = { ...localStorageSnakeCell, [String(snake.head.value)]: 1 };
                localStorage.setItem("snakeCell", JSON.stringify(localStorageSnakeCell));

                var localStorageFoodCell = JSON.parse(localStorage.getItem("foodCell"));
                var localStoragePoisonCell = JSON.parse(localStorage.getItem("poisonCell"));


                // check whether the head is on food / poison or not if yes then work accordingly
                currHead = snake.head;
                if ((currHead.value === localStorageFoodCell) || (currHead.value === localStoragePoisonCell)) {

                    // console.log(audio.play());

                    const audioEl = document.getElementsByClassName("audio-element")[0]
                    audioEl.currentTime = 0;
                    audioEl.volume = 1;
                    audioEl.play();
                    setTimeout(() => {
                        audioEl.pause();

                    }, 500)


                    IncreaseHeadOnEating(keyNumber);
                    if (currHead.value === localStoragePoisonCell) {
                        reverseDirection();
                        console.log("New Head " + snake.head.value);
                        dirc = newDirection();
                    }
                    FoodOrPoisonCell();
                }



                console.log("I am snake Head " + snake.head.value);

                //  it will add new node of snake cell body to snakeCell Set and it also helps in rerendering the entire page
                // so it is rendering cellType function as well hence it will give green color to all those we are visiting
                setSnakeCell({ ...snakeCell, [String(snake.head.value)]: 1 });











            }
            else {

                handleGameOver();

            }
        }, 150);

    }



    // it will handle direction change of snake while pressing key

    useEffect(() => {






        // adding evenet listener whenever key get pressed
        window.addEventListener("keydown", (e) => {
            clearInterval(setRef);

            const keyNumber = e.keyCode;
            const validKey = String(keyNumber) in direction ? true : false;

            if (validKey) {



                var p = JSON.parse(localStorage.getItem("gameOver"));
                console.log(p);
                (p == false) && moveSnakeHandler(keyNumber);

            }



        })

    }, [])



    return (
        <div>

            <Modal show={show} animation={false}>

                <Modal.Body style={{ backgroundColor: "#b61515", textAlign: "center" }} >
                    <div>Oops! Game Over <i style={{ color: "yellow" }} class="fas fa-frown"></i></div>
                    <Button onClick={() => { window.location.reload(); }} className="restartButton">Restart Game</Button>
                </Modal.Body>

            </Modal>


            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>

                {/* https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3 */}
                {/* https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/CB.mp3 */}



                <audio className="audio-element" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3">

                </audio>
                <audio className="audio-element" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/CB.mp3">

                </audio>
                <Row style={{ width: "100vw" }}>

                    <Col sm={8}><div className={"whole_board"} >




                        {board.map((row, rowIndex) => {
                            return (
                                <Row className="board_row">
                                    { row.map((col, colIn) => {
                                        return (

                                            <Col key={col} className={cellType(col) != "" ? cellType(col) : "cell-design"}  >

                                                {col === foodCell ? <i fluid style={{ color: "red" }} class="fas fa-apple-alt fa-2x"></i> : col === poisonCell ? <i style={{ color: "#cf10cf" }} class="fas fa-bomb fa-2x"></i> : col === snake.head.value ? <i class="fas fa-eye"></i> : ""}
                                                {/* {col === snake.head.value ? "h" : col} */}
                                            </Col>


                                        );

                                    })}
                                </Row>

                            );
                        })}


                    </div></Col>
                    <Col sm={2} >
                        <h1 style={{ borderBottom: "2px solid white" }}>Score : {JSON.parse(localStorage.getItem("score"))}</h1>
                        <Row style={{ margin: "10px", borderBottom: "2px solid white" }}>
                            <Col sm={3}><i fluid style={{ color: "red" }} class="fas fa-apple-alt fa-2x"></i></Col>
                            <Col>Move Snake to the same direction</Col>
                        </Row>
                        <Row style={{ margin: "10px", borderBottom: "2px solid white" }}>
                            <Col sm={3}><i style={{ color: "#cf10cf" }} class="fas fa-bomb fa-2x"></i></Col>
                            <Col>Move Snake to the Reverse direction</Col>
                        </Row>
                        <Row style={{ textAlign: "left", margin: "10px", borderBottom: "2px solid white" }}>
                            <ul>
                                <li>
                                    Looping will kill.
                                </li>
                                <li>
                                    Banging to the wall will make him die.
                                </li>

                            </ul>

                        </Row>
                        <Row style={{ margin: "10px", borderBottom: "2px solid white" }}>
                            Bonus Tip:
                            <br></br>
                            Don't approach the Boundary food directly towards the Boundary, It can kill you 💀⚡

                        </Row>


                    </Col>
                </Row>


            </div >
        </div >
    )
}

export default Board
