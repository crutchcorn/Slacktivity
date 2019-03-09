(() => {
  // TODO: Should also trap focus
  const setupStuff = () => {
    const channelList = document.querySelector(".client_channels_list_container");
    const channelHeader = document.querySelector('.channel_header');
    const channelListBody = document.getElementById("col_channels");
    const originalDisplayChannelListBody = channelListBody.style.display;

    const drawerRadio = document.createElement("input");
    drawerRadio.type = "radio";
    drawerRadio.tabIndex = -1;
    drawerRadio.classList.add(`corbinPluginradioEl`);
    drawerRadio.id = `corbinPlugindrawer`;
    drawerRadio.name = `corbinPluginsidenav`;
    drawerRadio.setAttribute("aria-hidden", "true");
    drawerRadio.value = "on";

    const showChannelList = () => {
      channelList.setAttribute("aria-hidden", "true");
      drawerRadio.click();
      channelListBody.style.display = originalDisplayChannelListBody;
    };

    const drawerButton = document.createElement("button");
    drawerButton.id = `corbinPlugindrawerButton`;
    drawerButton.type = `button`;
    drawerButton.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      showChannelList();
    });

    const scrimRadio = document.createElement("input");
    scrimRadio.type = "radio";
    scrimRadio.classList.add(`corbinPluginradioEl`);
    scrimRadio.id = `corbinPluginscrim`;
    scrimRadio.name = `corbinPluginsidenav`;
    scrimRadio.tabIndex = -1;
    scrimRadio.setAttribute("aria-hidden", "true");
    scrimRadio.value = "off";

    const hideChannelList = () => {
      if (!!channelList.attributes["aria-hidden"]) {
        channelList.removeAttribute("aria-hidden");
      }
      // Removes from tabIndex
      channelListBody.style.display = "none";
      scrimRadio.click();
    };

    const scrimEl = document.createElement("label");
    scrimEl.id = `corbinPluginscrimEl`;
    scrimEl.type = `button`;
    scrimEl.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      hideChannelList();
    });

    channelList.parentElement.insertBefore(drawerRadio, channelList);
    channelList.parentElement.insertBefore(drawerButton, channelList);
    channelList.parentElement.insertBefore(scrimRadio, channelList);
    channelList.parentElement.insertBefore(scrimEl, channelList);

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

        scrimRadio.click();
      }
    });

    document.addEventListener("keydown", ({code}) => {
      if (code && code === "Escape" && drawerRadio.checked) {
        hideChannelList();
      }
    });

    const conditionallyAddEffects = () => {
      const scrollListener = (e) => {
        e.preventDefault();
        channelHeader.scrollLeft += e.deltaY;
      };

      // Considered a large screen
      if (window.innerWidth > 700) {
        channelHeader.removeEventListener('wheel', scrollListener);
      } else {
        channelHeader.addEventListener('wheel', scrollListener);
      }
    };

    document.addEventListener('resize', () => {
      conditionallyAddEffects();
    });

    conditionallyAddEffects();
  };
  
  // Make sure elements are on screen
  function checkDocumentLoaded(cb) {
    if (document.querySelector(".client_channels_list_container")) {
      cb();
    } else {
      setTimeout(() => checkDocumentLoaded(cb), 10);
    }
  }

  checkDocumentLoaded(() => setupStuff());
})();
