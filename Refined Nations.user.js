// ==UserScript==
// @name         Refined Nations
// @version      3.1.1
// @description  UI tweaks for MaBi Web Nations
// @match        http://www.mabiweb.com/modules.php?name=GM_Nations*
// @author       Mark Woon
// @namespace    https://github.com/markwoon/
// @supportURL   https://github.com/markwoon/RefinedNations
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @noframes
// ==/UserScript==
/* jshint esversion: 6 */
/* global GM_config, RefinedNationsConfig */
'use strict';

/**
 * GM_config save callback to close settings panel and reload page to apply changes.
 */
const onSaveConfig = () => {
  GM_config.close();
  window.location.href = gameUrl;
}

/**
 * Initialize config.
 */
GM_config.init({
  id: 'RefinedNationsConfig',
  title: 'Refined Nations Config',
  fields: {
    hideChrome: {
      section: 'UI',
      label: 'Hide Extraneous UI',
      labelPos: 'left',
      type: 'checkbox',
      default: true,
    },
    hideHeader: {
      label: 'Hide Game Header',
      type: 'checkbox',
      default: true,
      title: 'Hides the Nations game header containing player info.',
    },
    showPersonalNotes: {
      label: 'Relocate Personal Notes',
      type: 'checkbox',
      default: true,
      title: 'Move personal notes from tab and place next to player board.'
    },

    autoReload: {
      section: [
        'Auto-Reloading',
        'If you are a player in the game, this will auto-reload the page.  When it is your turn, you will get a browser notification.',
      ],
      label: 'Enable Auto-Reloading',
      labelPos: 'left',
      type: 'checkbox',
      default: false,
    },
    reloadInterval: {
      label: 'Interval (minutes)',
      labelPos: 'left',
      type: 'unsigned int',
      size: 2,
      default: 5,
      title: 'Interval between reloads',
    },

    showAllBoards: {
      section: 'Player Boards',
      label: 'Show All Boards',
      labelPos: 'left',
      type: 'checkbox',
      default: true,
    },
    showBoardsInPlayerOrder: {
      label: 'Show My Board In Player Order',
      type: 'checkbox',
      default: false,
      title: 'By default, your board will always be first.  Enabling this will place your board in turn order.'
    },

    player1: {
      section: [
        'Board Order',
        'This controls the ordering of player boards when showing all boards.  Do not include yourself in this list.  ' +
        'Listed players that are not in the game will be ignored.  ' +
        'Players in the game that are not listed will have their boards displayed in turn order.'
      ],
      label: 'Player',
      labelPos: 'left',
      type: 'text',
      default: '',
    },
    player2: {
      label: 'Player',
      type: 'text',
      default: '',
    },
    player3: {
      label: 'Player',
      type: 'text',
      default: '',
    },
    player4: {
      label: 'Player',
      type: 'text',
      default: '',
    },
    player5: {
      label: 'Player',
      type: 'text',
      default: '',
    },
    player6: {
      label: 'Player',
      type: 'text',
      default: '',
    },
    //
    game1Id: {
      section: [
        'Games',
        'This section facilitates playing multiple games at a time.'
      ],
      label: 'Game 1',
      labelPos: 'left',
      type: 'text',
      default: '',
      title: 'Format = "Game ID:Game Name"',
    },
    game1Slack: {
      label: 'Slack Webhook',
      type: 'text',
      default: '',
      size: 40,
      title: 'The Slack Webhook URL to post to whenever you complete your move',
    },
    //
    game2Id: {
      label: 'Game 2',
      labelPos: 'left',
      type: 'text',
      default: '',
      title: 'Format = "Game ID:Game Name"',
    },
    game2Slack: {
      label: 'Slack Webhook',
      type: 'text',
      default: '',
      size: 40,
      title: 'The Slack Webhook URL to post to whenever you complete your move',
    },
    //
    game3Id: {
      label: 'Game 3',
      labelPos: 'left',
      type: 'text',
      default: '',
      title: 'Format = "Game ID:Game Name"',
    },
    game3Slack: {
      label: 'Slack Webhook',
      type: 'text',
      default: '',
      size: 40,
      title: 'The Slack Webhook URL to post to whenever you complete your move',
    },
    //
    game4Id: {
      label: 'Game 4',
      labelPos: 'left',
      type: 'text',
      default: '',
      title: 'Format = "Game ID:Game Name"',
    },
    game4Slack: {
      label: 'Slack Webhook',
      type: 'text',
      default: '',
      size: 40,
      title: 'The Slack Webhook URL to post to whenever you complete your move',
    },
    //
    game5Id: {
      label: 'Game 5',
      labelPos: 'left',
      type: 'text',
      default: '',
      title: 'Format = "Game ID:Game Name"',
    },
    game5Slack: {
      label: 'Slack Webhook',
      type: 'text',
      default: '',
      size: 40,
      title: 'The Slack Webhook URL to post to whenever you complete your move',
    },

    slackDisplayName: {
      section: [
        'Slack',
        'This is only used if you have Slack configured above.  These settings apply to all games.',
      ],
      label: 'Display Name',
      labelPos: 'left',
      type: 'string',
      default: '',
      title: 'The name to use when announcing your move.  Defaults to Mabi Web user ID if not specified.'
    },
    slackDescriptiveMove: {
      label: 'Descriptive Moves',
      type: 'checkbox',
      default: false,
      title: 'Detail move in message'
    },
    slackEmojis: {
      label: 'Use Emojis',
      type: 'checkbox',
      default: false,
      title: 'Use emojis.  Requires Nations emojis to be installed.'
    },

  },
  events: {
    save: onSaveConfig,
  },
  css: `
#RefinedNationsConfig_header.config_header.center {
  padding: 0;
}
#RefinedNationsConfig .center {
  text-align: inherit;
  padding: 4px;
}
#RefinedNationsConfig .section_desc {
  border: none;
  margin: 0;
}
#RefinedNationsConfig .section_header_holder {
  margin-top: 1em;
}
#RefinedNationsConfig .section_header_holder > div:nth-of-type(2) {
  margin-top: 0.5em;
}
[type="checkbox"] {
  vertical-align: middle;
}
`,
});
// noinspection JSUnresolvedFunction
GM_registerMenuCommand('Refined Nations Settings', () => {
  GM_config.open();
  RefinedNationsConfig.style.maxHeight = '58em';
  RefinedNationsConfig.style.maxWidth = '35em';
});



