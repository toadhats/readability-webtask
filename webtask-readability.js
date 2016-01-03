var request = require('request');
var nodeHTML = require('html-to-text');

//The skeleton of a webtask...
module.exports = function (context, cb) {
  // The url is passed into the webtask as data
  // Works via a curl argument, does it work via url query strings?
  request.get(context.data.url, function (error, response, body) {
    if (error)
      cb(error);
    else {
      text = nodeHTML.fromString(body, {wordWrap: false, ignoreHref: true, ignoreImage: true});
      var paragraphs = text.split('\n');
      console.log('Found ' + paragraphs.length + ' paragraphs in text.');
      wordcount = wordCount(text);
      //paragraphs = paragraphs.map(function(x){return nodeHTML.fromString(x)}) // Clearing up any leftover html tags
      paragraphs = paragraphs.filter(function(x) {return sentenceCount(x) > 1}); // Anything less than 2 sentences is not a real paragraph, and that may be too generous even?
      console.log(paragraphs.length + ' paragraphs remain after cull.');
      console.log(paragraphs);
      scores = paragraphs.map(function(x) { return fleschKincaid(x)});
      console.log(scores);
      avgScore = scores.reduce(function(a, b) { return a + b; }, 0) / scores.length;
      cb(null, {
        status: response.statusCode,
        score: avgScore
      });
    }
  });
}
/*Count words*/
function wordCount(text) {
  split = text.split(' ');
  split = split.filter(function(x) { return isWords(x)})
  return split.length;
}

/*Count sentences */
function sentenceCount(text) {
  split = text.split('. ');
  split.filter(function(x){return isWords(x)}); // Sanity check?
  split.filter(function(x){return wordCount(x) > 1}); //Single word sentences are probably some other trash.
  return split.length;
}

/* Syllable counting function adapted from http://stackoverflow.com/questions/5686483/how-to-compute-number-of-syllables-in-a-word-in-javascript */
function syllCount(text) {
  text = text.toLowerCase();
  if(text.length <= 3) return 1;
  text = text.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  text = text.replace(/^y/, '');
  return text.match(/[aeiouy]{1,2}/g).length;
}

/* Flesch-Kincaid reading ease score */
function fleschKincaid(text) {
  console.log(text);
  console.log('Sentences: ' + sentenceCount(text));
  console.log('Words: ' + wordCount(text));
  console.log('Syllables: ' + syllCount(text));
  avgSentenceLength = wordCount(text) / sentenceCount(text);
  console.log('ASL: ' + avgSentenceLength);
  avgSyllableWord = syllCount(text) / wordCount(text);
  console.log('ASW: ' + avgSyllableWord);
  score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllableWord); // Formula from wikipedia
  console.log('Score: ' + score)
  return score;
}
/* Checks that some text actually contains words */
function isWords(text) {
  regex = new RegExp(/[a-z]/i);
  return regex.test(text);
}

/*Checks if some text contains a period/full stop. One method I'm playing with for identifying meaningful text. */
//function containsPeriod
