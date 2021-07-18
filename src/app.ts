import Loader from "./engine-dev/Loader";
import Game from "./Game";
import Screen from "./engine-dev/Screen";

import { SystemManager } from "@luna-engine/core";
import { Config } from "@luna-engine/utility";

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

const configMap = {
    screen: {
        width: 800,
        height: 800
    },
    system: {
        fps: 60
    }
}


new Loader(
    loadMap,
    () => {
        //Setup WebGL
        const config = new Config(configMap);
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);

        //Setup Window
        new Screen(canvas, config);

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