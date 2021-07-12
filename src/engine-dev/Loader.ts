import { Resource, Directory, AppCache, CacheType } from "@luna-engine/utility";

export default class Loader
{
    private _loaderError = false;
    private _loadersCount = 0;
    private _progress = 0;
    private _currentLoaded = 0;

    constructor(loadMap: { textures, shaders }, onComplete: Function, onError: Function)
    {
        let loaderFunctions: Function[] = [];

        //Add textures
        let texLoaders = this.CreateLoaderArray(loadMap.textures, (name) => { 
            Resource.instance.GetImage(Directory.TEXTURE_DIR, name, (data: any) => {
                AppCache.instance.AddTexture(name, data);
            })
        });
        
        //Add shaders
        let shaderLoaders = this.CreateLoaderArray(loadMap.shaders, (name) => { 
            Resource.instance.GetText(Directory.SHADER_DIR, name, (data: string) => {
                AppCache.instance.AddShader(name, data);
            })
        }); 
 
        loaderFunctions = loaderFunctions.concat(texLoaders);
        loaderFunctions = loaderFunctions.concat(shaderLoaders);

        this._loadersCount = loaderFunctions.length;

        this.UpdateProgress();

        const loader = this.CreateLoaderPromise(loaderFunctions);

        loader.then(async (value: number) => {
            let delayedStart = () => {
                if (value == 0)
                {
                    //Sanity check for resources
                    const allLoaded = 
                        AppCache.instance.CheckContains(CacheType.TEXTURE, loadMap.textures) &&
                        AppCache.instance.CheckContains(CacheType.SHADER, loadMap.shaders);

                    if (allLoaded)
                    {
                        //Start Application
                        onComplete ? onComplete() : () => {};
                    }
                    else
                    {
                        onError ? onError("Some resources was not loaded.") : () => {};
                    }
                }
                else
                {
                    onError ? onError("Some resources had errors while loading.") : () => {};
                }
            };

            await (new Promise(((resolve, reject) => setTimeout(delayedStart, 1000))));
        })
    }

    private CreateLoaderArray(resource: string[], action: Function): Function[]
    {
        let retVal: Function[] = [];
        
        for (let i = 0; i < resource.length; i++)
        {
            retVal.push(() => action(resource[i]));
        }
        
        return retVal;
    }

    private CreateLoaderPromise(loaders: Function[]): Promise<number>
    {
        return new Promise((resolve, reject) => {
            if(!this._loaderError)
            {
                for (let i = 0; i < loaders.length; i++)
                {
                    const handler = loaders[i];
                    //TODO: Do reject checks here 
                    handler();
                    this._currentLoaded++;
                    this.UpdateProgress();
                }

                resolve(0);
            }
            else
            {
                reject(404);
            }
        });
    }

    private UpdateProgress(): void
    {
        this._progress = this._currentLoaded / this._loadersCount;
        console.log("Loading in progress: " + (this._progress * 100) + "%");
    }
}
