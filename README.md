p4.twclak.biz
=============

CSCIE15 Final Project

1. The Game:

The objective of the game is to guess all the words that can be formed from the given random set of tiles.
Time for the game: 5:00 minutes.
Dictionary used: SCOWL dictionary which contains all words available in the dictionary for upto 10words.
                 SCOWL dictionary is available from http://wordlist.sourceforge.net/

2. The Database:

The Game consists of 26 tables on the server side, one for each of the alphabets e.g., Awords table has all the
words starting with A.
Each table has a key, word, len, sword fields.
                 key -- is an auto incrementing number.
                 word -- is the actual word in the SCOWL dictionary.
                 len -- is the length of the word.
                 sword -- is the word's letters sorted alphabetically in ascending order.
    e.g., a word like apple may be stored in the dictionary as follows:
                 word -- apple
                 len -- 5
                 sword -- aelpp

3. The server side logic:

The server side has a single function, which gets invoked when the user clicks on a easy 4 for example. The server side finds all the words
of length 3 & 4 by using the following logic:
   find a random word of length 4
   for that word, find all the tables that need to be referred (i.e., the unique set of alphabets in the word)
   for those tables, find the words of length 3 & length 4
   returns a JSON object back to browser

4. The Game UI design

The Game's UI design is based on html, jquery and Bootstrap CSS/JS.

4. The Game step by step:

a. Click on a button on top
   Easy 3 -- only words of size 3 are shown
   Easy 4 -- words of size 3 and 4 are shown
   Medium 5 -- words of size 3, 4 and 5 are shown
   Medium 6 -- words of size 3, 4, 5 and 6 are shown
   Tough 7 -- words of size 4, 5, 6 and 7 are shown
   Tough 8 -- words of size 5, 6, 7 and 8 are shown
   Difficult 9 -- words of size 6, 7, 8 and 9 are shown
   Difficult 10 -- words of size 7, 8, 9 and 10 are shown

b. You can play a word one of many ways:
   i. click on a non blank Your tiles to move to Game tiles
   ii. click on Game tiles to move to Play tiles
   iii. Type a-z or A-Z to move a tile from Your tiles to Game tiles
   iv. Type ESC to move all Game tiles to Your tiles
   v. Type ENTER to submit the Game Tiles

c. The goal, within 5 minutes is to guess all the words to earn maximal points
