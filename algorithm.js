//Declare a global variable
var data;
var fetching;

function setup() {
    //Initialize an empty array
    data = [];
}

//This function fetches the data from a website
function fetchData(url) {
    var XMLHttpRequest = require('xhr2');

    //Create a new XMLHttpRequest object which will be used for making HTTP requests from the browser
    fetching = new XMLHttpRequest();

    //Open a GET request to a website to obtain the file
    fetching.open("GET", url);

    //Send the request
    fetching.send();
}

//This function takes user input from the command line
function processUserInput() {
    //Utilize the prompt-sync library to take user input from the command line
    //Import the prompt-sync library
    const prompt = require('prompt-sync')();

    //Use the prompt function to get user input and split the user input into an array of characters
    var input = prompt("Input: ").split("");

    return input;
}

//This function identifies the ending sound of a word based on the position of certain letters
function identifyEndSound(input) {
    //Iterate through the 'input' array, starting from the second-to-last position
    for (var i = input.length - 2; i > -1; i--) {

        //Check if the letter in the last position is a letter 'y'
        if (input[i+1] == 'y') {
            //If so, set the 'index' variable to be the index of the last letter
            var index = i+1;
            //Break out of the for loop since the index already is obtained
            break;
        }

        //Check if the current letter is a vowel
        if (input[i] == 'a' || input[i] == 'e' || input[i] == 'i' || input[i] == 'o' || input[i] == 'u') {
            //Check if its previous letter is also a vowel
            if (input[i-1] == 'a' || input[i-1] == 'e' || input[i-1] == 'i' || input[i-1] == 'o' || input[i-1] == 'u') {
                //If its previous letter is a vowel, set the 'index' variable to be the index of that previous character
                var index = i-1;
                //Break out of the for loop since the index already is obtained
                break;
            }
            //If the current letter is a vowel and its previous letter is not, set the 'index' variable to be the index of the current letter
            var index = i;
            //Break out of the for loop since the index already is obtained
            break;
        }
    }

    //Initialize an array to store all the letters of the ending sound
    var end_sound = [];

    //Copy the letters from the 'input' array, starting from the index of 'index' + 1 to the end of the 'input' array, into the 'end_sound' array
    for (var i = 0; i < input.length - index; i++) {
        end_sound[i] = input[index + i];
    }

    //Return the 'end_sound' array
    return end_sound;
}

//This function checks if a word in the 'data' array ends with the identified sound
function checkWord(word, end_sound) {
    //Initialize the 'iterator' variable to keep track of a position in the 'end_sound' array
    var iterator = 0;

    for (var i = word.length - end_sound.length; i < word.length; i++) {
        //Check if the current letter matches with the corresponding letter in the 'end_sound' array
        if (word[i] == end_sound[iterator]) {
            //If the match is made, increment the iterator to move to the next letter in the 'end_sound' array
            iterator++;

            //Check if we have reached the end of a word
            if (i == word.length - 1) {
                //Adjust the index to check the letter preceding the starting position of the for loop
                i = word.length - end_sound.length - 1;

                //Check if that letter is a vowel
                if (word[i] == 'a' || word[i] == 'e' || word[i] == 'i' || word[i] == 'o' || word[i] == 'u') {                    
                    //If that word meets the conditions, it does not end with the identified ending sound
                    return false;
                }
                else {
                    //If that word does not meet the conditions, it ends with the identified ending sound
                    return true;
                }
            }
        }
        else {
            //If there is a mismatch, that word does not end with the identified ending sound
            return false;
        }
    }
}

//This function displays words from the 'data' array that end with the identified ending sound
function displayWord(end_sound) {
    //Initialize an empty 'word' array to store all the letters of that word 
    var word = [];

    //Iterate over each word in the 'data' array
    for (var i = 0; i < data.length; i++) {
        /* Divide a string of current word into an array of substrings. 
        This will produce an array containing all the letters in the current word which can be iterated through */
        //This new array gets assigned to the 'word' array
        word = data[i].split("");

        //Check if the current word ends with the identified ending sound using the CheckWord function
        if (checkWord(word, end_sound) == true){            
            //If so, display the current word
            console.log(data[i]);
        }
    }
}

function main() {
    const userInput = processUserInput();

    //Identify the ending sound of the input and store the return value inside the 'endingSound' variable
    const endingSound = identifyEndSound(userInput);

    //Display words from the 'data' array that end with the identified ending sound
    displayWord(endingSound);
}

fetchData("https://introcs.cs.princeton.edu/java/data/wordlist.txt");

//This function will execute when the request is completed successfully
fetching.onload = function() {
    setup();

    /* Divide a string of data into an array of substrings based on a newline character. 
    This will produce an array containing all the words which can be iterated through */
    //This new array gets assigned to the 'data' array
    data = fetching.responseText.split('\n');

    main();
}