# RefinedNations

[![GreasyFork](https://img.shields.io/badge/GreasyFork-3.1.2-green)](https://greasyfork.org/en/scripts/403128-refined-nations)

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

Warning: this has only been tested in Chrome and Tampermonkey.

Suggestions/contributions welcome.



## Settings Panel

To configure the script, go to the script's settings:

<img src="images/menu_settings.png" width="200" alt="Settings menu option" />

You should get a settings panel that looks like:

<img src="images/config.png" width="600" alt="Settings panel" />



### Game Config

If you configure the games you're playing, React Nations will add a game menu to the header to allow you to easily switch between games.  It's currently capped at 5 games.

The syntax for the game is "`game id`:`name`".  The name is optional, but will make it much easier to identify which game is which.

What is the game id?  You can find it in the URL of the page:

<img src="images/gameid_url.png" alt="Game ID in URL" width="600" />

Or in the footer:  

<img src="images/gameid_footer.png" alt="Game ID in footer" width="600" />

Example:

![game 1 config](images/game1_config.png)

One you've added that, you'll see your games show up in the header:

<img src="images/game_menu.png" alt="Game menu in header" width="600" />



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
