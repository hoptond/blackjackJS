


/*
 * Deals out cards until the score has been achieved or exceeded.
 *
 * @return int Returns the score the player ended up with.
 */
function deal() {
    var hand = []
    var deck = createDeck()
    var score = 0
    while(score < 21) {
        var card = deck[Math.floor(Math.random() * deck.length)];
        deck = removeCardFromDeck(deck, card)
        hand = addCardToHand(hand, card)
        score = getPoints(hand)
    }
    console.log(hand)
    return score;
}

/*
 * This function creates the standard deck of 52 playing cards. The deck is then shuffled before being returned.
 *
 * @return array Returns the newly created deck as an array of Cards.
 */
function createDeck() {
    var deck = []
    var suits = ["Clubs", "Spades", "Hearts", "Diamonds"]
    suits.forEach(function(suit) {
        for(var i = 2; i < 11; i++) {
            deck.push(suit + "_" + i);
        }
        deck.push(suit + "_" +"Ace")
        deck.push(suit + "_" + "King")
        deck.push(suit + "_" + "Queen")
        deck.push(suit + "_" + "Jack")
    })
    shuffle(deck)
    return deck
}


/*
 * Shuffles an array and returns it.
 * @param array An array containing the items.
 */
function shuffle(a) {
    var j, x, i
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = a[i]
        a[i] = a[j]
        a[j] = x
    }
    return a
}

/*
 * This function adds the card to a given deck. The deck is automatically sorted based upon the value of the card.
 *
 * @param deck The targeted deck of cards.
 * @param card The targeted card to remove.
 *
 * @return array Returns the the deck with the newly added card.
 */
function addCardToHand(deck, card) {
    if (deck.length == 0) {
        //echo 'inserted a card into the hand at position 0, hand was empty' . '<br>';
        deck.push(card)
        return deck
    }
    var insertValue = getCardValue(card)
    for (var i = 0; i < deck.length; i++) {
        if (insertValue < getCardValue(deck[i])) {
            deck.splice(i, 0, card)
            //echo 'inserted a card at position ' . i . ', hand is now:'. '<br>';
            return deck
        }
    }
    //echo 'inserted a card at end of collection, as the value is the highest so far:'. '<br>';
    deck.push(card)
    return deck;
}

/*
 * This function removes the given card from a deck.
 *
 * @param deck The targeted deck of cards.
 * @param card The targeted card to remove.
 *
 * @return array Returns the deck, sans the card that was removed.
 */
function removeCardFromDeck(deck, card) {
    if (deck.includes(card)) {
        for(var i = 0; i < deck.length; i++) {
            if(deck[i] === card) {
                deck.splice(i, 1)
            }
        }
    }
    return deck;
}

/*
 * Echoes the current string in a format the end user can understand.
 *
 * @param string card The card to be displayed;
 *
 * @return string Returns the string.
 */
function displayDrawnCard(card) {
    var values = card.split('_')
    return "Drew the " + values[1] + " of " + values[0] + "<br>";
}

/*
 * This function totals the points in a player's deck.
 *
 * @param array playerDeck The deck to total.
 *
 * @return int The total value of the player's deck.
 */
function getPoints(playerDeck) {
    score = 0;
    playerDeck.forEach(function(card) {
        score = parseInt(score) + parseInt(getCardValue(card, score))
    })
    return score;
}
/*
 * This function gets the value of a specific card. If it is a number card, the value is the number of a card. If it is a special card,
 * the value is either 11 if it is an Ace or 10 if it is not.
 *
 * @param string card The card to get the value of.
 * @param int score The current running score. By default, this score is 0.
 *
 * @return int Returns the value of the card.
 */
function getCardValue(card, score = 0) {
    //gets the initial value of this card by exploding the string and taking the second value, which is either a number or a string
    var val = card.split("_")[1];
    if (!isNaN(val)) {
        return parseInt(val);
    } else {
        if (val === "Ace") {
            if (score >= 11) {
                return 1
            }
            return 11
        } else {
            return 10
        }
    }
}


/*
 * This outputs a string to our HTML to inform the player who won.
 *
 * @param int aScore The first player's score.
 * @param int bScore The second player's score.
 *
 * @return string Returns the informational string.
 */
function displayWinner(aScore, bScore) {
    if (aScore > 21) {
        return "<br><br>Player one has lost!";
    }
    if (aScore == 21) {
        if (bScore == 21) {
            return "<br><br>" + "A draw. Everyone loses!";
        } else {
            return "<br><br>Player one has won!";
        }
    }
    if (bScore == 21) {
        return "<br><br>Player two has won!";
    }
    if (bScore > 21) {
        return "<br><br>Player two has lost!";
    }
    return "<br><br>Continue drawing cards...";
}