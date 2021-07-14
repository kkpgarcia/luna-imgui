import Loader from "./engine-dev/Loader";
import Game from "./Game";
import Screen from "./engine-dev/Screen";

import { SystemManager } from "@luna-engine/core";

const loadMap = {
    textures: [
        "images.jpg",
        "test.png",
        "luna-logo.png"
    ],
    shaders: [
        "basic.shader",
        "transform.shader"
    ]
}


new Loader(
    loadMap,
    () => {
        //Setup WebGL
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);

        //Setup Window
        new Screen(canvas);

        //Start Systems
        let systemManager = new SystemManager();
        systemManager.Start();


        

        let game = new Game(canvas);
        game.Start();
    },
    (msg: string) => {
        console.error(msg);
    }
)