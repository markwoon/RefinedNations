// ==UserScript==
// @name         Refined Nations
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  UI tweaks for MaBi Web Nations
// @author       Mark Woon
// @match        http://www.mabiweb.com/modules.php?name=GM_Nations*
// @grant        GM_addStyle
// @noframes
// ==/UserScript==
/* jshint esversion: 6 */
let players = [];

// ---- START CUSTOMIZATIONS ----//
const showAllBoards = true;
const showHeader = false;
const hideChrome = true;
const movePersonalNotes = true;

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
if (!showHeader) {
    console.log('hiding header');
    GM_addStyle(`
#nations-gameheader {
  display: none;
}
`);
}

const header = document.getElementById('nations-gameheader');
if (header.innerHTML.match('Game finished')) {
    console.log('game over');
    return;
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

// get players, player levels, current player and round #
const match = header.innerHTML.match(/round\:\s*(<b>.*?<\/b>)\s*<br>(.*?)<br>/m);
if (!match) {
    console.error('CANNOT DETERMINE PLAYERS!');
    return;
}
const round = match[1];
const playerString = match[2];
let currentPlayer = playerString.match(/<b>(.+?)<\/b>/m)[1];
console.log('Current player is', currentPlayer);
const regex = />(\w+)(?:<\/b>)?( \(lv\. [1-4]\))?&nbsp;/gm
let rez;
const playerOrder = [];
const playerLevels = {};
while (rez = regex.exec(playerString)) {
    playerLevels[rez[1]] = rez[2];
    playerOrder.push(rez[1]);
}

if (playerLevels[username]) {
    // playing current game
    players[0] = username;
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

console.log(playerLevels);
console.log(players);


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

function addTrackSpacer() {
    const td = document.createElement('td');
    td.innerHTML = '&nbsp;&nbsp;';
    newTracksTable.push(td);
}

function addTrackCell(...content) {
    const td = document.createElement('td');
    content.forEach((n) => td.appendChild(n));
    newTracksTable.push(td);
}

const tracksTable = document.querySelector('#nations-tracks table tbody tr');
if (tracksTable) {
    const justice = tracksTable.children[0].children[0];
    const military = tracksTable.children[2].children[0];
    const science = tracksTable.children[4].children[0];
    let passTurn = '';
    if (tracksTable.children.length > 5) {
        passTurn = tracksTable.children[5].children[0];
    }

    // build status cell
    const statusTd = document.createElement('td');
    statusTd.style['text-align'] = 'center';
    statusTd.innerHTML = `<div style="margin: 0 8px 8px 4px;">${round}</div>`;
    if (passTurn) {
        console.log(passTurn.getAttribute('href'));
        statusTd.appendChild(passTurn);
        const spacer = document.createElement('span');
        spacer.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;';
        statusTd.appendChild(spacer);
    }

    // add reload page button
    const button = document.createElement('button');
    button.innerHTML = 'Reload Page';
    button.onclick = () => {
        console.log('clicked');
        window.location.href = gameUrl;
    };
    statusTd.appendChild(button);

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
if (tabList) {
    const size = tabList.children.length;
    for (let x = 0; x < size; x++) {
        const tab = tabList.children[x];
        const name = tab.children[0].innerHTML;
        if (playerLevels[name]) {
            const link = tab.children[0];
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
            div.appendChild(document.createTextNode(' ' + playerLevels[name]));
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
    recentActions.style.top = 0;
    recentActions.style.left = '1112px';
}

// re-configure player boards
const p1 = document.getElementById(players[0]);
if (p1) {
    console.log('Got P1');
    p1.style.display = 'block';
    addProductionTable(players[0], p1);
    if (movePersonalNotes) {
        const notesForm = document.querySelector('#personal_notes form');
        if (notesForm) {
            const textarea = document.querySelector('#personal_notes textarea');
            textarea.style.width = '300px';
            textarea.style.height = '300px';

            const div = document.createElement('div');
            div.appendChild(notesForm);
            div.style.position = 'absolute';
            div.style.left = '1070px';
            div.style.top = '130px';
            p1.appendChild(div);

            const tab = document.querySelector('#placeholder ul.tab li:last-child');
            if (tab) {
                console.log('removing personal notes tab');
                tab.parentNode.removeChild(tab);
            }
        }
    }

    if (showAllBoards) {
        for (let x = 5; x > 0; x--) {
            if (players[x]) {
                console.log('player', x, ':', players[x]);
                showBoard(p1, players[x]);
            }
        }
    }
}


function reorder(first, second) {
    second.parentNode.removeChild(second);
    first.parentNode.insertBefore(second, first.nextSibling);
}


function showBoard(p1, playerName) {
    const p = document.getElementById(playerName);
    if (p) {
        console.log('Got ', playerName);
        reorder(p1, p);
        p.style.display = 'block';
        addProductionTable(playerName, p);
    }
}


function addProductionTable(playerId, playerNode) {
    console.log('attempting to add production table for ', playerId);
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
            productionTable = productionTable.replace(/<TD><IMG/mg, '<TD style="font-size: 18;"><IMG style="position: relative;"');

            const div = document.createElement('div');
            div.innerHTML = productionTable;
            div.style.position = 'absolute';
            div.style.left = '1070px';
            div.style.background = '#fff';

            const table = div.children[0];
            table.style['text-align'] = 'center';

            playerNode.appendChild(div);
            console.log('...added');
        }
    }
}
