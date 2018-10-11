var deck = createDeck()
var hands = []
hands.push([])
hands.push([])
updateDeckDisplay();



document.querySelectorAll('.deal').forEach(function (elem) {
    elem.addEventListener('click', function(e) {
        var hand = hands[parseInt(elem.parentNode.dataset.pid) - 1]
        deal(hand, deck)
        updateCardList(elem, hand)
        var points = getPoints(hand)
        updateScore(elem.parentNode.dataset.pid, points)
        //TODO: display winners and losers with text in a seperate div
        if(points > 21) {
            elem.parentNode.getElementsByTagName('h2')[0].style = 'color: red'
            hideAllButtons()
        } else if(points === 21) {
            elem.parentNode.getElementsByTagName('h2')[0].style = 'color: green'
            hideAllButtons()
        }
        updateDeckDisplay()
    })
    }
)

document.querySelectorAll('.stick').forEach(function (elem) {
        elem.addEventListener('click', function (e) {
            elem.parentNode.getElementsByTagName('h2')[0].style = 'color: blue'
            hideButtons(elem.parentNode.dataset.pid)
            //TODO: have this remove the stick button in the other player
        })
    }
)


document.querySelectorAll('ul').forEach(function (elem) {
        elem.addEventListener('click', function (e) {
            if(e.target.nodeName != 'BUTTON') {
                console.log(e.target)
                console.log('this tag is not a button so we get outta here')
                return
            }
            console.log('entered function')
            var handIndex = elem.parentNode.dataset.pid - 1
            console.log(handIndex)
            console.log(e.target.dataset.index)
            if(hands[handIndex][e.target.dataset.index].rank === 'Ace') {
                var card = hands[handIndex][e.target.dataset.index]
                card.switched = !card.switched
                updateScore(handIndex + 1, getPoints(hands[handIndex]))
                updateCardList(elem, hands[handIndex])
            }
        })
    }
)

function updateCardList(elem, hand) {
    var list = elem.parentNode.getElementsByTagName('ul')[0]
    list.innerHTML = "";
    for(var i = 0; i < hand.length; i++) {
        list.innerHTML += '<li>' + hand[i].rank  + ' of ' + hand[i].suit + ': ' + getCardValue(hand[i], 0) + '</li>'
        if(hand[i].rank === 'Ace') {
            list.innerHTML += '<button data-index="' + i + '" class="switch">Switch</button>'
        }
    }
}

function updateScore(pid, points) {
    var header = document.getElementsByClassName('player')[pid - 1]
    header.children[0].textContent = "Player " + pid + ": " + points
}


function hideButtons(pid) {
    document.querySelectorAll('.player button').forEach(function (elem) {
        if(elem.parentNode.dataset.pid == pid) {
            elem.style = 'display: none'
        }
    })
}

function hideAllButtons() {
    document.querySelectorAll('.player button').forEach(function (elem) {
        elem.style = 'display: none'
    })
}


function updateDeckDisplay() {
    document.querySelector('.deckinfo').textContent = "Cards in dealer's deck: " + deck.length;
}

/*
 * Deals out a single card to the player's deck from the given hand.
 *
 * @return int Returns the score the player ended up with.
 */
function deal(hand, deck) {
    var card = deck[Math.floor(Math.random() * deck.length)];
    deck = removeCardFromDeck(deck, card)
    hand = addCardToHand(hand, card)
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
            deck.push(card = {suit:suit, rank:i, switched:false})
        }
        deck.push(card = {suit:suit, rank:"Ace", switched:false})
        deck.push(card = {suit:suit, rank:"King", switched:false})
        deck.push(card = {suit:suit, rank:"Queen", switched:false})
        deck.push(card = {suit:suit, rank:"Jack", switched:false})
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
function getCardValue(card) {
    if (!isNaN(card.rank)) {
        return parseInt(card.rank);
    } else {
        if (card.rank === "Ace") {
            if (card.switched) {
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