import { Resource, AppCache, NotificationCenter, RenderingContext, Services, Config, SystemManager, Screen } from "luna-engine";
import Loader from "./engine-dev/Loader";
import Game from "./Game";
import ImguiSandbox from "./ImguiSandbox";



const loadMap = {
    textures: [
        "images.jpg",
        "test.png",
        "luna-logo.png"
    ],
    shaders: [
        "imgui.shader",
        "basic.shader",
        "transform.shader",
        "grid.shader",
        "text.shader"
    ]
}

const configMap = {
    screen: {
        width: 2000,
        height: 2000
    },
    system: {
        fps: 10
    }
}

//Move to a better loader
let resource = new Resource();
let appCache = new AppCache();
let notificationCenter = new NotificationCenter();
let renderingContext = new RenderingContext();

new Services(renderingContext, appCache, notificationCenter, resource);

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
        let systemManager = new SystemManager(config);
        systemManager.Start();

        let game = new Game(canvas);
        game.Start();

        let imguiSandbox = new ImguiSandbox(canvas);
        imguiSandbox.Start();
    },
    (msg: string) => {
        console.error(msg);
    }
)