(function (c) {
    if (BABYLON.Engine.isSupported()) {
        var canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(canvas, true);

        BABYLON.SceneLoader.Load("", "scenes/stockholm2012.babylon", engine, function (newScene) {
            // Wait for textures and shaders to be ready
            newScene.executeWhenReady(function () {
                console.log(arguments);
                // Attach camera to canvas inputs
                newScene.gravity = new BABYLON.Vector3(0, -2.81, 0);;
                newScene.collisionsEnabled = true;
                newScene.activeCamera.checkCollisions = true;
                newScene.activeCamera.applyGravity = true;  
                newScene.activeCamera.moveSensibility = 1 ;  
                newScene.activeCamera.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
                console.log(newScene);
                newScene.meshes.forEach(function (mesh) {
                    mesh.checkCollisions = true;
                    mesh.applyGravity = true;
                    console.log(mesh);
                });
                newScene.activeCamera.attachControl(canvas);

                // Once the scene is loaded, just register a render loop to render it
                engine.runRenderLoop(function() {
                    newScene.render();
                });
            });
        }, function (progress) {
            // To do: give progress feedback to user
        });
    }
})(this);