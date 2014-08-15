define(function () {
    return {
        "objects": {
            "OuterDoor": {
                'oncollision' : function (game) {
                    game.loadLevel('campus').then(function () {
                        
                    });
                },
                'onpick': function (game) {
                    game.loadLevel('campus').then(function () {

                    });
                }
            }
        }
    };
});