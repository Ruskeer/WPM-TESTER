const words = 'the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us is was are been has had were said did getting made find part world life still man company high every need feel three state never become between big here off same own under last right move thing general school another begin while number turn real leave might next sound below saw something thought both few those always looked show large often together asked house going want important until form food keep children feet land side without boy once animal enough took four head above kind began almost live page got earth far hand mother light country father let night picture being study second soon story since white ever paper hard near sentence better best across during today however sure means knew try told young sun whole hear example heard several change answer room sea against top turned learn point city play toward five himself usually money seen did car morning myself less let summer island music word either fact though water public put set end why ask stop yet pay issue kind service friend power hour game line member law community name president team minute idea body information parent face others level office door health person art war history party result reason research girl guy moment air teacher force education'.split(' ');

const wordsCount = words.length;
const gameTime = 30000; // 30 seconds in milliseconds

window.timer = null;
window.gamestart = null;
window.gameTime = gameTime;


// these keep track of the user's typing
let totalTyped = 0;
let correctTyped = 0;


// this 2 functions serves as to append another class name to existing class name
function addClass(el, name) {
    if (el) {
        el.className += ' ' + name;
    }
}

function removeClass(el, name) {
    if (el) {
        el.className = el.className.replace(name, '');
    }
}


// selects random word from words variable
function randomWord() {
    const randomIndex = Math.floor(Math.random() * wordsCount);
    return words[randomIndex];
}


// formats each letter from every word and separate each letter to span
function formatWord(word) {
    let lettersHTML = '';
    // creates an empty string where we will store all the letter spans

    for (let i = 0; i < word.length; i++) {
        lettersHTML += `<span class="letter">${word[i]}</span>`;
    }
    // puts all the letter spans together and returns them as one word

    return `<div class="word">${lettersHTML}</div>`;
}


// main function which displays the words in html
function newGame() {
    document.getElementById('words').innerHTML = '';
    // clears the old words from the previous game

    for (let i = 0; i < wordsCount; i++) {
        // repeats this for every word we want to display

        document.getElementById('words').innerHTML += formatWord(randomWord());
    }

    // user input of each letter which adds this classname current
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    // marks the first word and first letter as the current position

    window.timer = null;
    window.gamestart = null;

    // reset typing count
    totalTyped = 0;
    correctTyped = 0;
    // resets the typing statistics when a new game starts

    removeClass(document.getElementById('game'), 'over');
    // removes the over class so the game can be played again

    document.getElementById('info').innerHTML = '30';
    // displays the starting time
}


// gets the user's WPM
function getWpm() {

    // 5 characters is counted as 1 word
    const minutes = gameTime / 60000;
    // converts the 30-second game time from milliseconds into minutes

    const wpm = (totalTyped / 5) / minutes;
    // divides characters by 5 to get words, then divides by the time in minutes

    return Math.round(wpm);
    // rounds the WPM so we don't get decimal numbers
}


// gets the user's accuracy
function getAccuracy() {
    //
    if (totalTyped === 0) {
        //
        return 100;
    }
    //
    return Math.round((correctTyped / totalTyped) * 100);
    // divides correct characters by total characters and turns it into a percentage
}


// game over function
function gameOver() {

    const result = getWpm();
    const accuracy = getAccuracy();
    //
    clearInterval(window.timer);
    window.timer = null;
    //
    addClass(document.getElementById('game'), 'over');
    //
    document.getElementById('info').innerHTML =
        `WPM: ${result} | Accuracy: ${accuracy}%`;
}


