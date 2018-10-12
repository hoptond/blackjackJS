var deck = createDeck()
var hands = []
hands.push([])
hands.push([])
var stick = []
stick.push(false)
stick.push(false)
updateDeckDisplay();


var lastCard;
var lastPlayer;
var lastCardID


document.querySelectorAll('.deal').forEach(function (elem) {
    elem.addEventListener('click', function(e) {
        var hand = hands[parseInt(elem.parentNode.dataset.pid) - 1]
        deal(hand, deck)
        updateCardList(elem, hand)
        updateScore(elem.parentNode.dataset.pid, getPoints(hand))
        determineWinner()
        updateDeckDisplay()
    })
    }
)

document.querySelectorAll('.stick').forEach(function (elem) {
        elem.addEventListener('click', function (e) {
            elem.parentNode.getElementsByTagName('h2')[0].style = 'color: blue'
            hideButtons(elem.parentNode.dataset.pid)
            hideButtonsOfType('stick')
            stick[parseInt(elem.parentNode.dataset.pid) - 1] = true
        })
    }
)

document.querySelectorAll('ul').forEach(function (elem) {
        elem.addEventListener('click', function (e) {
            if(e.target.nodeName != 'BUTTON') {
                return
            }
            var handIndex = elem.parentNode.dataset.pid - 1
            if(hands[handIndex][e.target.dataset.index].rank === 'Ace') {
                var card = hands[handIndex][e.target.dataset.index]
                card.switched = !card.switched
                updateScore(handIndex + 1, getPoints(hands[handIndex]))
                updateCardList(elem, hands[handIndex])
            }
        })
    }
)

function cardSlide() {
    console.log('animating')
    console.log(lastCard.style.left)
    var modifier = -40;
    if(lastPlayer == 1) {
        modifier = modifier - (modifier * 2)
    }
    lastCard.style.left = parseInt(lastCard.style.left.substring(0, lastCard.style.left.length - 2)) - modifier + 'px';
    if(lastCard.style.left == '0px') {
        console.log('stopping animation')
        cancelAnimationFrame(lastCardID)
        return
    }
    lastCardID = requestAnimationFrame(cardSlide)
}

function updateCardList(elem, hand) {
    var list = elem.parentNode.getElementsByTagName('ul')[0]
    var displayCard = document.createElement('li')
    var i = hand.length - 1;
    displayCard.dataset['suit'] = hand[i].suit
    displayCard.dataset['rank'] = hand[i].rank
    displayCard.classList.add(getCardColour(hand[i].suit))
    var topleft = document.createElement('p')
    displayCard.append(topleft)
    displayCard.children[0].classList.add('topleft')
    displayCard.children[0].textContent = getRankCharacter(hand[i].rank)
    var mid = document.createElement('p')
    displayCard.append(mid)
    displayCard.children[1].innerHTML = getSuitCharacter(hand[i].suit)
    var bottomright = document.createElement('p')
    displayCard.append(bottomright)
    displayCard.children[2].classList.add('bottomright')
    displayCard.children[2].textContent = getRankCharacter(hand[i].rank)
    list.append(displayCard)
    lastCard = displayCard;
    lastPlayer = (elem.parentNode.dataset.pid) - 1
    if(lastPlayer == 0)
        displayCard.style.left = '-1000px'
    if(lastPlayer == 1)
        displayCard.style.left = '1000px'
    lastCardID = requestAnimationFrame(cardSlide)
    if(hand[i].rank === 'Ace') {
        list.innerHTML += '<button data-index="' + i + '" class="switch">Switch</button>'
    }
}

function getCardColour(suit) {
    if (suit == 'Diamonds' || suit == 'Hearts') {
        return 'redcard'
    }
    return 'blackcard'
}

function getSuitCharacter(suit) {
    switch(suit) {
        case 'Diamonds': return "&diams;"
        case 'Spades': return "&spades;"
        case 'Hearts': return "&hearts;"
        default: return "&clubs;"
    }
}

function getRankCharacter(rank) {
    if(isNaN(rank)) {
        return rank.substring(0,1).toUpperCase()
    }
    return parseInt(rank)
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

function bust(score, hand) {
    if(score > 21) {
        //TODO: account for aces
        return true
    }
    return false
}

function hideButtonsOfType(buttonclass) {
    document.querySelectorAll('.player button').forEach(function (elem) {
        if(elem.classList.contains(buttonclass)) {
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
    var cid = 0;
    suits.forEach(function(suit) {
        for(var i = 2; i < 11; i++) {
            deck.push(card = {suit:suit, rank:i, switched:false, id:cid})
            cid++;
        }
        deck.push(card = {suit:suit, rank:"Ace", switched:false, id:cid})
        cid++;
        deck.push(card = {suit:suit, rank:"King", switched:false, id:cid})
        cid++;
        deck.push(card = {suit:suit, rank:"Queen", switched:false, id:cid})
        cid++;
        deck.push(card = {suit:suit, rank:"Jack", switched:false, id:cid})
        cid++;
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
    deck.push(card)
    if(card.rank == 'Ace' && getPoints(deck) > 21) {
        card.switched = true
    }
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


function determineWinner() {
    for(var i = 0; i < hands.length; i++) {
        var points = getPoints(hands[i])
        if (points == 21) {
            displayWinner(parseInt(i + 1))
            break
        } else if(bust(points, hands[i])) {
            console.log('player is bust')
            displayWinner(parseInt((1 - i) + 1))
            break
        }
        if(stick[i]) {
            if(points > getPoints(hands[i - i])) {
                displayWinner(parseInt((1 - i) + 1))
                break
            } else {
                displayWinner(parseInt(i + 1))
                break
            }
        }
    }
}



function hasCard(hand, suit, rank) {
    hand.forEach( function(card) {

        }
    )
    return false
}


function displayWinner(number) {
    hideAllButtons();
    document.getElementById('winner').textContent = 'Player ' + number + ' has won!'
}