let unreadMsgEls = [];

let compareEl = (nodeItem, added) => {
  console.log(nodeItem.dataset);
  if (nodeItem.dataset.qaChannelSidebarChannel === "true") {
    if (added) {
      unreadMsgEls.push(nodeItem);
    } else {
      unreadMsgEls = unreadMsgEls.filter(node => node !== nodeItem);
    }
  }
};

// data-qa="mention_badge"

let observer = new MutationObserver(mutationsList => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      for (const addedNode of mutation.addedNodes) {
        compareEl(addedNode, true);
      }
      for (const removedNode of mutation.removedNodes) {
        compareEl(removedNode, false);
      }
    }
  }
});

let sidbarEl = document.getElementsByClassName("p-channel_sidebar__static_list")[0];

observer.observe(sidbarEl, {
  attributes: true,
  childList: true,
  subtree: true
});
