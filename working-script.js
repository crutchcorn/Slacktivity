(() => {
  const setupStuff = () => {
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
