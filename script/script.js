/**
 * Tac a poition to make a move in the game
 * 
 * @param {int} id
 */
function tacPosition(id) {

    // Check if there is a winner
    if(document.getElementById('userWon').classList.contains('hidden') && document.getElementById('pcWon').classList.contains('hidden')) {

        // If position is not yes chosen by player or PC
        if(!document.getElementById('ttt-position-' + id).classList.contains('userChosen') 
            && !document.getElementById('ttt-position-' + id).classList.contains('pcChosen')
            && document.getElementById('userWon').classList.contains('hidden')) {


            // Tac the block to the player's color
            if(!document.getElementById('ttt-position-' + id).classList.contains('userChosen')) {
                document.getElementById('ttt-position-' + id).classList.add('userChosen');
            }

            document.getElementById('ttt-position-' + id).classList.add('userChosen');

            // Get id's of positions the user has chosen
            var userChosen = getChosenPositions('userChosen');
            
            // Check winnings
            var checkUserWinnings = checkWinnings(userChosen);
            if(checkUserWinnings == true) {
                document.getElementById('userWon').classList.remove("hidden");
            }

            // Get PC chosen positions
            var pcChosen = getChosenPositions('pcChosen');
            
            // Merge pcChosen and userChosen arrays
            var chosenTotal = userChosen.concat(pcChosen);

            // Check if there is a position left to tac
            if(chosenTotal.length != 9 && checkUserWinnings != true) {

                // corner- and center-positions
                var corners = Array(0,2,6,8);
                var centers = Array(1,3,5,7);

                var random = true;

                // check if the user has chosen an almost winning combination and choose the remaining position to block the win
                var pcChoice = checkIfAlmostWon(pcChosen, 'userChosen');       
                if(pcChoice !== false) {
                    random = false;
                    pcChosen.push(pcChoice);
                }
                
                // Check if the PC almost won and choose the winning position if true
                if(random === true) {
                    var pcChoice = checkIfAlmostWon(userChosen, 'pcChosen');
                    if(pcChoice !== false) {
                        random = false;
                        pcChosen.push(pcChoice);
                    }
                }

                // If the user has played his first move but it wasn't in the center, place the PC's first move in the center 
                if(userChosen.length == 1 && !document.getElementById('ttt-position-4').classList.contains('userChosen')) {
                    pcChoice = 4;
                    random = false;
                    pcChosen.push(pcChoice);
                }
                
                // Random roll
                if(random == true) {


                    // Let the OC choose random
                    var pcChoice = -1;
                    while(pcChoice < 0) {
                        // Roll a random number between 0 and 8
                        var randomRoll = Math.floor((Math.random() * 8));

                        // When user's first move is in the center, place the PC's first move in a corner
                        if(userChosen.length == 1 && document.getElementById('ttt-position-4').classList.contains('userChosen')) {
                            var randomRoll = corners[Math.floor((Math.random() * corners.length))];
                        }

                        // When user has made 2 moves
                        if(userChosen.length == 2) {
                            
                            // if user has first 2 moves in the corners, play randomly in a center. Else play in a corner 
                            if(corners.indexOf(userChosen[0]) !== -1 && corners.indexOf(userChosen[1]) !== -1) {
                                var randomRoll = centers[Math.floor((Math.random() * centers.length))];
                            } else {
                                var randomRoll = corners[Math.floor((Math.random() * corners.length))];
                            }
                        }

                        // Check if position is already chosen by player or pc
                        if(chosenTotal.indexOf(randomRoll) == -1) {
                            pcChoice = randomRoll;
                            pcChosen.push(randomRoll);
                            
                        }
                    }
                }
                
                // Check winnings
                if(checkWinnings(pcChosen) == true) {
                    document.getElementById('pcWon').classList.remove("hidden");
                }

                // Add pcChoice to the position on the board
                document.getElementById('ttt-position-' + pcChoice).classList.add('pcChosen');
            }

        }
    }
}



/**
 * Check if the user has almost won
 * 
 * @param {array} chosen
 * @param {string} className
 * 
 * @return {int|bool} 
 */
function checkIfAlmostWon(chosen, className) {

    if(chosen.length > 1) {
        // Get winCombinations
        var winCombinations = getWinCombinations();
        
        // Loop through winCombinations
        for(winComboCounter=0; winComboCounter < winCombinations.length; winComboCounter++) {
            
            var winCombination = winCombinations[winComboCounter];
            
            // Loop through winCombination
            for(winCheckCounter = 0; winCheckCounter < winCombination.length; winCheckCounter++) {

                for(userCounter = 0; userCounter < chosen.length; userCounter++) {
                                    
                    if(winCombination[winCheckCounter] == chosen[userCounter]) {
                        const winComboIndex = winCombination.indexOf(chosen[userCounter]);
                        winCombination.splice(winComboIndex, 1);
                    }
                }
                

                // If only 1 winPosition is left, there is a winChance, so block it
                if(winCombination.length == 1) {
                    
                    // Check that PC has NOT already played on that position
                    if(!document.getElementById('ttt-position-' + winCombination[0]).classList.contains(className)) {
                        return winCombination[0];
                    }
                }
            }
        }
    }

    return false;
}



/**
 * Get positions chosen of either pc or user
 * 
 * @param {string} className
 * @param {array} 
 * 
 * @returns {array}
 */
function getChosenPositions(className) {
    var chosen = document.getElementsByClassName(className);
    var chosenTotal = Array();
    for(i=0; i < chosen.length; i++) {
        chosenTotal.push(parseInt(chosen[i].id.replace('ttt-position-', '')));
    }
    return chosenTotal;
}


/**
 * Check if user or pc has won based on the chosen positions
 *  
 * @param {array} chosen
 * 
 * @returns {boolean}
 */
function checkWinnings(chosen) {

    // Get wincombinations
    var winCombinations = getWinCombinations();
    var win = false;

    // Check winnings if more than 2 positions are chosen
    if(chosen != null && chosen.length > 2) {
        
        chosen.sort();
        
        // Loop through winCombinations
        for(winComboCounter=0; winComboCounter < winCombinations.length; winComboCounter++) {
        
            if(chosen.indexOf(winCombinations[winComboCounter][0]) !== -1 && chosen.indexOf(winCombinations[winComboCounter][1]) !== -1 && chosen.indexOf(winCombinations[winComboCounter][2]) !== -1){
                win = true;
            }   
        }
    }
    return win;
}


/**
 * Get winning combinations
 * 
 * @returns {array}
 */
function getWinCombinations() {

    var winnings = Array();

    // Horizontal
    winnings.push(Array(0,1,2));
    winnings.push(Array(3,4,5));
    winnings.push(Array(6,7,8));

    // Verical
    winnings.push(Array(0,3,6));
    winnings.push(Array(1,4,7));
    winnings.push(Array(2,5,8));

    // Diagonal
    winnings.push(Array(0,4,8));
    winnings.push(Array(2,4,6));
    
    return winnings;
}