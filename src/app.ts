import Loader from "./engine-dev/Loader";
import Game from "./Game";

const loadMap = {
    textures: [
        "images.jpg",
        "test.png"
    ],
    shaders: [
        "basic.shader"
    ]
}


new Loader(
    loadMap,
    () => {
        let canvas = document.createElement("canvas");
        document.body.appendChild(canvas);

        canvas.width = window.innerWidth; 
        canvas.height = window.innerHeight;

        let game = new Game(canvas);
        game.Start();
    },
    (msg: string) => {
        console.error(msg);
    }
)