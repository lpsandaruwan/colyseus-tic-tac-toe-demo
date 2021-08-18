interface Props {
  result: string | null;
  handleRestart(): void;
}

const Finished = (props: Props) => {
  const { result, handleRestart } = props;
  return (
    <div>
      <h1>
        {result && `You ${result} the game!`}
        {!result && "It's a tie "}
      </h1>
      <button onClick={handleRestart}>Restart</button>
    </div>
  );
};

export default Finished;