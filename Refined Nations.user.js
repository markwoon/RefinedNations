// ==UserScript==
// @name         Refined Nations
// @namespace    http://tampermonkey.net/
// @version      2.3.2
// @description  UI tweaks for MaBi Web Nations
// @author       Mark Woon
// @match        http://www.mabiweb.com/modules.php?name=GM_Nations*
// @grant        GM_addStyle
// @grant        GM_notification
// @noframes
// ==/UserScript==
/* jshint esversion: 6 */
'use strict';
let players = [];

// ---- START CUSTOMIZATIONS ----//
// show all player boards?
const showAllBoards = true;
// if showing all player boards, should signed-in user's board be shown in turn order (true) or first (false)?
const showBoardsInPlayerOrder = false;
// show Nations header containing game and player information?
const showHeader = false;
// hide all extraneous UI?
const hideChrome = true;
// show signed-in user's personal notes beside player board?
const showPersonalNotes = true;
// enable reload?
const autoReload = false;
// if autoReload is enabled, how often page will be reloaded (in minutes)?
const reloadInterval = 5;

// customize player order here, or boards will be shown in turn order
players[0] = ''; // first player (logged-in player will always go first if they are playing in the current game)
players[1] = ''; // second player
players[2] = ''; // third player
players[3] = ''; // fourth player
players[4] = ''; // fifth player
players[5] = ''; // sixth player

// ---- END CUSTOMIZATIONS ----//

if (hideChrome) {
  console.log('hiding extraneous padding');
  GM_addStyle(`
body > table:first-of-type {
  display: none;
}
body > table:nth-of-type(3) {
  display: none;
}
body > table:nth-of-type(4) > tbody> tr:first-of-type > td:nth-of-type(1) {
  display: none;
}
body > table:nth-of-type(4) > tbody> tr:first-of-type > td:nth-of-type(2) {
  display: none;
}
body > table:nth-of-type(4) > tbody> tr:first-of-type > td:nth-of-type(3) {
  display: none;
}
body > table:nth-of-type(4) > tbody> tr:first-of-type > td:nth-of-type(5) {
  display: none;
}
#nations-game > hr {
  display: none;
}
#placeholder ul {
  margin: 1em 0 0 0;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}
`);
}

const header = document.getElementById('nations-gameheader');
if (header.innerHTML.match('Game finished')) {
  console.log('Game over...');
  return;
}

if (!showHeader) {
  console.log('hiding header');
  GM_addStyle(`
#nations-gameheader {
  display: none;
}
`);
}

const logoutLink = document.querySelector('a[href="modules.php?name=Your_Account&op=logout"]');
// get username
let username = '';
console.log(logoutLink);
if (logoutLink) {
  const welcomeText = logoutLink.parentNode.innerHTML;
  const match = welcomeText.match(/Welcome (\w+)!/);
  if (match) {
    username = match[1];
  }
  console.log('Username:', username);
}

// get game ID and URL
let url = window.location.href;
const urlMatch = url.match(/g_id=([0-9]+)/);
if (!urlMatch) {
  console.log('CANNOT DETERMINE GAME ID!');
  return;
}
console.log('Game ID:', urlMatch[1]);
const gameUrl = `http://www.mabiweb.com/modules.php?name=GM_Nations&g_id=${urlMatch[1]}&op=view_game_reset`;
console.log('URL:', gameUrl);

// get round #
const match = header.innerHTML.match(/round:\s*(<b>.*?<\/b>)\s*<br>(.*?)<br>/m);
if (!match) {
  console.error('CANNOT DETERMINE PLAYERS!');
  return;
}
const round = match[1];
const playerString = match[2];

// get current player
let currentPlayer = playerString.match(/<b>(.+?)<\/b>/m)[1];
console.log('Current player is', currentPlayer);

// get players and player levels
// player level will be empty in games where difficulty is set for everyone
const playerInfoRegex = />(\w+)(?:<\/b>)?( \(lv\. [1-4]\))?&nbsp;/gm
let rez;
const playerOrder = [];
const playerLevels = {};
while (rez = playerInfoRegex.exec(playerString)) {
  playerOrder.push(rez[1]);
  playerLevels[rez[1]] = rez[2];
}
console.log('player order:', playerOrder);
console.log(playerLevels);

const userIsPlaying = playerLevels.hasOwnProperty(username);
if (userIsPlaying) {
  console.log('Player is in this game!');
  if (!showBoardsInPlayerOrder) {
    console.log('Making player\'s board first');
    players[0] = username;
  }
}
// remove players not in current game
for (let x = 0; x < players.length; x++) {
  if (players[x]) {
    const idx = playerOrder.indexOf(players[x]);
    if (idx === -1) {
      players[x] = '';
    } else {
      playerOrder[idx] = '';
    }
  }
}
// remove empty player entries
players = players.filter((v) => v).concat(playerOrder.filter((v) => v));
console.log('board order:', players);


