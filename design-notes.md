#Design Notes#

This idea maybe isn't the best fit for the webtask concept but its as good a toy project as any for learning about how the various components need to fit together.

##Modules:##

*For parsing html:*
[node-html-to-text](https://github.com/werk85/node-html-to-text)
- I would have preferred to use
  [node-unfluff](https://github.com/ageitgey/node-unfluff) but it's not
available on webtask.io
- I feel like the conventional approach would be to use something like jquery and try to identify the relevant elements in the DOM, but I can't actually think of a good way to generalise anything if I did it that way
  - The DOM approach would definitely be better if I wanted this to work on a specific site, e.g. Wikipedia
 
  
##Calculating Readability Scores##
- This involves a little more nlp-fu than I originally expected it would
- Counting words is the straightforward part
- Counting sentences is a lot harder than I thought, and for some reason none of the approaches I've tried so far have actually worked properly
- Counting syllables is definitely the most complex part, but the rough hacky approach I have at the moment is working better than I expected. Could still stand to be improved a bit though

##Security Concerns##
Possible attacks:
- Giving the task a URL to an unreasonably large file?
- Passing in a URL that does something malicious? Getting the task to make malicious requests (acting as a proxy basically)
 
I don't really want to try 'pentesting' this without permission, though from looking at the stuff in their repo they have probably considered these issues already and maybe taken measures to defend against them.


