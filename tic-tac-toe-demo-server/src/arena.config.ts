import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";

import { TicTacToeRoom } from "./rooms/TicTacToeRoom";

export default Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        gameServer.define('tic_tac_toe_game_room', TicTacToeRoom);

    },

    initializeExpress: (app) => {
        app.get("/", (req, res) => {
            res.send("Server ready!");
        });

        app.use("/colyseus", monitor());
    },

    beforeListen: () => {
    }
});
