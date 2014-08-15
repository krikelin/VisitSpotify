require.config({
    baseUrl: 'scripts/'
});

require(['game'], function (Game) {
    var game = new Game();
    game.loadLevel('LGR1102');
});