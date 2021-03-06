(function($, undefined) {
    var self = {},
        game_name = null,
        game_id = null,
        name_button = $("#name-button");

    function computer_move(x,y) {
        $('.board td').each(function() {
            var square = $(this);
            var square_x = parseInt(square.data('x'),10);
            var square_y = parseInt(square.data('y'),10);
            if(x === square_x && y == square_y) {
                square.html("O");
            }
        });
    }

    // Register event handlers once the page is ready.
    function init() {
        $(document).ready(function() {
            $('#name').on('keyup blur',function(evt) {
                if(evt.target.value.length > 0) {
                    name_button.prop('disabled', false);
                    game_name = evt.target.value;
                } else {
                    name_button.prop('disabled', true);
                    game_name = null;
                }
            });

            $('.board td').click(function(evt) {
                var square = $(evt.target);
                var x = square.data('x');
                var y = square.data('y');

                if(square.text() === "") {
                    square.html('X');
                    make_move(x, y);
                }
            });

            $("#newGame").click(reset_board);

            name_button.click(start_game);
        });
    }

    function make_move(x,y) {
        var board = serialize_board();
        $.post("/api/make-move/", {
            board: board,
            game: game_id,
            x: x,
            y: y
        }, function(data) {
            if(data.state) {
                show_state(data.state);
            } else {
                computer_move(data.coordinates.x, data.coordinates.y);
            }
        });
    }

    function reset_board(evt) {
        $('.board td').each(function(){
            $(this).html('');
        });
        $("#state").html('');
    }

    function serialize_board() {
        var board = [
            [null,null,null],
            [null,null,null],
            [null,null,null]
        ];

        $(".board td").each(function() {
            var element = $(this);
            var x = parseInt(element.data('x'), 10);
            var y = parseInt(element.data('y'), 10);
            board[x][y] = element.text();
        });

        return board.toString();
    }

    function show_state(state) {
        $("#state").html(state + "!");
    }

    // Start the game by fetching the new game id from the server.
    function start_game() {
        name_button.prop('disabled', true);
        $.post('/api/new-game/', { name: game_name}, function(data) {
            game_id = data.id;
            $('.jumbotron').fadeOut("fast", function() {
                $(".player-name > span").text(game_name);
                $(".player-name").removeClass('hidden');
                $(".board").removeClass('hidden');
                $("#newGame").removeClass('hidden');
            });
        });
    }

    init();

    return self;
})(jQuery);