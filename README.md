# Weblebrity Trumps

A site to compare Weblebrities based on social media and internt proliferation. 

## Fields for comparison

* Twitter followers
* LinkedIn connections
* Facebook friends
* Github Repos
* Lanyrd events spoken at (lanyrd?)
* Google Search results for name
* POWER (overall maths calculation)

(Possible future ideas - flickr, last.fm, instagram)

##User Journey
1. User lands on site
2. User gets assigned random selection of cards.
3. User is matched with opponents (virtual or real)
4. User chooses a fact/metric from first card
5. Person with highest/best metric wins a point
6. Card change to next card. 
7. Process repeats until one opponent gets max score.

##Technical 

###Data
* Node
* MongoDB for data persitence
* ‘cron’-like functionality for keeping data up-to-date access the google spreadsheet
* loop through URLs, update values
* have a URL to manually rebuild (force refresh) data - e.g. when adding someone to the list

###Front-end
 - websockets for playing live against another competitor
 - (or play against computer?)
 - list of 100 top people - google spreadsheet (or equivalent)
 - for the people featured on the cards, we need to regenerate stats every x hours
 - suggestion box for people to recommend more weblebrities
 - each time you get a random card
 - take it in turns to choose a metric, compare to see who wins/loses, keep a score
 - play 5/11 cards, or until someone leaves the game
 - (if one player leaves, player who stays on wins... and then can start a new game against a new random competitor)
 - CSS3 card animations/transitions to flip over card - http://css3playground.com/flip-card.php
 
 

## Links

Influential github users by location: <http://blog.nodejitsu.com/most-influential-github-users-by-location>

Google Spreadsheets & node:
<https://github.com/samcday/node-google-spreadsheets>