/**
 * Many, if not all of these are `let`d in order to make debugging easier on me when copy+pasting into the console
 * easier. TODO: When finished, make these `const` where applicable
 */

/**
 * @typedef {'mention' | 'unread'} counterListenerType
 */

/**
 * @typedef dmCounterCallback
 * @type function
 * @param {Node} node
 */

/**
 * @typedef dmCounterListener
 * @type {object}
 * @prop {counterListenerType} type
 * @prop {dmCounterCallback} func
 */

/**
 * @type {HTMLOrSVGElement[]}
 * @private
 */
let mentionEls = [];

/**
 * @type {dmCounterListener[]}
 * @private
 */
let onDMCounterFuncs = [];

/**
 *
 * @param {'mention' | 'unread'} type
 * @param {dmCounterCallback}func
 * @public
 */
const addDMCounterListener = (type, func) => {
  onDMCounterFuncs.push({type, func});
};

/**
 *
 * @param {dmCounterCallback} func - The function to remove. Compared by reference
 * @public
 */
const removeDMCounterListener = (func) => {
  onDMCounterFuncs = onDMCounterFuncs.filter(keptFunc => keptFunc !== func.func);
};


/**
 *
 * @param {Node | HTMLOrSVGElement} nodeItem
 * @param {boolean} added
 */
let compareEl = (nodeItem, added) => {
  console.log(nodeItem.dataset);
  // this associates with `data-qa-channel-sidebar-channel`
  if (nodeItem.dataset.qaChannelSidebarChannel === "true") {
    if (added) {
      mentionEls.push(nodeItem);
      onDMCounterFuncs.forEach(({func}) => void func(mentionEls.length))
    } else {
      mentionEls = mentionEls.filter(node => node !== nodeItem);
      onDMCounterFuncs.forEach(({func}) => void func(mentionEls.length))
    }
  }
};

// On mention:
// data-qa="mention_badge"

// On unread channel:
// data-qa-channel-sidebar-is-starred="true"
// .p-channel_sidebar__channel--unread
// aria-label="watercooler (channel, 1 unread message)"
// aria-label="watercooler (channel, 2 unread messages)"

// Interesting to note
// aria-label="watercooler (selected, channel, has draft)"

let observer = new MutationObserver(mutationsList => {
  for (const mutation of mutationsList) {
    // FIXME: This is almost guaranteed to fire on draft icon showing, that's less than ideal
    // The mention badge is a new component that is added as a sibling of the channel name
    if (mutation.type === "childList") {
      for (const addedNode of mutation.addedNodes) {
        compareEl(addedNode, true);
      }
      for (const removedNode of mutation.removedNodes) {
        compareEl(removedNode, false);
      }
      // The unread bolding is a mutation of the attributes associated with the channel
      // This runs for EVERYTHING though. What's selected, the aria-label, etc
    } else if (mutation.type === 'attributes') {
      console.log('The ' + mutation.attributeName + ' attribute was modified.');
    }
  }
});

let sidbarEl = document.getElementsByClassName("p-channel_sidebar__static_list")[0];

observer.observe(sidbarEl, {
  attributes: true,
  childList: true,
  subtree: true
});
