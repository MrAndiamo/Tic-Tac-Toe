
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

                var random = true;
                if(userChosen.length > 1) {

                    // check if the user has chosen an almost winning combination
                    var pcChoice = checkIfAlmostWon(pcChosen, 'userChosen');       
                    if(pcChoice !== false) {
                        random = false;
                        pcChosen.push(pcChoice);
                    } else {
                        var pcChoice = checkIfAlmostWon(userChosen, 'pcChosen');        
                        if(pcChoice !== false) {
                            random = false;
                            pcChosen.push(pcChoice);
                        }
                    }
                }

                if(random == true) {
                    // Let the OC choose random
                    var pcChoice = -1;
                    while(pcChoice < 0) {
                        // Roll a random number between 0 and 8
                        var randomRoll = Math.floor((Math.random() * 8));

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
 * 
 * @param {array} userChosen 
 */
function checkIfAlmostWon(chosen, className) {

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
    return false;
}



/**
 * 
 * @param {string} className 
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
 * @returns {boolean}
 */
function checkWinnings(chosen) {

    var winCombinations = getWinCombinations();
    var win = false;

    if(chosen != null) {
                
        // Check winnings if more than 2 positions are chosen
        if(chosen.length > 2) {

            for(winCheckCounter=0; winCheckCounter < winCombinations.length; winCheckCounter++) {
            
                if(chosen.indexOf(winCombinations[winCheckCounter][0]) != -1 && chosen.indexOf(winCombinations[winCheckCounter][1]) != -1 && chosen.indexOf(winCombinations[winCheckCounter][2]) != -1){
                    win = true;
                }

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