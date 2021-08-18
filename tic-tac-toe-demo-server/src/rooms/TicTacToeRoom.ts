import { Room, Client } from "colyseus";
import { TicTacToeRoomState } from "./schema/TicTacToeRoomState";

export class TicTacToeRoom extends Room<TicTacToeRoomState> {

  maxClients = 2;

  onCreate (options: any) {
    this.setState(new TicTacToeRoomState());
    this.onMessage("clicked", (client, message: TicTacToeRoomState) => {
      const newState = new TicTacToeRoomState();
      newState.action = message["action"];
      newState.playerId = message["playerId"];
      newState.turn = message["turn"];
      newState.index = message["index"];
      newState.board = message["board"].toString();
      this.broadcast("clicked", newState);
    });
  }

  onJoin(client: Client, options: any) {
    const newState = new TicTacToeRoomState();
    newState.action = "joined";
    newState.playerId = client.sessionId;
    newState.turn = this.clients.length === 1? 'X': 'O';
    newState.index = 0;
    this.broadcast("joined", newState);
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