// player actions only available when it's the player's turn
let playerActions = document.querySelector('#nations-gameheader table');
if (playerActions) {
  const tds = playerActions.children[0].children[0];
  if (tds.children.length === 1) {
    playerActions = '';
  } else {
    // this appears when there are special actions to be taken (e.g. growth phase)
    const playerToken = tds.children[0];
    playerToken.parentNode.removeChild(playerToken);
    playerActions.style.border = 'solid red 4px';
    playerActions.style.margin = '0 0 0 16em';
    const links = document.querySelectorAll('#nations-gameheader table a img');
    links.forEach((l) => {
      l.style.border = 'solid blue 2px';
    });
  }
}

// move resource tracks into a main game div
const tracks = document.getElementById('nations-tracks');
if (tracks) {
  console.log('Moving resource tracks');
  tracks.parentNode.removeChild(tracks);
  const nationsBoard = document.getElementById('nations-board');
  nationsBoard.parentNode.insertBefore(tracks, nationsBoard.nextSibling);
  nationsBoard.style.height = '560';
  tracks.removeAttribute('style');
}


// re-configure tracks div
const newTracksTable = [];

const addTrackSpacer = () => {
  const td = document.createElement('td');
  td.innerHTML = '&nbsp;&nbsp;';
  newTracksTable.push(td);
};

const addTrackCell = (...content) => {
  const td = document.createElement('td');
  content.forEach((n) => td.appendChild(n));
  newTracksTable.push(td);
};

const tracksTable = document.querySelector('#nations-tracks table tbody tr');
if (tracksTable) {
  const justice = tracksTable.children[0].children[0];
  const military = tracksTable.children[2].children[0];
  const science = tracksTable.children[4].children[0];
  let passTurn;
  if (tracksTable.children.length > 5) {
    passTurn = tracksTable.children[5].children[0];
  }

  // build status cell
  const statusTd = document.createElement('td');
  statusTd.style['text-align'] = 'center';
  statusTd.innerHTML = `<div style="margin: 0 8px 8px 4px;">${round}</div>`;

  if (passTurn) {
    // add pass turn link
    passTurn.style.display = 'inline-block';
    passTurn.style.verticalAlign = 'top';
    passTurn.style.marginTop = '4px';
    passTurn.style.marginRight = '2em';
    statusTd.appendChild(passTurn);
  }

  // add reload page button
  const buttonDiv = document.createElement('div');
  buttonDiv.style.display = 'inline-block';
  const reloadButton = document.createElement('button');
  reloadButton.innerHTML = 'Reload Page';
  reloadButton.onclick = () => {
    window.location.href = gameUrl;
  };
  buttonDiv.appendChild(reloadButton);

  if (autoReload && userIsPlaying) {
    // add auto-reload indicator
    const reloadMsg = document.createElement('div');
    reloadMsg.style.fontSize = '8pt';
    reloadMsg.style.color = '#999999';
    reloadMsg.innerHTML = 'auto-reload enabled';
    buttonDiv.appendChild(reloadMsg);
  }

  statusTd.appendChild(buttonDiv);


  // build new tracks table
  newTracksTable.push(statusTd);

  const actions = document.getElementById('nations-actions');
  if (actions) {
    addTrackCell(actions);
    addTrackSpacer();
    addTrackCell(justice, military, science);
  } else {
    addTrackCell(justice);
    addTrackSpacer();
    addTrackCell(military);
    addTrackSpacer();
    addTrackCell(science);
  }

  // remove existing elements from track table
  while (tracksTable.firstChild) {
    tracksTable.removeChild(tracksTable.lastChild);
  }
  // and replace with new tracks
  newTracksTable.forEach((n) => tracksTable.appendChild(n));

  if (playerActions) {
    tracks.appendChild(playerActions);
  }
}

// add level and current player info to tabs
const tabList = document.querySelector('#placeholder ul');
const playerColors = {};
if (tabList) {
  const size = tabList.children.length;
  console.log('Adding levels and current player info to tabs');
  for (let x = 0; x < size; x++) {
    const tab = tabList.children[x];
    const name = tab.children[0].innerHTML;
    if (players.indexOf(name) !== -1) {
      const link = tab.children[0];
      playerColors[name] = link.style.color;
      tab.removeChild(link);

      const div = document.createElement('div');
      div.style.border = 'solid grey 1px';
      div.style.padding = '5px 25px';
      if (name === currentPlayer) {
        div.appendChild(document.createTextNode('* '));
      }
      link.style.border = 'none';
      link.style.padding = '0';
      div.appendChild(link);
      if (playerLevels[name]) {
        div.appendChild(document.createTextNode(' ' + playerLevels[name]));
      }
      tab.appendChild(div);
    }
  }
}

