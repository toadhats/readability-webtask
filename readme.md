#readability-wt#

This node script is designed to calculate the readability of a webpage (via the Flesch-Kinkaid metric). It *attempts* to intelligently extract body text from the page - mainly via the assumption that meaningful (non-navigational) text generally comes in blocks longer than a sentence or so. The idea is to run this on webtask.io, so we need to use only the modules they support.

##Modules Used##
- [request](https://github.com/request/request)
 - Does exactly what it says on the tin.
- [node-html-to-text](https://github.com/werk85/node-html-to-text)
  - Lazy/concise way of stringifying and sanitising an html document, supported by webtask.
  - There's probably a better way but I lost too much time browsing the list of supported modules and just wanted to get to the interesting part 

##Issues##
- Currently gives results that are lower than other online Flesch-Kincaid calculators. Algorithms need fine-tuning.
- Still not eliminating all extraneous text. Need to look into how [node-unfluff](https://github.com/ageitgey/node-unfluff) handles this.

##What next?##
- Other readability metrics.
- Maybe return results in a more useful way.

  


