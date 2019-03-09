const pluginPrefix = "corbinPlugin";
const channelListSelector = ".client_channels_list_container";
const channelList = document.querySelector(channelListSelector);
const sizeSmall = "700px";
// NOTE: Is direct sibling following channelList selector
const mainContentSelector = ".client_main_container";
// NOTE: Is the first child of mainContentSelector
const headerSelector = "#client_header";

const drawerRadio = document.createElement("input");
drawerRadio.type = "radio";
drawerRadio.classList.add(`${pluginPrefix}radioEl`);
drawerRadio.id = `${pluginPrefix}drawer`;
drawerRadio.name = `${pluginPrefix}sidenav`;
drawerRadio.value = "on";

const drawerLabel = document.createElement("label");
drawerLabel.id = `${pluginPrefix}drawerLabel`;
drawerLabel.htmlFor = `${pluginPrefix}drawer`;

const scrimRadio = document.createElement("input");
scrimRadio.type = "radio";
scrimRadio.classList.add(`${pluginPrefix}radioEl`);
scrimRadio.id = `${pluginPrefix}scrim`;
scrimRadio.name = `${pluginPrefix}sidenav`;
scrimRadio.value = "off";

const scrimLabel = document.createElement("label");
scrimLabel.id = `${pluginPrefix}scrimLabel`;
scrimLabel.htmlFor = `${pluginPrefix}scrim`;


channelList.parentElement.insertBefore(drawerRadio, channelList);
channelList.parentElement.insertBefore(drawerLabel, channelList);
channelList.parentElement.insertBefore(scrimRadio, channelList);
channelList.parentElement.insertBefore(scrimLabel, channelList);

const drawerLabelSize = "50px";
const drawerActualLabelSize = "28px";
const css = `
@media (min-width: ${sizeSmall}) {
  #${drawerLabel.id} {
    display: none !important;
    margin-left: 250px;
  }
}
#${drawerLabel.id} {
  height: ${drawerActualLabelSize};
  width: ${drawerActualLabelSize};
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgAQMAAADYVuV7AAAABlBMVEUAAAAzMzPI8eYgAAAAAXRSTlMAQObYZgAAABxJREFUeAFjIBOMAv7/UPCBlhzywWgYjIbBKAAANijXKaI5RRgAAAAASUVORK5CYII=);
  margin: calc((${drawerLabelSize} - ${drawerActualLabelSize}) / 2);
  margin-top: calc((${drawerLabelSize} - ${drawerActualLabelSize}) / 2 + 7px);
  z-index: 1;
  transition: left 100ms ease-in-out;
}

input.${pluginPrefix}radioEl[type="radio"] {
  display: none;
}
input.${pluginPrefix}radioEl[type="radio"] ~ #${scrimLabel.id} {
  background: black;
  opacity: 0.0;
}
input.${pluginPrefix}radioEl[type="radio"] ~ ${channelListSelector} {
  transition: margin-left 100ms ease-in-out;
}
input.${pluginPrefix}radioEl[type="radio"][value="on"]:checked ~ ${channelListSelector} {
  margin-left: 0px !important;
}
@media (max-width: ${sizeSmall}) {

  .c-search_modal .popover > div {
    max-width: calc(100vw - 24px);
  }

  ${headerSelector} {
    margin-left: ${drawerLabelSize};
  }

  ${mainContentSelector} {
    max-width: 100vw;
  }

  ${headerSelector} > .channel_header {
    flex-wrap: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
  }

  ${headerSelector} > .channel_header > .messages_header {
    flex-basis: calc(100vw - ${drawerLabelSize});
    flex-shrink: 0;
  }

  ${headerSelector} > .channel_header::-webkit-scrollbar {
    height: 6px;
  }

  ${headerSelector} > .channel_header::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 20px;
  }

  ${headerSelector} > .channel_header::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 20px;
  }

  #search_container {
      min-width: 110px;
  }

  input.${pluginPrefix}radioEl[type="radio"][value="on"]:checked ~ #${scrimLabel.id} {
    opacity: 0.5 !important;
    z-index: 250 !important;
  }

  #${drawerRadio.id}:checked ~ #${drawerLabel.id} {
    left: 220px;
  }

  input.${pluginPrefix}radioEl[type="radio"] ~ ${channelListSelector} {
    margin-left: -220px;
    z-index: 251;
  }
  input.${pluginPrefix}radioEl[type="radio"] ~ #${scrimLabel.id} {
    height: 100vh;
    width: 100vw;
    position: fixed;
    z-index: -99;
    transition: opacity 0.4s;
  }

  #col_messages {
    min-width: 0px;
  }

  #col_flex {
    flex-basis: calc(100vw) !important;
    z-index: 1;
  }
}
`,
  style = document.createElement("style");

document.head.appendChild(style);

style.type = "text/css";
style.appendChild(document.createTextNode(css));

document.addEventListener("click", (event) => {
  // Done as array as document click could be one of many children
  if (event.target) {
    let newEl = event.target;
    const elArr = [];
    // Did 4 as there are 4 possible levels where these items must be true
    for (let i = 0; i <= 4; i++) {
      if (!newEl.parentElement) {
        // This is too high in DOM, early return
        return;
      }
      elArr.push(newEl);
      newEl = newEl.parentElement;
    }

    const roleListItem = elArr.some(el => el.attributes && el.attributes.role && el.attributes.role.value === "listitem");
    if (!roleListItem) {
      return;
    }

    const roleListLink = elArr.some(el => {
      const link = el.querySelector("a");
      if (!link) {
        return false;
      }
      // Ensure this link is a channel name and not something else
      return !!(link.classList && (
          link.classList.contains("p-channel_sidebar__channel") ||
          link.classList.contains("p-channel_sidebar__link")
        )
      );
    });

    if (!roleListLink) {
      return;
    }

    scrimLabel.click();
  }
});
