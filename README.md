# RefinedNations

[![GreasyFork](https://img.shields.io/badge/GreasyFork-3.1.1-green)](https://greasyfork.org/en/scripts/403128-refined-nations)

This is a userscript for Nations on MaBi Web.

Its goal is to maximize the amount of information displayed at once.  It will:

* Hide all extraneous UI/padding.
* Show all player boards at once (can customize board order; defaults to player's board first, followed by boards in turn order).
* Always display resource production/total vp information (normally only displayed when hovering over resources).
* Integrate personal notes next to player board.
* Adds a "Reload Page" button so you don't have to go back to the Game Manager when you finish your turn.

Additional features:

* Can be configured to auto-reload the page if it's your game.  This will enable you to get notifications when it's your turn.  This feature is disabled by default.
* Can be configured to send notifications to Slack to speed up real-time play.
* If you are playing multiple games at once, you can add game information into the settings panel to get a drop down menu of you games in the header.


<img src="images/nations.png" width="600" alt="Example game" />

To configure the script, go to the script's settings:

<img src="images/menu_settings.png" width="200" alt="Settings menu option" />

You should get a settings panel that looks like:

<img src="images/config.png" width="600" alt="Settings panel" />

This has only been tested in Chrome and Tampermonkey.

Suggestions/contributions welcome.



### Slack Integration

Refined Nations uses a Slack's `Incoming Webhook` integration to post to your Slack channel.  Follow [these instructions from Slack](https://api.slack.com/messaging/webhooks) to set it up, then copy the Webhook URL into the settings panel. 

If you want notifications with emojis, you'll have to add them to Slack.

| name | image |
| --- | --- |
| :food: | <img src="http://www.mabiweb.com/modules/GM_Nations/images/Token_Food.png" width="27" /> |
| :stone: | <img src="http://www.mabiweb.com/modules/GM_Nations/images/Token_Stone.png" width="27" /> |
| :gold: | <img src="http://www.mabiweb.com/modules/GM_Nations/images/Token_Gold.png" width="27" /> |
| :vp: | <img src="http://www.mabiweb.com/modules/GM_Nations/images/Token_Food.png" width="27" /> |
| :nations_book: | <img src="http://www.mabiweb.com/modules/GM_Nations/images/Token_Heritage.png" width="27" />|
| :meeple_blue: | <img src="http://www.mabiweb.com/modules/GM_Nations/images/Meeple_Blue.png" width="27" /> |
| :meeple_green: | <img src="http://www.mabiweb.com/modules/GM_Nations/images/Meeple_Green.png" width="27" /> |
| :meeple_orange: | <img src="http://www.mabiweb.com/modules/GM_Nations/images/Meeple_Orange.png" width="27" /> |
| :meeple_pink: | <img src="http://www.mabiweb.com/modules/GM_Nations/images/Meeple_Pink.png" width="27" /> |
| :meeple_purple: | <img src="http://www.mabiweb.com/modules/GM_Nations/images/Meeple_Purple.png" width="27" /> |
| :meeple_red: | <img src="http://www.mabiweb.com/modules/GM_Nations/images/Meeple_Red.png" width="27" /> |
| :meeple_yellow: | <img src="http://www.mabiweb.com/modules/GM_Nations/images/Meeple_Yellow.png" width="27" /> |