// this function works when a user starts typing an input
document.getElementById('game').addEventListener('keyup', ev => {

    const key = ev.key;
    //
    const currentLetter = document.querySelector('.letter.current');

    // if there is no letter within innerHTML then we use space as default
    const expected = currentLetter?.innerHTML || ' ';
    //
    const isLetter = key.length === 1 && key !== ' ';
    const space = key === ' ';
    //
    const currentword = document.querySelector('.word.current');
    //
    const isBackspace = key === 'Backspace';
    //
    const isFirstLetter =
        currentLetter === currentword?.firstChild;


    // once game is over, block everything below from running
    if (document.querySelector('#game.over')) {
        return;
    }


    // starts the timer on the first letter typed
    if (!window.timer && isLetter) {

        // grab the exact moment typing started
        window.gamestart = new Date().getTime();
        //
        window.timer = setInterval(() => {
            //
            const currentTime = new Date().getTime();

            // how much time has passed
            const msPassed = currentTime - window.gamestart;

            // convert milliseconds to seconds
            const sPassed = Math.round(msPassed / 1000);

            // seconds left
            const sLeft = (window.gameTime / 1000) - sPassed;

            //
            if (sLeft <= 0) {

                gameOver();

                return;
            }

            //
            document.getElementById('info').innerHTML =
                sLeft + '';
            //
        }, 1000);
    }


    // if a letter was typed
    if (isLetter) {

        if (currentLetter) {

            // every typed letter counts toward WPM
            totalTyped++;

            // check if typed letter matches expected
            if (key === expected) {
                addClass(currentLetter, 'correct');
                correctTyped++;
            } else {
                addClass(currentLetter, 'incorrect');
            }

            // remove current from current letter
            removeClass(currentLetter, 'current');

            // move to the next letter
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current');
            }
        }
    }


    // if you pressed space
    if (space) {

        if (!currentword) {
            return;
        }


        // count the space as a typed character
        totalTyped++;


        // if expected isn't a space but a word then...
        if (expected !== ' ') {

            // grabs every letter inside the current word
            // that is NOT marked correct
            const lettersToInvalidate = [
                ...document.querySelectorAll(
                    '.word.current .letter:not(.correct)'
                )
            ];

            // mark those letters as incorrect
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            });

        } else {

            // space was pressed when the word was complete
            correctTyped++;
        }


        // save the next word before removing current
        const nextWord = currentword.nextSibling;


        // remove current from current word
        removeClass(currentword, 'current');


        // if the current letter still exists
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }


        // move to next word
        if (nextWord) {

            addClass(nextWord, 'current');

            // make first letter of next word current
            if (nextWord.firstChild) {
                addClass(nextWord.firstChild, 'current');
            }
        }
    }


    // if key pressed is backspace
    if (isBackspace) {
        //
        if (!currentword) {
            return;
        }


        // if we're at the beginning of the current word
        if (currentLetter && isFirstLetter) {

            const previousWord = currentword.previousSibling;

            // only go back if a previous word exists
            if (previousWord) {

                removeClass(currentword, 'current');

                addClass(previousWord, 'current');

                removeClass(currentLetter, 'current');

                addClass(previousWord.lastChild, 'current');

                removeClass(
                    previousWord.lastChild,
                    'incorrect'
                );

                removeClass(
                    previousWord.lastChild,
                    'correct'
                );
            }
        }


        // if we're somewhere in the middle of the current word
        if (currentLetter && !isFirstLetter) {
            //
            removeClass(currentLetter, 'current');
            //
            if (currentLetter.previousSibling) {
                //
                addClass(
                    currentLetter.previousSibling,
                    'current'
                );
                //
                removeClass(
                    currentLetter.previousSibling,
                    'incorrect'
                );
                //
                removeClass(
                    currentLetter.previousSibling,
                    'correct'
                );
            }
        }


        // if there is no current letter
        if (!currentLetter) {
            //
            if (currentword.lastChild) {
                //
                addClass(
                    currentword.lastChild,
                    'current'
                );
                //
                removeClass(
                    currentword.lastChild,
                    'incorrect'
                );
                //
                removeClass(
                    currentword.lastChild,
                    'correct'
                );
            }
        }
    }

    //
    console.log({
        key,
        expected,
        totalTyped,
        correctTyped
    });
});


// new game button
document.getElementById('newGamebtn').addEventListener("click", () => {
    gameOver();
    newGame();
});


newGame();