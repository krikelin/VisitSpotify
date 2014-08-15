define(function () {
    var Game = function () {
        this.objects = {};
        this.playerData = {
            'objects': {}
        };
        if (BABYLON.Engine.isSupported()) {
            this.canvas = document.getElementById("renderCanvas");
            this.engine = new BABYLON.Engine(this.canvas, true);
        } else {
            throw "BABYLON engine not supported";
        }
        var self = this;
        this.engine.runRenderLoop(function() {
            if (self.scene instanceof Object)
            self.scene.render();

        });
    }; 

    /**
     * Set a flag in the game
     **/

    Game.prototype.set = function (key, value) {
        this.playerData[key] = value;
    }

    Game.prototype.save = function () {
        var data = JSON.stringify(this.playerData);
        localStorage.setItem('game.saveData', data);
    }

    Game.prototype.load = function () {
        var data = JSON.parse(localStorage.getItem('game.saveData'));
        this.playerData = data;
    };

    Game.prototype.loadLevel = function (level) {
        var self = this;

        if (self.scene) {
            self.scene.meshes.forEach(function (mesh) {
                if ('actionManager' in mesh)
                mesh.actionManager.actions = [];
            });
            self.engine.scenes = [];
            self.scene.activeCamera.detachControl(self.canvas);
        }
        var promise = new Promise(function (resolve, fail) {
    
            BABYLON.SceneLoader.Load("", "scenes/" + level + ".babylon", self.engine, function (newScene) {
                require(['scenes/' + level + '.js'], function (levelData) {
                    console.log("Scene", newScene);
                    console.log("engine", self.engine);
                    // Wait for textures and shaders to be ready
                    newScene.executeWhenReady(function () {
                        console.log(arguments);
                        self.scene = newScene;
                        // Attach camera to canvas inputs
                        newScene.gravity = new BABYLON.Vector3(0, -2.81, 0);;
                        newScene.collisionsEnabled = true;
                        newScene.activeCamera.checkCollisions = true;
                        newScene.activeCamera.maxZ = 2000;
                        newScene.activeCamera.applyGravity = true;  
                        newScene.activeCamera.moveSensibility = 1 ;  
                        console.log(BABYLON);
                        newScene.activeCamera.actionManager = new BABYLON.ActionManager(newScene);
                        newScene.activeCamera.ellipsoid = new BABYLON.Vector3(0.4, 0.7, 0.4);
                        console.log(newScene);
                        newScene.meshes.forEach(function (mesh) {
                            mesh.checkCollisions = true;
                            mesh.applyGravity = true;
                            if (mesh.name in levelData.objects) {
                                var obj = levelData.objects[mesh.name];
                                mesh.actionManager = new BABYLON.ActionManager(newScene);
                                console.log("Object", obj);
                                if ('oncollision' in obj && obj.oncollision instanceof Function) {
                                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                                        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                                        parameter: mesh
                                    }, function (e) {
                                            console.log(e);
                                        }
                                    ));
                                }
                                if ('onpick' in obj && obj.onpick instanceof Function) {
                                    console.log("F");
                                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                                        trigger: BABYLON.ActionManager.OnPickTrigger,
                                        parameter: mesh
                                    }, function (e) {
                                        console.log(e);
                                        obj.onpick.call(obj, self, arguments);
                                    }));
                                }
                            }
                        });
                        newScene.activeCamera.attachControl(self.canvas);
                        resolve(newScene);
                        self.scene = newScene;
                        // Once the scene is loaded, just register a render loop to render it
                        
                    });
                });
            }, function (progress) {
                // To do: give progress feedback to user
            });
        });
        return promise;
    }

    Game.prototype.start = function () {

    };
    return Game;
});