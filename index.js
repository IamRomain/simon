$(document).ready(function () {
    var score = 0;
    var memoryToGenerate = 1;
    var memorySelection = [];
    var memorySelectionCounter = 0;
    var userSelection = [];
    var userSelectionCounter = 0;
    var speed = 800;

    var matchingSelections;

    //    $('input').prop('disabled', true);



    $("button").on("click", function () {
        $('button').prop('disabled', true);

        //        launchCounter();
        startGame();
    });


    function launchCounter() {
        $('#counter').css('visibility', 'visible');
        countDown(3);

        function countDown(counter) {

            var func = setInterval(function () {
                document.getElementById("points").innerHTML = counter;
                counter--;

                if (counter < 0) {
                    startGame();
                    clearInterval(func);
                }
            }, 300);
        };
    }


    function startGame() {
        generateSequence();

        setTimeout(function () {
            displaySequence();
        }, speed);
    }

    function generateSequence() {
        $("#counter").text('Remember');

        for (var i = 0; i < memoryToGenerate; i++) {
            var rand = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
            if (rand == 1) {
                memorySelection.push("green");
            } else if (rand == 2) {
                memorySelection.push("red");
            } else if (rand == 3) {
                memorySelection.push("yellow");
            } else {
                memorySelection.push("blue");
            }
            console.log(memorySelection);
        }
    }


    function displaySequence() {
        var runSequence = setInterval(function () {
            console.log('score', score);
            console.log('speed', speed);

            if (score > 4) {
                speed = 600;
            } else if (score > 8) {
                speed = 400;
            } else if (score > 12) {
                speed = 200;
            } else if (score > 16) {
                speed = 150;
            }

            var colorToDisplay = memorySelection[memorySelectionCounter];
            console.log('colorToDisplay', colorToDisplay);

            $("#section-" + colorToDisplay).addClass("section-activated");
            setTimeout(function () {
                $("#section-" + colorToDisplay).removeClass("section-activated");
            }, 350);

            memorySelectionCounter++;
            if (memorySelectionCounter != memorySelection.length) {
                setTimeout(function () {
                    displaySequence();
                }, speed);
            } else {
                userSelection = [];
                $(".section").css("pointer-events", "none");
                clearInterval(runSequence);
                userSequence();
            }
            clearInterval(runSequence);
        }, 150);
    }


    function userSequence() {
        setTimeout(function () {
            $("#counter").text('Repeat');
            $(".section").css("pointer-events", "auto");
        }, 500);

        console.log('userSelection', userSelection);
        console.log('userSelectionLength', userSelection.length);
        console.log('memorySelectionLength', memorySelection.length);

        $("input[id*='section']").one("click", function (e) {
            $(this).addClass("section-activated");
            var section = $(this);
            setTimeout(function () {
                section.removeClass("section-activated");
            }, 350);
            userSelection.push(this.id.slice(8));
            userSelectionCounter++;
            check();
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        function check() {
            console.log('enter');

            compareSelections();
            if (matchingSelections == true) {
                console.log('enter 2');

                if (userSelectionCounter == memorySelection.length || userSelection.length == memorySelection.length) {
                    console.log('enter3');
                    nextRound();
                } else {
                    userSequence();
                }
            } else {
                gameOver();
            }
        }
    }

    function compareSelections() {
        for (i = 0; i < userSelection.length; i++) {
            if (memorySelection[i] == userSelection[i]) {
                userSelectionCounter = 0;
                matchingSelections = true;
            } else {
                matchingSelections = false;
            }
        }
    }

    function nextRound() {
        userSelection = [];
        userSelectionCounter = 0;
        memorySelectionCounter = 0;
        //            $(".section").css("pointer-events", "none");

        score++;
        $("#points").text(score);

        setTimeout(function () {
            startGame();
        }, 1000);
    }






    function gameOver() {
        console.log('t nul');
        userSelection = [];
        memorySelection = [];
        memorySelectionCounter = 0;
        userSelectionCounter = 0;

        $(".section").css("pointer-events", "none");
        return;
    }



    //
    //    function handleSpeed() {
    //        setTimeout(function () {
    //            runMemory = setInterval(playMemory, tempo);
    //        }, 1000);
    //
    //        userArray = [];
    //        memoryArrayCounter = 0;
    //        userArrayCounter = 0;
    //        newMemory();
    //        levelCount++;
    //
    //        switch (levelCount) {
    //            case 1:
    //            case 2:
    //            case 3:
    //            case 4:
    //                tempo = 1000;
    //                break;
    //            case 5:
    //                tempo = 700;
    //                break;
    //            case 9:
    //                tempo = 500;
    //                break;
    //            case 13:
    //                tempo = 300;
    //                break;
    //        }
    //        setTimeout(function () {
    //            runMemory = setInterval(playMemory, tempo);
    //        }, 1000);
    //    }
});