if (GM_config.get('hideChrome')) {
  console.log('hiding extraneous padding');
  // noinspection JSUnresolvedFunction
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



// don't continue if game is over
const header = document.getElementById('nations-gameheader');
if (header.innerHTML.match('Game finished')) {
  console.log('Game over...');
  // noinspection JSAnnotator
  return;
}

// get game ID and URL
// it is sometimes unavailable, and we don't want to continue if that's the case
const urlMatch = window.location.href.match(/g_id=([0-9]+)/);
if (!urlMatch) {
  console.log('CANNOT DETERMINE GAME ID!');
  // noinspection JSAnnotator
  return;
}
const gameId = urlMatch[1];
console.log('Game ID:', gameId);
const gameUrl = `http://www.mabiweb.com/modules.php?name=GM_Nations&g_id=${gameId}&op=view_game_reset`;
console.log('Reload URL:', gameUrl);



if (GM_config.get('hideHeader')) {
  console.log('hiding header');
  // noinspection JSUnresolvedFunction
  GM_addStyle(`
#nations-gameheader {
  display: none;
}
`);
}



// get username
let username = '';
const logoutLink = document.querySelector('a[href="modules.php?name=Your_Account&op=logout"]');
if (logoutLink) {
  // noinspection JSUnresolvedVariable
  const welcomeText = logoutLink.parentNode.innerHTML;
  const match = welcomeText.match(/Welcome (\w+)!/);
  if (match) {
    username = match[1];
  }
  console.log('Logged in as', username);

  const menu = loadGameMenu();
  if (menu) {
    const tr = logoutLink.parentNode.parentNode.parentNode.parentNode;
    tr.children[0].width = '35%';
    tr.children[1].width = '50%';
    tr.children[2].width = '15%';
    const node = document.createElement('span');
    node.innerHTML = '<b style="margin-left: 4em;">Games:&nbsp;</b>';
    node.appendChild(menu);
    tr.children[0].appendChild(node);
  }
}


// get round #
const match = header.innerHTML.match(/round:\s*(<b>.*?<\/b>)\s*<br>(.*?)<br>/m);
if (!match) {
  console.error('CANNOT DETERMINE PLAYERS!');
  // noinspection JSAnnotator
  return;
}
const round = match[1];
const playerString = match[2];

// get current player
let currentPlayer = playerString.match(/<b>(.+?)<\/b>/m)[1];
console.log('Current player is', currentPlayer);

// get player order and levels
// player level will be empty in games where difficulty is set for everyone
const playerOrder = [];
const playerLevels = {};
const playerInfoRegex = />(\w+)(?:<\/b>)?( \(lv\. [1-4]\))?&nbsp;/gm
let rez;
while ((rez = playerInfoRegex.exec(playerString))) {
  playerOrder.push(rez[1]);
  playerLevels[rez[1]] = rez[2];
}
console.log('Player order:', playerOrder);
console.log('Player levels:', playerLevels);

// determine board order
const players = [];
const userIsPlaying = playerOrder.includes(username);
if (userIsPlaying) {
  console.log('Player is in this game!');
  if (!GM_config.get('showBoardsInPlayerOrder')) {
    console.log('Making player\'s board first');
    players.push(username);
  }
}
for (let x = 1; x < 7; x++) {
  const pid = GM_config.get(`player${x}`);
  if (pid && playerOrder.includes(pid) && !players.includes(pid)) {
    players.push(pid);
  }
}
for (let x = 0; x < playerOrder.length; x++) {
  if (!players.includes(playerOrder[x])) {
    players.push(playerOrder[x]);
  }
}
console.log('Board order:', players);

const autoReload = GM_config.get('autoReload') && userIsPlaying;

// see if we have advanced directives for this game
const gameConfig = userIsPlaying ? loadGameConfig() : null;


// add option to change player colors at the top
if (userIsPlaying) {
  const options = document.querySelector('body > table:nth-of-type(2) > tbody> tr:nth-of-type(2) > td:nth-of-type(2) > font > b');
  const colorOpt = document.createElement('span');
  colorOpt.innerHTML = `&nbsp;·&nbsp;<a href="http://www.mabiweb.com/modules.php?name=GM_Nations&g_id=${gameId}&op=change_colors_form">Change Player Colors</a>`;
  options.appendChild(colorOpt);
}


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
  reloadButton.innerHTML = 'Refresh Page';
  reloadButton.onclick = () => {
    window.location.href = gameUrl;
  };
  buttonDiv.appendChild(reloadButton);

  if (autoReload) {
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
    const actionRow = actions.children[0].children[0].children[0];
    actionRow.removeChild(actionRow.children[2]);
    actionRow.children[1].style.border = 'none';
    addTrackCell(actions);
    addTrackSpacer();
    addTrackCell(justice, military, science);

    if (gameConfig && gameConfig.slack) {
      const endTurnCell = actionRow.children[1]
      for (let x = 0; x < endTurnCell.children.length; x++) {
        const node = endTurnCell.children[x];
        if (node.nodeName === 'A') {
          // add onclick handler to send slack notification
          // eslint-disable-next-line no-unused-vars
          node.onclick = async (evt) => {
            //evt.preventDefault();
            //evt.stopPropagation();
            await sendSlackNotification();
          }
        }
      }
    }

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


// move recent action
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

  if (GM_config.get('showAllBoards')) {
    for (let x = 5; x > 0; x--) {
      if (players[x]) {
        console.log('Player', x, '-', players[x]);
        showBoard(p1, players[x]);
      }
    }
  }
}


if (autoReload) {
  console.log('Auto-reload enabled');
  if (currentPlayer === username) {
    console.log('...but it\'s your turn');
    if (window.location.href.indexOf('&reloaded=true') !== -1) {
      // noinspection JSUnresolvedFunction
      GM_notification(`It's your turn!`, 'Nations@Mabi Web', '', () => window.focus());
    }
  } else {
    const reloadInterval = GM_config.get('reloadInterval');
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
    resources = playerNode.children[playerNode.children.length - 2];
  }
  if (resources.onmouseover) {
    const mouseOver = resources.getAttribute('onmouseover');
    const match = mouseOver.match(/(<TABLE.*<\/TABLE>)/m);
    if (match) {
      let productionTable = match[1];
      // strip out style because it's using JS escapes
      productionTable = productionTable.replace(/style=\\'.*?\\'/mg, '');
      productionTable = productionTable.replace(/<TD><IMG/mg, '<TD style="font-size: 14pt; vertical-align: top;"><IMG style="position: relative; height: 30px;"');
      productionTable = productionTable.replace(/width="30"/mg, '');
      productionTable = productionTable.replace(/\(/, '<br /><span style="font-size: 0.8em">(');
      productionTable = productionTable.replace(/\)/, ')</font>');

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
  if (GM_config.get('showPersonalNotes')) {
    const notesForm = document.querySelector('#personal_notes form');
    if (notesForm) {
      const textarea = document.querySelector('#personal_notes textarea');
      textarea.style.width = '290px';
      textarea.style.height = '300px';

      const div = document.createElement('div');
      div.appendChild(notesForm);
      div.style.position = 'absolute';
      div.style.left = '1070px';
      div.style.top = '14em';
      playerNode.appendChild(div);

      const tab = document.querySelector('#placeholder ul.tab li:last-child');
      if (tab) {
        tab.parentNode.removeChild(tab);
      }
    }
  }
}



function loadGameMenu() {
  const configs = [];
  for (let x = 1; x < 6; x++) {
    const config = getGameConfig(x);
    if (config) {
      configs.push(config);
    }
  }
  if (configs.length > 0) {
    const select = document.createElement('select')
    for (let x = 0; x < configs.length; x++) {
      const config = configs[x];
      const option = document.createElement('option');
      option.value = `http://www.mabiweb.com/modules.php?name=GM_Nations&g_id=${config.id}&op=view_game_reset`;
      option.text = config.name ? config.name : `Game ${config.id}`;
      if (config.id === gameId) {
        option.selected = 'selected';
      }
      select.appendChild(option);
    }
    select.onchange = (evt) => {
      window.location.href = evt.target.value;
    };
    return select;
  }
}


/**
 * Loads game config, if any.
 */
function loadGameConfig() {
  for (let x = 1; x < 6; x++) {
    const config = getGameConfig(x);
    if (config.id === gameId) {
      console.log('Found game config:', config);
      return config;
    }
  }
}


function getGameConfig(num) {
  const nameInfo = trim(GM_config.get(`game${num}Id`));
  if (nameInfo) {
    const config = {};
    const idx = nameInfo.indexOf(':');
    if (idx !== -1) {
      const id = trim(nameInfo.substring(0, idx));
      let name = trim(nameInfo.substring(idx + 1, nameInfo.length));
      config.id = id;
      config.name = name;
      config.slack = trim(GM_config.get(`game${num}Slack`));
    } else {
      config.id = nameInfo;
      config.slack = trim(GM_config.get(`game${num}Slack`));
    }
    return config;
  }
}


/**
 * Trim spaces from start and end of a string.
 */
function trim(value) {
  if (typeof value === 'string') {
    return value.replace(/^\s+|\s+$/g,'');
  }
  return value;
}


/**
 * Sends Slack end-turn notification.
 */
async function sendSlackNotification() {
  try {
    const data = {
      text: `${getSlackName()} ${getSlackActionText()} ${getSlackGameLink()}`,
    }
    const response = await fetch(gameConfig.slack, {
      method: 'post',
      body: JSON.stringify(data)
    });
    if (response.status !== 200) {
      console.error('Slack responded with ', response.status);
    }
  } catch (error) {
    console.error('Error posting to slack', error);
  }
}

/**
 * Gets user name for Slack message.
 */
function getSlackName() {
  const name = trim(GM_config.get('slackDisplayName'));
  if (name) {
    return name;
  }
  return username;
}

/**
 * Gets action for Slack message.
 */
function getSlackActionText() {
  const log = document.getElementById('nations-recentlog');
  let action = log ? trim(log.children[log.children.length - 1].innerHTML) : '';

  if (GM_config.get('slackDescriptiveMove')) {
    return getSlackFancyActionText(action);
  } else {
    return getSlackSimpleActionText(action);
  }
}

function getSlackSimpleActionText(action) {
  return action.indexOf(`${username}: pass`) !== -1 ? 'passed' : 'made a move';
}

function getSlackFancyActionText(action) {
  const idx = action.indexOf(`${username}: `);
  if (idx === -1) {
    return getSlackSimpleActionText(action);
  }
  action = action.substring(idx + username.length + 2, action.length);

  if (action !== 'pass') {
    action = action.replace(/<img width="27" src="modules\/GM_Nations\/images\/(?:Token_)?Heritage\.png" style="vertical-align: middle; margin: 3">/g, ':nations_book:');
    action = action.replace(/<img width="27" src="modules\/GM_Nations\/images\/Token_([A-Za-z]+)\.png" style="vertical-align: middle; margin: 3">/g, ':$1:');
    action = action.replace(/<img width="27" src="modules\/GM_Nations\/images\/Meeple_([A-Za-z]+)\.png" style="vertical-align: middle; margin: 3">/g, ' :meeple_$1:');
    action = action.replace(/(?:'(.+?)') <img width="25" src="modules\/GM_Nations\/images\/Progress_Cards\/(?:.+?)\.jpg" onmouseover=".+?" style="vertical-align: middle; margin: 3">/g,
        '_$1_ ');
    action = action.replace(/[Bb]uy /, 'bought ')
        .replace('deploy ', 'deployed ')
        .replace('hire ', 'hired ')
        .replace(/ +paying /, ', paid ')
        .replace(/^place /, 'placed ')
        .replace('replace ', 'replaced ')
        .replace(/take /g, 'took ')
        .replace(', took ', 'and took ')
        .replace('may took', 'may take')
        .replace(/ +/g, ' ')
    ;

    if (!GM_config.get('slackEmojis')) {
      action = action
          .replace(/:meeple_[A-Za-z]+?:/, ' worker')
          .replace(/([0-9]+) ?:gold:/i, '$$1')
          .replace(/([0-9]+) ?:([A-Za-z_]+):/i, (text, g1, g2) => {
            let noun = g2.toLowerCase();
            if (noun === 'nations_book') {
              noun = 'book';
            } else if (noun === 'vp') {
              noun = 'VP';
            }
            if (g1 > 1) {
              return `${g1} ${noun}s`;
            }
            return `1 ${noun}`;
          })
      ;
    }
    return action;
  }
  return 'passed';
}

/**
 * Gets game link for Slack message.
 */
function getSlackGameLink() {
  if (gameConfig.name) {
    return `in <${gameUrl}|${gameConfig.name}>`;
  }
  return `in <${gameUrl}|game ${gameId}>`;
}
