/*
 * Deals out cards until the score has been achieved or exceeded.
 *
 * @return int Returns the score the player ended up with.
 */
function deal(): int {
    $hand = array();
    $deck = createDeck();
    $score = 0;
    while($score < 21) {
        $key = array_rand($deck,1);
        $card = $deck[$key];
        $deck = removeCardFromDeck($deck, $card);
        echo displayDrawnCard($card);
        $hand = addCardToHand($hand, $card);
        var_dump($hand);
        echo '<br>';
        $score = getPoints($hand);
        echo $score . '<br>';
    }
    return $score;
}

/*
 * This function creates the standard deck of 52 playing cards. The deck is then shuffled before being returned.
 *
 * @return array Returns the newly created deck as an array of Cards.
 */
function createDeck(): array {
    $deck = array();
    $suits = array("Clubs", "Spades", "Hearts", "Diamonds");
    foreach($suits as $suit) {
        for($i = 2; $i < 11; $i++) {
            $deck[] = $suit . "_" . $i;
        }
        $deck[] = $suit . "_" ."Ace";
        $deck[] = $suit . "_" . "King";
        $deck[] = $suit . "_" . "Queen";
        $deck[] = $suit . "_" . "Jack";
    }
    shuffle($deck);
    return $deck;
}

/*
 * This function adds the card to a given deck. The deck is automatically sorted based upon the value of the card.
 *
 * @param deck The targeted deck of cards.
 * @param card The targeted card to remove.
 *
 * @return array Returns the the deck with the newly added card.
 */
function addCardToHand(array $deck, $card) : array {
    if (count($deck) == 0) {
        echo 'inserted a card into the hand at position 0, hand was empty' . '<br>';
        $deck[] = $card;
        return $deck;
    }
    $insertValue = getCardValue($card);
    for ($i = 0; $i < count($deck); $i++) {
        if ($insertValue < getCardValue($deck[$i])) {
            $insert = array($card);
            array_splice($deck, $i, 0, $insert);
            echo 'inserted a card at position ' . $i . ', hand is now:'. '<br>';
            return $deck;
        }
    }
    echo 'inserted a card at end of collection, as the value is the highest so far:'. '<br>';
    $deck[] = $card;
    return $deck;
}

/*
 * This function removes the given card from a deck.
 *
 * @param $deck The targeted deck of cards.
 * @param $card The targeted card to remove.
 *
 * @return array Returns the deck, sans the card that was removed.
 */
function removeCardFromDeck(array $deck, $card) : array {
    //there is probably a nicer way of doing this
    if (in_array($card, $deck)) {
        unset($deck[array_search($card, $deck)]);
    }
    return $deck;
}

/*
 * Echoes the current string in a format the end user can understand.
 *
 * @param string $card The card to be displayed;
 *
 * @return string Returns the string.
 */
function displayDrawnCard($card) : string {
    $values = explode("_", $card);
    return "Drew the " . $values[1] . " of " . $values[0] . "<br>";
}

/*
 * This function totals the points in a player's deck.
 *
 * @param array playerDeck The deck to total.
 *
 * @return int The total value of the player's deck.
 */
function getPoints(array $playerDeck): int {
    $score = 0;
    foreach($playerDeck as $card) {
        $score += getCardValue($card, $score);
    }
    return $score;
}
/*
 * This function gets the value of a specific card. If it is a number card, the value is the number of a card. If it is a special card,
 * the value is either 11 if it is an Ace or 10 if it is not.
 *
 * @param string $card The card to get the value of.
 * @param int $score The current running score. By default, this score is 0.
 *
 * @return int Returns the value of the card.
 */
function getCardValue($card, $score = 0): int {
    //gets the initial value of this card by exploding the string and taking the second value, which is either a number or a string
    $val = explode("_", $card)[1];
    if (is_numeric($val)) {
        return (int)$val;
    } else {
        if ($val === "Ace") {
            if ($score >= 11) {
                return 1;
            }
            return 11;
        } else {
            return 10;
        }
    }
}


/*
 * This outputs a string to our HTML to inform the player who won.
 *
 * @param int $aScore The first player's score.
 * @param int $bScore The second player's score.
 *
 * @return string Returns the informational string.
 */
function displayWinner($aScore, $bScore): string {
    if ($aScore > 21) {
        return "<br><br>Player one has lost!";
    }
    if ($aScore == 21) {
        if ($bScore == 21) {
            return "<br><br>" . "A draw. Everyone loses!";
        } else {
            return "<br><br>Player one has won!";
        }
    }
    if ($bScore == 21) {
        return "<br><br>Player two has won!";
    }
    if ($bScore > 21) {
        return "<br><br>Player two has lost!";
    }
    return "<br><br>Continue drawing cards...";
}
    ?>