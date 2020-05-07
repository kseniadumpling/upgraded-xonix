# upgraded-xonix

All the things that you need to add to your page are written in the `widget.html`

Project are based on [p5.js library](https://p5js.org) and the game itself was written by this guy: https://github.com/madmaxeatfax/xonix .
Should say that code is not perfect and not really flexible.

Main file is `sketch.js`, you can change layout there. Also look at *submitInput()* method which send a POST request, you need to handel 
this on your side. Also you should update pics in `/assets`.

I'm still working on a leaderboard, will update this repo a little bit later. 

**!Warning** At this point `input` tags are disabled somehow. I dunno why, need time to investigate a problem and fix this bug
