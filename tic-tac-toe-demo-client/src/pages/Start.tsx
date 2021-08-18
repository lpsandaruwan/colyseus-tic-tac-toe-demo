import { useState, FormEvent } from "react";

interface Props {
  handleStart(players: string[]): void;
}

const Start = (props: Props) => {
  const { handleStart } = props;
  const [player, setPlayer] = useState(["", ""]);

  const handleInput = (event: FormEvent<HTMLInputElement>, index: number) => {
    setPlayer([event.currentTarget.value]);
  };

  const canStart = player.length === 1;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canStart) return;
    handleStart(player);
  };

  return (
    <div>
      <h1>Colyseus Tic Tac Toe</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="playerId">Player Name: </label>
          <input
            type="text"
            value={player[0]}
            onInput={(e) => handleInput(e, 0)}
          />
        </div>
        <div>
          <button type="submit" disabled={!canStart}>
            Start
          </button>
        </div>
      </form>
    </div>
  );
};
export default Start;
