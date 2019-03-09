const channelList = document.querySelector(".client_channels_list_container");

const drawerRadio = document.createElement("input");
drawerRadio.type = "radio";
drawerRadio.classList.add(`corbinPluginradioEl`);
drawerRadio.id = `corbinPlugindrawer`;
drawerRadio.name = `corbinPluginsidenav`;
drawerRadio.value = "on";

const drawerLabel = document.createElement("label");
drawerLabel.id = `corbinPlugindrawerLabel`;
drawerLabel.htmlFor = `corbinPlugindrawer`;

const scrimRadio = document.createElement("input");
scrimRadio.type = "radio";
scrimRadio.classList.add(`corbinPluginradioEl`);
scrimRadio.id = `corbinPluginscrim`;
scrimRadio.name = `corbinPluginsidenav`;
scrimRadio.value = "off";

const scrimLabel = document.createElement("label");
scrimLabel.id = `corbinPluginscrimLabel`;
scrimLabel.htmlFor = `corbinPluginscrim`;


channelList.parentElement.insertBefore(drawerRadio, channelList);
channelList.parentElement.insertBefore(drawerLabel, channelList);
channelList.parentElement.insertBefore(scrimRadio, channelList);
channelList.parentElement.insertBefore(scrimLabel, channelList);

const css = `
:root {
  --drawerLabelSize: 50px;
}
@media (min-width: 700px) {
  #corbinPlugindrawerLabel {
    display: none !important;
    margin-left: 250px;
  }
}
#corbinPlugindrawerLabel {
  --drawerActualLabelSize: 28px;
  height: var(--drawerActualLabelSize);
  width: var(--drawerActualLabelSize);
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgAQMAAADYVuV7AAAABlBMVEUAAAAzMzPI8eYgAAAAAXRSTlMAQObYZgAAABxJREFUeAFjIBOMAv7/UPCBlhzywWgYjIbBKAAANijXKaI5RRgAAAAASUVORK5CYII=);
  margin: calc((var(--drawerLabelSize) - var(--drawerActualLabelSize)) / 2);
  margin-top: calc((var(--drawerLabelSize) - var(--drawerActualLabelSize)) / 2 + 7px);
  z-index: 1;
  transition: left 100ms ease-in-out;
}

input.corbinPluginradioEl[type="radio"] {
  display: none;
}
input.corbinPluginradioEl[type="radio"] ~ #corbinPluginscrimLabel {
  background: black;
  opacity: 0.0;
}
input.corbinPluginradioEl[type="radio"] ~ .client_channels_list_container {
  transition: margin-left 100ms ease-in-out;
}
input.corbinPluginradioEl[type="radio"][value="on"]:checked ~ .client_channels_list_container {
  margin-left: 0px !important;
}
@media (max-width: 700px) {

  .c-search_modal .popover > div {
    max-width: calc(100vw - 24px);
  }

  #client_header {
    margin-left: var(--drawerLabelSize);
  }

  .client_main_container {
    max-width: 100vw;
  }

  #client_header > .channel_header {
    flex-wrap: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
  }

  #client_header > .channel_header > .messages_header {
    flex-basis: calc(100vw - var(--drawerLabelSize));
    flex-shrink: 0;
  }

  #client_header > .channel_header::-webkit-scrollbar {
    height: 6px;
  }

  #client_header > .channel_header::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 20px;
  }

  #client_header > .channel_header::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 20px;
  }

  #search_container {
      min-width: 110px;
  }

  input.corbinPluginradioEl[type="radio"][value="on"]:checked ~ #corbinPluginscrimLabel {
    opacity: 0.5 !important;
    z-index: 250 !important;
  }

  #corbinPlugindrawer:checked ~ #corbinPlugindrawerLabel {
    left: 220px;
  }

  input.corbinPluginradioEl[type="radio"] ~ .client_channels_list_container {
    margin-left: -220px;
    z-index: 251;
  }
  input.corbinPluginradioEl[type="radio"] ~ #corbinPluginscrimLabel {
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
