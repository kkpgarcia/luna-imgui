import Game from "./Game";

export default class App
{
    constructor()
    {
        let canvas = document.createElement("canvas");
        document.body.appendChild(canvas);

        canvas.width = window.innerWidth; 
        canvas.height = window.innerHeight;

        let game = new Game(canvas);
        game.Start();
    }
}

new App();