const nationsBoardImg = document.getElementById('nations-board_image');
if (nationsBoardImg) {
  console.log('Moving recent actions section');
  const recentActions = document.getElementById('recent_actions_right');
  console.log('Moving recent actions');
  reorder(nationsBoardImg, recentActions);
  recentActions.style.top = '0';
  if (players.length === 6) {
    recentActions.style.left = '1220px';
  } else {
    recentActions.style.left = '1112px';
  }
}

// re-configure player boards
const p1 = document.getElementById(players[0]);
if (p1) {
  console.log('Got P1');
  p1.style.display = 'block';
  addProductionTable(players[0], p1);

  if (showAllBoards) {
    for (let x = 5; x > 0; x--) {
      if (players[x]) {
        console.log('player', x, ':', players[x]);
        showBoard(p1, players[x]);
      }
    }
  }
}


if (autoReload && userIsPlaying) {
  console.log('Auto-reload enabled');
  if (currentPlayer === username) {
    console.log('...but it\'s your turn');
    if (window.location.href.indexOf('&reloaded=true') !== -1) {
      GM_notification(`It's your turn!`, 'Nations@Mabi Web', '', () => window.focus());
    }
  } else {
    if (reloadInterval > 0) {
      console.log(`Will reload in ${reloadInterval} minute${reloadInterval > 1 ? 's' : ''}`);
      setTimeout(() => { window.location.href = gameUrl + '&reloaded=true'; }, 60000 * reloadInterval);
    } else {
      console.log('Invalid reloadTimer value');
    }
  }
}


/**
 * Move `second` node after `first` node in DOM.
 */
function reorder(first, second) {
  second.parentNode.removeChild(second);
  first.parentNode.insertBefore(second, first.nextSibling);
}


/**
 * Makes a player's board visible.
 */
function showBoard(p1, playerName) {
  const p = document.getElementById(playerName);
  if (p) {
    console.log(`Showing ${playerName}'s board`);
    reorder(p1, p);
    p.style.display = 'block';
    addProductionTable(playerName, p);
  }
}


/**
 * Makes a player's production results visible.
 */
function addProductionTable(playerId, playerNode) {
  const nametag = document.createElement('div');
  nametag.style.position = 'absolute';
  nametag.style.left = '1070px';
  if (playerColors[playerId]) {
    nametag.style.color = playerColors[playerId];
  }
  nametag.innerHTML = `<b>${playerId}</b>`;
  playerNode.appendChild(nametag);

  console.log('Adding production results for ', playerId);
  let resources = document.querySelector('#' + playerId + ' img:last-of-type');
  if (!resources.onmouseover) {
    resources = playerNode.children[playerNode.children.length - 1];
  }
  if (resources.onmouseover) {
    const mouseOver = resources.getAttribute('onmouseover');
    const match = mouseOver.match(/(<TABLE.*<\/TABLE>)/m);
    if (match) {
      let productionTable = match[1];
      // strip out style because it's using JS escapes
      productionTable = productionTable.replace(/style=\\'.*?\\'/mg, '');
      productionTable = productionTable.replace(/<TD><IMG/mg, '<TD style="font-size: 14pt;"><IMG style="position: relative;"');

      const div = document.createElement('div');
      div.innerHTML = productionTable;
      div.style.position = 'absolute';
      div.style.top = '3em';
      div.style.left = '1070px';
      div.style.background = '#fff';

      const table = div.children[0];
      table.style['text-align'] = 'center';

      playerNode.appendChild(div);
      console.log('...added');
    }
  }
  if (playerId === username) {
    movePersonalNotes(playerNode);
  }
}

/**
 * Makes a user's personal notes visible.
 */
function movePersonalNotes(playerNode) {
  if (showPersonalNotes) {
    const notesForm = document.querySelector('#personal_notes form');
    if (notesForm) {
      const textarea = document.querySelector('#personal_notes textarea');
      textarea.style.width = '300px';
      textarea.style.height = '300px';

      const div = document.createElement('div');
      div.appendChild(notesForm);
      div.style.position = 'absolute';
      div.style.left = '1070px';
      div.style.top = '13em';
      playerNode.appendChild(div);

      const tab = document.querySelector('#placeholder ul.tab li:last-child');
      if (tab) {
        tab.parentNode.removeChild(tab);
      }
    }
  }
}
