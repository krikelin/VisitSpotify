define(function () {
    return {
        "objects": {
            "OuterDoor": {
                'oncollision' : function (level, game) {
                    game.loadLevel('campus');
                }
            }
        }
    };
});