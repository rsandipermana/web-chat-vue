export const storagePlugin = (store) => {
  // Load state from local storage during store initialization
  const storedState = localStorage.getItem("vuex-state");

  if (storedState) {
    // Update state by storage when storage is defined
    store.replaceState(JSON.parse(storedState));
  } else {
    // Update storage by state when storage is not defined
    localStorage.setItem("vuex-state", JSON.stringify(store.state));
  }

  // Watch for changes in the Vuex state and update local storage
  store.subscribe((mutation, state) => {
    // Update storage by state when state is updated
    localStorage.setItem("vuex-state", JSON.stringify(state));
  });

  // Watch for changes in local storage from other tabs/windows
  window.addEventListener("storage", (event) => {
    if (event.key === "vuex-state") {
      // Handle the local storage update
      handleStorageUpdate(store, event.newValue);
    }
  });
};


// Method to handle local storage update
const handleStorageUpdate = (store, newValue) => {
  if (newValue) {
    const parsedValue = JSON.parse(newValue);
    store.replaceState(parsedValue);
  }
};
