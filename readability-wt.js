/*
This is an attempt to create a webtask that will compute readability metrics for a page at a given URL. It's been done before, of course, so this is really more of a learning exercise. Results are currently not accurate.
*/

var request = require('request');
var nodeHTML = require('html-to-text');

//Everything that happens in a webtask happens in here
module.exports = function (context, cb) {
  // The url is passed into the webtask, either as a URL argument or a curl argument.
  if (!context.data.url) {
    console.log("No target URL provided");
    cb(null, {error: 'No URL provided or URL is not readable.'});
  } else {
    console.log('Target: ' + context.data.url);
  }
  request.get(context.data.url, function (error, response, body) {
    if (error)
    cb(error);
    else {
      text = nodeHTML.fromString(body, {wordwrap: false, ignoreHref: true, ignoreImage: true});
      var paragraphs = text.split('\n');
      console.log('Found ' + paragraphs.length + ' paragraphs in text.');
      wordcount = wordCount(text);
      // Anything less than 2 sentences is not a real paragraph.
      paragraphs = paragraphs.filter(function(x) {return sentenceCount(x) > 1});
      console.log(paragraphs.length + ' paragraphs remain after cull.');
      scores = paragraphs.map(function(x) { return fleschKincaid(x) });
      avgScore = scores.reduce(function(a, b) { return a + b; }, 0) / scores.length;
      console.log('Flesch-Kincaid Readability Score: ' + avgScore)
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
  split = split.filter(function(x) { return isWords(x) })
  return split.length;
}

/*Count sentences. This regex *seems* correct now but its always the first suspect if anything goes wrong.... */
function sentenceCount(text) {
  split = text.replace(/([.?!])\s*(?=[a-zA-Z])/g, '$1|').split('|'); // More intelligent sentence splitting based on [this answer](http://stackoverflow.com/a/18914855/3959735)
  split = split.filter(function(x){ return wordCount(x) > 1 }); //Single word sentences are probably some other trash.
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

/* Computes Flesch-Kincaid reading ease score */
function fleschKincaid(text) {
  avgSentenceLength = wordCount(text) / sentenceCount(text);
  avgSyllableWord = syllCount(text) / wordCount(text);
  // Formula from wikipedia. Hardcoded with magic numbers because it can't change obviously.
  score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllableWord);
  return score;
}

/* Checks that some text contains things that are probably words */
function isWords(text) {
  regex = new RegExp(/[a-zA-Z]/);
  return regex.test(text);
}
