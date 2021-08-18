import { useState, useEffect } from "react";
import { Client, Room } from "colyseus.js";

// global vars
const COLYSEUS_SERVER = process.env.REACT_APP_COLYSEUS_SERVER;
const GAME_ROOM: string = process.env.REACT_APP_GAME_ROOM ? process.env.REACT_APP_GAME_ROOM : "tic_tac_toe_game_room";
let playerId: string;
let turn: string;

interface ReturnValue {
  board: string[];
  status: string;
  result: string | null;
  handleClick: (index: number) => void;
  handleRestart: () => void;
  handleStart: (players: string[]) => void;
}

export default (): ReturnValue => {
  let [board, setBoard] = useState(Array(9).fill(""));
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState("created");
  const [players, setPlayers] = useState(["", ""]);
  const [roomInstance, setRoomInstance] = useState(new Room(""));
  const client = new Client(COLYSEUS_SERVER);

  useEffect(() => {
    if (status !== "started") return;
    const winningPositions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    let winningPositionsIndex = 0;
    let winner: string | null = null;

    while (winningPositionsIndex < winningPositions.length && !winner) {
      const boardPositionsToCheck = winningPositions[winningPositionsIndex];
      const boardValuesToCkeck = boardPositionsToCheck.map(
        (index) => board[index]
      );
      const checkingValue = boardValuesToCkeck[0];
      const isFinished = boardValuesToCkeck.every(
        (value) => value === checkingValue && checkingValue
      );
      winner = !isFinished ? null : checkingValue;
      winningPositionsIndex++;
    }
    if (winner) {
      let youWon: boolean = (winner === "X" && turn === "X") || (winner !== 'X' && turn !== 'X');
      setResult(youWon ? "won" : "lose");
      setStatus("finished");
      return;
    }

    setStatus(board.filter((value) => !value).length ? "started" : "finished");
  }, [board, players, status]);

  const handleClick = (index: number): void => {
    if (index < 0 || index > 9 || result) return;
    const newBoard = [...board];
    newBoard.splice(index, 1, turn);
    setBoard(newBoard);
    roomInstance.send('clicked', {
      "playerId": playerId,
      "turn": turn,
      "index": index,
      "action": "clicked",
      "board": newBoard
    })
  };

  const handleServerClickedMessage = (message: any): void => {
    if (message["index"] < 0 || message["index"] > 9 || result) return;
    if (message["playerId"] !== playerId) {
      const newBoard = message["board"].split(",");
      newBoard.splice(parseInt(message["index"]), 1, message["turn"]);
      setBoard(newBoard);
    }
  }

  const handleServerJoinedMessage = (message: any): void => {
    if (playerId === message["playerId"]) {
      turn = message["turn"];
    }
  }

  const handleStart = (players: string[]) => {
    try {
      client.joinOrCreate(GAME_ROOM).then(roomInstance_ => {
        roomInstance_.onMessage("clicked", handleServerClickedMessage);
        roomInstance_.onMessage("joined", handleServerJoinedMessage);
        setRoomInstance(roomInstance_);
        playerId = roomInstance_.sessionId;
        setStatus("started");
      });
    } catch (e) {
      console.error("join error", e);
    }
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(""));
    setResult("");
    setStatus("created");
  };

  return { board, status, result, handleClick, handleRestart, handleStart };
};
