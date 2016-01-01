This node script is designed to calculate the readability of a webpage (via the Flesch-Kinkaid metric)
It attempts to intelligently extract body text from the page - mainly
via the assumption that meaningful (non-navigational) text generally
comes in blocks longer than a sentence or so.
The idea is to run this on webtask.io, so we need to use only the
modules they support.


