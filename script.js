// script.js
// Imports: items, fidToName, typeColors

// do big and variant sprites
// fix move display source

const itemList = document.getElementById('itemList');
const searchBox = document.getElementById('searchBox');
const pageTitle = document.getElementById('page-title');
const titleimg = document.getElementById('title-img');
searchBox.focus();
const headerContainer = document.getElementById("header-container");
const filterContainer = document.getElementById("filter-container");
const suggestions = document.getElementById("suggestions");
const possibleFID = [...Array(1154).keys()];
const increment = 50; // Number of items to load at a time
let renderLimit = 0; // Start with no items
let showMoveLearn = []; // Filtered moves to show the sources of
let suggestionPreview = null;
let lockedFilters = [];
let lockedFilterGroups = [[]];
let lockedFilterMods = [];
let lockedOR = []; // 0 for AND, 1 for OR
let isMobile = false;
let filteredItems = null;
let shinyState = 0;

// Set up the header columns
let headerColumns = [];
const headerNames = ['Dex', 'Shiny', 'Species', 'Types', 'Abilities', 'Egg Moves', 'Cost', 'BST', 'HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
const sortAttributes = ['rowno', 'shiny', 'spec', 'type1', 'ab1', 'moves', 'cost', 'bst', 'hp', 'atk', 'def', 'spa', 'spd', 'spe'];
headerNames.forEach((thisHeaderName, index) => {
  const newColumn = document.createElement('div');
  if (thisHeaderName == '') {const img = document.createElement('img'); img.src = 'ui/headerblank.png'; newColumn.appendChild(img);
                     } else {newColumn.innerHTML = thisHeaderName; }
  newColumn.sortattr = sortAttributes[index];
  newColumn.textDef = thisHeaderName;
  newColumn.className = 'header-column';
  newColumn.width = 40;
  newColumn.addEventListener('click', () => {updateHeader(newColumn)} );
  headerColumns.push(newColumn); // Push the column element into the array
});
let sortState = { column: null, ascending: true }; // Track the current sort state
let currentTarget = null; // Track current sorted column

// Display items based on query and locked filters
function refreshAllItems() {
  // console.log('Refreshing all items');
  const query = searchBox.value.toLowerCase().replace(/\s+/g, '');
  itemList.innerHTML = ""; // Clear existing items
  filteredItems = items;
  if (shinyState) { // Only show items that have that tier of shiny
    filteredItems = filteredItems.filter(item => item.shvar >= shinyState);
  }
  if (query.length > 0) { // Only show items that match the query
    filteredItems = filteredItems.filter(item =>
      item.spec.toLowerCase().replace(/\s+/g, '').includes(query) ||
      item.ab1.toLowerCase().replace(/\s+/g, '').includes(query) ||
      item.ab2.toLowerCase().replace(/\s+/g, '').includes(query) ||
      item.hab.toLowerCase().replace(/\s+/g, '').includes(query) ||
      item.pas.toLowerCase().replace(/\s+/g, '').includes(query) ||
      item.type1.toLowerCase().includes(query) ||
      item.type2.toLowerCase().includes(query) ||
      item.dexno.toString().includes(query)
  );}
  if (lockedFilters.length > 0) {
    filteredItems = filteredItems.filter(item => 
      lockedFilterGroups.every(thisGroup => 
        thisGroup.some(thisLockedFID => thisLockedFID in item))) // Search for filters with their fid as key
      }
  showMoveLearn = [];
  lockedFilters.forEach(thisLockedFID => { // Add moves to track in the move column
    if (fidToCategory(thisLockedFID) == "Move") { 
      showMoveLearn.push(thisLockedFID);
    }
  });
  // Sort items if a column is specified
  if (sortState.column) {
    if (sortState.column == 'moves') {
      filteredItems.sort((a, b) => { // Sort by source of moves
        let learnLevel = [0, 0] // [a,b]
        showMoveLearn.forEach(thisMove => {
          learnLevel[0] += (thisMove in a ? a[thisMove] : 500 ); // Add 500 if can't learn
          learnLevel[1] += (thisMove in b ? b[thisMove] : 500 );
        });
        if (learnLevel[0] < learnLevel[1]) return sortState.ascending ? -1 : 1;
        if (learnLevel[0] > learnLevel[1]) return sortState.ascending ? 1 : -1;
        return 0;
      });
    } else {
      filteredItems.sort((a, b) => { // Sort by other attribute
        if (a[sortState.column] < b[sortState.column]) return sortState.ascending ? -1 : 1;
        if (a[sortState.column] > b[sortState.column]) return sortState.ascending ? 1 : -1;
        return 0;
      });
    }
  }
  // Render the first few items
  renderLimit = 0;
  renderMoreItems();
}

function renderMoreItems() {
  // console.log('Rendering more items');
  renderLimit += increment;
  let slicedItems = filteredItems.slice(renderLimit-increment,renderLimit)
  slicedItems.forEach((item, index) => { // Generate each list item dynamically
    const li = document.createElement('li'); // Entry of one Pokemon
    
    // Create each column and set its text

    const pokeImg = document.createElement('img'); // Show image of the pokemon
    pokeImg.src = `images/${item.img}_${shinyState}.png`;        // The image can be replaced with shiny sprites
    pokeImg.shinyOverride = -1;
    pokeImg.stars = [];
    // pokeImg.alt = '';
    pokeImg.className = 'item-image';

    const dexColumn = document.createElement('div'); // Create the dex column, with stars and pin only on desktop
    dexColumn.className = 'item-column';
    // if (isMobile) {
      const starColumn = document.createElement('div');
      starColumn.className = 'item-column';
      const pinColumn = document.createElement('div');
      pinColumn.className = 'item-column';
    // }
    const pinImg = document.createElement('img');
    pinImg.src = 'ui/pin.png';
    pinImg.className = 'pin-img';
    if (isMobile) {
      pinColumn.appendChild(pinImg);
      dexColumn.innerHTML = '<b><a href="https://wiki.pokerogue.net/pokedex:' + item.dexno + '" target="_blank">#' + item.dexno + '</a></b><br>';
    } else {
      dexColumn.appendChild(pinImg);
      dexColumn.innerHTML = dexColumn.innerHTML + '<br><b><a href="https://wiki.pokerogue.net/pokedex:' + item.dexno + '" target="_blank">#' + item.dexno + '</a></b><br>';
    }
    for (let i = 1; i < 4; i++) {
      if (item.shvar >= i) {
        const starImg = document.createElement('img');
        starImg.className = 'star-img';
        starImg.src = (shinyState == i ? `ui/shiny${i}.png` : `ui/shiny${i}g.png`);
        starImg.addEventListener('click', () => { // Add click events to all the stars, changing the poke image
          if (shinyState == i && pokeImg.shinyOverride == -1 || pokeImg.shinyOverride == i) {
            pokeImg.shinyOverride = 0; // Remove global shiny state if same
            pokeImg.src = `images/${item.img}_0.png`; 
            pokeImg.stars.forEach((thisStar) => thisStar.src = 'ui/shiny1g.png');
          } else { // Otherwise set the shiny override of this pokemon to the clicked star
            pokeImg.shinyOverride = i;
            pokeImg.src = `images/${item.img}_${i}.png`;  
            pokeImg.stars.forEach((thisStar) => thisStar.src = 'ui/shiny1g.png');
            starImg.src = `ui/shiny${i}.png`;
          }
        });
        starImg.addEventListener('mouseover', () => {
          starImg.src = `ui/shiny${i}.png`; // Set to the hover image
        });
        starImg.addEventListener('mouseout', () => {
          if (pokeImg.shinyOverride == -1) { // If no override
            starImg.src = (shinyState == i ? `ui/shiny${i}.png` : `ui/shiny${i}g.png`); // Revert to global shiny state
          } else {
            starImg.src = (pokeImg.shinyOverride == i ? `ui/shiny${i}.png` : `ui/shiny${i}g.png`);
          }
        });
        pokeImg.stars.push(starImg);
        if (isMobile) {
          starColumn.appendChild(starImg);
        } else {
          dexColumn.appendChild(starImg);
        }
      }
    }

    const specColumn = document.createElement('div'); // Show species name
    specColumn.className = 'item-column';
    specColumn.innerHTML = '<b>' + item.spec + '</b>';

    const typeColumn = document.createElement('div'); // Show both types
    typeColumn.className = 'item-column';
    typeColumn.innerHTML = '<p style="color:' + typeColors[item.type1] + '; margin: 0;"><b>' + item.type1 + '</p>' 
                         + '<p style="color:' + typeColors[item.type2] + '; margin: 0;">'    + item.type2 + '</b></p>';

    const abilityColumn = document.createElement('div'); // Show all four abilities
    abilityColumn.className = 'item-column';
    abilityColumn.innerHTML = '<b>' +
    '<p style="margin: 0;">' + item.ab1 + '</p>' +
    '<p style="margin: 0;">' + item.ab2 + '</p>' +
    '<p style="color:rgb(240, 230, 140); margin: 0;">' + item.hab + '</p>' +
    '<p style="color:rgb(140, 130, 240); margin: 0;">' + item.pas + '</p></b>';

    // Show the column of egg moves, or filtered moves and their sources
    const moveColumn = document.createElement('div');  moveColumn.className = 'item-column';  moveColumn.innerHTML = '';
    let numMovesShown = 0;
    showMoveLearn.forEach((thisMove) => {
      if (thisMove in item && numMovesShown < 2) { 
        numMovesShown += 1;
        let source = item[thisMove];
        let sourceText = 'fail';
        if (source == -1) {sourceText = '<p style="color:rgb(240, 173, 131); margin: 0;">Memory</p></b>'}
        else if (source == 0) {sourceText = '<p style="color:rgb(131, 182, 239); margin: 0;">Evolution</p></b>'}
        else if (source == 201) {sourceText = '<p style="color:rgb(255, 255, 255); margin: 0;">Egg Move</p></b>'}
        else if (source == 202) {sourceText = '<p style="color:rgb(240, 230, 140); margin: 0;">Rare Egg Move</p></b>'}
        else if (source == 203) {sourceText = '<p style="color:rgb(255, 255, 255); margin: 0;">Common TM</p></b>'}
        else if (source == 204) {sourceText = '<p style="color:rgb(131, 182, 239); margin: 0;">Great TM</p></b>'}
        else if (source == 205) {sourceText = '<p style="color:rgb(240, 230, 140); margin: 0;">Ultra TM</p></b>'}
        else {sourceText = '<p style="color:rgb(255, 255, 255); margin: 0;">Lv ' + item[thisMove] + '</p></b>'}
        moveColumn.innerHTML = moveColumn.innerHTML + '<p style="color:rgb(140, 130, 240); margin: 0;"><b>' 
                             + fidToName[thisMove] + ':</p>' + sourceText;
      }
    });
    if (showMoveLearn.length == 0) {
      moveColumn.innerHTML = '<p style="margin: 0;"><b>' + item.egg1 + '<br>' + item.egg2 + '<br>' + item.egg3 + '<br>' +
                    '</p><p style="color:rgb(240, 230, 140); margin: 0;">' + item.egg4 + '</p></b>';
    }

    const costColumn = document.createElement('div');
          costColumn.className = 'item-column'; costColumn.innerHTML = '<b>Cost<br>' + item.cost + '</b>';                  
    const bstColumn = document.createElement('div'); // Create the stats columns
          bstColumn.className = 'item-column'; bstColumn.innerHTML = '<b>BST<br>' + item.bst +'</b>';
    const hpColumn = document.createElement('div');
          hpColumn.className = 'item-column';  hpColumn.innerHTML = '<b>HP<br>' + item.hp +'</b>';
    const atkColumn = document.createElement('div');
          atkColumn.className = 'item-column'; atkColumn.innerHTML = '<b>Atk<br>' + item.atk +'</b>';    
    const defColumn = document.createElement('div');
          defColumn.className = 'item-column'; defColumn.innerHTML = '<b>Def<br>' + item.def +'</b>';    
    const spaColumn = document.createElement('div');
          spaColumn.className = 'item-column'; spaColumn.innerHTML = '<b>SpA<br>' + item.spa +'</b>';    
    const spdColumn = document.createElement('div');
          spdColumn.className = 'item-column'; spdColumn.innerHTML = '<b>SpD<br>' + item.spd +'</b>';    
    const speColumn = document.createElement('div');
          speColumn.className = 'item-column'; speColumn.innerHTML = '<b>Spe<br>' + item.spe +'</b>';

    const row1 = document.createElement('div'); row1.className = 'row'; let row2 = row1;
    if (isMobile) {
      // row1.style.backgroundColor = (index%2 == 0 ? '#151019' : '#252129');
      row1.appendChild(dexColumn);      row1.appendChild(starColumn); 
      row1.appendChild(specColumn);     row1.appendChild(pinColumn);
      const row2 = document.createElement('div'); row2.className = 'row'; li.appendChild(row1);
      row2.appendChild(pokeImg); row2.appendChild(abilityColumn); row2.appendChild(moveColumn);   
      const row3 = document.createElement('div'); row3.className = 'row'; li.appendChild(row2);
      row3.appendChild(typeColumn);     row3.appendChild(costColumn);      row3.appendChild(bstColumn);
      row3.appendChild(hpColumn);       row3.appendChild(atkColumn);       row3.appendChild(defColumn);
      row3.appendChild(spaColumn);      row3.appendChild(spdColumn);       row3.appendChild(speColumn);    
      li.appendChild(row3); // Append the 3rd row
    } else {
      row1.appendChild(dexColumn);      row1.appendChild(pokeImg);             row1.appendChild(specColumn);    
      row1.appendChild(typeColumn);     row1.appendChild(abilityColumn);   row1.appendChild(moveColumn); 
      row1.appendChild(costColumn);     row1.appendChild(bstColumn);
      row1.appendChild(hpColumn);       row1.appendChild(atkColumn);       row1.appendChild(defColumn);
      row1.appendChild(spaColumn);      row1.appendChild(spdColumn);       row1.appendChild(speColumn);    
      li.appendChild(row1); // Append the only row
    }
    itemList.appendChild(li); // Append the current entry to the list of Pokemon
  });
}

function fidToCategory(fid) {
  if (fid < 18) { return 'Type'; }
  else if (fid < 328) { return 'Ability'; }
  else { return 'Move';}
}

// Display the filter suggestions *************************
function displaySuggestions() {
  const query = searchBox.value.toLowerCase().replace(/\s+/g, '');
  // Filter suggestions based on query and exclude already locked filters
  let matchingFID = [];
  matchingFID = possibleFID.filter(
    (fid) => fidToName[fid].toLowerCase().replace(/\s+/g, '').includes(query) // Contains the search query and is not already locked
          && !lockedFilters.some((f) => f == fid));
  suggestionPreview = null;
  // Erase the list of suggestions if it is too large 
  if (matchingFID.length > 20) {
    matchingFID = [];
  } 
  
  // If there is at least one locked filter, remove suggestions that have no matches
  if (lockedFilters.length > 0) {
  // Sort the list of suggestions based on hits in the item list (but still by type/ability/move)
  // (If there are no locked filters, the list is already presorted)
  
  }
  // Apply the first suggestion to the preview filter
  if (matchingFID.length > 0) {suggestionPreview = matchingFID[0]} 

  // Remove filter preview if there are no matching suggestions

  suggestions.innerHTML = matchingFID.map( (fid) => {
    let suggColor = 'rgb(255, 255, 255)' // Default color for type
    if (fidToCategory(fid) == 'Ability') { suggColor = 'rgb(140, 130, 240)'; }
    if (fidToCategory(fid) == 'Move')    { suggColor = 'rgb(145, 145, 145)'; }
    return `<span class="suggestion" fid="${fid}"
                      style="${(fidToCategory(fid) == 'Type' ? 'color:'+typeColors[fidToName[fid]]+'; ':'')} margin: 0;">
                      <span class="suggestion-category" style="color:${suggColor};">
                      ${fidToCategory(fid)}: </span>${fidToName[fid]}</span>`  
  }).join("");
  // Add click event to suggestions
  document.querySelectorAll(".suggestion").forEach((el) => el.addEventListener("click", () =>
      lockFilter(el.getAttribute("fid"))
    )
  );
}

// Lock a filter *************************
function lockFilter(newLockFID) {
  if (!lockedFilters.some( (f) => f == newLockFID)) {
    lockedFilters.push(newLockFID);
    // console.log(newLockFID);
    // console.log(fidToName[newLockFID]);
    // Add the filter to the locked filters container
    let filterMod = null;
    if (lockedFilters.length > 1) {
      filterMod = document.createElement("span");
      filterMod.className = "filter-mod";
      filterMod.innerHTML = '&'
      filterMod.toggleOR = 0;
      filterMod.addEventListener("click", () => toggleOR(filterMod));
      lockedFilterMods.push(filterMod);
      filterContainer.appendChild(filterMod);
    }
    const filterTag = document.createElement("span");
    filterTag.className = "filter-tag";
    const img = document.createElement('img'); img.src = 'ui/lock.png'; filterTag.appendChild(img);
    filterTag.innerHTML = filterTag.innerHTML + `${fidToCategory(newLockFID)}: ${fidToName[newLockFID]}`;
    filterTag.addEventListener("click", () => removeFilter(newLockFID, filterTag, filterMod));
    filterContainer.appendChild(filterTag);
    // Refresh suggestions and items
    searchBox.value = ""; // Clear the search bar after locking
    updateFilterGroups();
    displaySuggestions();
    refreshAllItems();
    if (lockedFilters.length == 1 && fidToCategory(newLockFID) === 'Move' && sortState.column === 'rowno') {
      updateHeader(headerColumns[5]);
    } else {
      if (lockedFilters.length == 1 && sortState.column === 'moves') {
        sortState.ascending = true;
      }
      updateHeader(null, true);
    }
  }
}

// Remove a filter **************************
function removeFilter(fidToRemove, filterTag, filterModToRemove) {
  if (lockedFilters.length > 1 && fidToRemove == lockedFilters[0]) {
    lockedFilterMods[0].remove();
    lockedFilterMods.splice(0,1);
  }
  lockedFilters = lockedFilters.filter( (f) => f != fidToRemove );
  filterTag.remove(); // Remove the filter tag
  lockedFilterMods = lockedFilterMods.filter( (f) => f != filterModToRemove );
  if (filterModToRemove) {filterModToRemove.remove();}
  // Refresh suggestions and items
  updateFilterGroups();
  displaySuggestions();
  refreshAllItems();
  // Reset the sorting if there aren't any more locked moves
  if (sortState.column === 'moves' && !lockedFilters.some((f) => fidToCategory(f) == 'Move')) { 
    updateHeader(headerColumns[0]); 
  } else { 
    updateHeader(null, true); 
  }
  if (lockedFilters.length == 0) {
    pageTitle.classList.remove('colorful-text');
    void pageTitle.offsetWidth;
    pageTitle.classList.add('colorful-text');
  }
  if (!isMobile) {searchBox.focus();}
}

function updateFilterGroups() { // Updates the grouping of filters based on AND/OR toggles
  lockedFilterGroups = [[]];
  let group = 0;
  lockedFilterGroups[group].push(lockedFilters[0]);
  for (let i = 0; i < lockedFilterMods.length; i++) {
    if (lockedFilterMods[i].toggleOR) { // If it is OR
      lockedFilterGroups[group].push(lockedFilters[i+1]);
    } else { // It is AND
      group += 1;
      lockedFilterGroups.push([]);
      lockedFilterGroups[group].push(lockedFilters[i+1]);
    }
  }
}

function toggleOR(filterMod) { // Click a filter to toggle it between AND and OR
  filterMod.toggleOR = 1 - filterMod.toggleOR;
  filterMod.innerHTML = (filterMod.toggleOR ? 'OR' : '&');
  updateFilterGroups();
  displaySuggestions();
  refreshAllItems();
}

// Event function for the header row - Clicking on the header row to sort ***************
function updateHeader(clickTarget = null, ignoreFlip = false) {
  if (clickTarget == null) {clickTarget = currentTarget; ignoreFlip = true;}
  // console.log(clickTarget?.sortattr)
  // Set the text of the move column, depending on if a move is filtered
  if (showMoveLearn[0] != null) {
    headerColumns[5].textDef = '<p style="display: inline; color:rgb(140, 130, 240); margin: 0;">' 
                             + (isMobile ? 'Moves' : 'Filtered Moves');
  } else {
    headerColumns[5].textDef = (isMobile ? 'Egg Moves' : 'Egg Moves');
  }
  headerColumns[5].innerHTML = headerColumns[5].textDef;
  // Find the new sorting attribute, and update the headers
  const sortAttribute = clickTarget?.sortattr;
  if (sortAttribute) {
    if (sortAttribute == 'shiny') {
      shinyState = (shinyState == 0 ? 3 : shinyState-1);
      if (shinyState) {
        headerColumns[1].innerHTML = '<p style="display: inline; color:rgb(140, 130, 240); margin: 0;">Shiny</p>';
        const starImg = document.createElement('img');
        starImg.className = 'star-header';
        starImg.src = `ui/shiny${shinyState}.png`;
        headerColumns[1].appendChild(starImg);
      } else {
        headerColumns[1].innerHTML = 'Shiny';
      }
    } else {
      if (sortState.column === sortAttribute) {
        if (!ignoreFlip) {
          sortState.ascending = !sortState.ascending; // Toggle sort direction if sorting by the same column
        }
      } else {
        sortState.column = sortAttribute;
        // Sort ascending on some columns, but descending on others
        sortState.ascending = (sortState.column == "rowno")||(sortState.column == "spec")
                            ||(sortState.column == "type1")||(sortState.column == "ab1")||(sortState.column == "moves");
        if (currentTarget?.textDef) { // Clear arrow from previous target
          currentTarget.innerHTML = currentTarget?.textDef;
        }
      }
      currentTarget = clickTarget; // Draw arrow on new target
      clickTarget.innerHTML = clickTarget.textDef + '<br><p style="color:rgb(140, 130, 240); margin: 0; font-family: serif;">' + (sortState.ascending ? "&#9650;" : "&#9660;") + '</p>';
    }
  }
  // Update the display
  displaySuggestions();
  refreshAllItems();
}

function adjustLayout(headerTarget = null, forceAdjust = false) {
  if (isMobile != (window.innerWidth <= 768) || forceAdjust) {
    let windowWidth = window.innerWidth;
    isMobile = (windowWidth <= 768);
    // console.log('Adjusting layout');
    // console.log((isMobile ? "Mobile layout" : "Desktop layout"), windowWidth, isMobile);
    titleimg.src = (isMobile ? 'ui/mag18.png' : 'ui/mag30.png' );
    // Redraw all the header columns into the header container
    headerContainer.innerHTML = '';
    const thisRow = document.createElement('div'); thisRow.className = 'header-row';
    if (isMobile) {
      thisRow.appendChild(headerColumns[0]);
      thisRow.appendChild(headerColumns[1]);
      thisRow.appendChild(headerColumns[4]);
      thisRow.appendChild(headerColumns[2]);
      thisRow.appendChild(headerColumns[5]);
      headerContainer.appendChild(thisRow);
      const row2 = document.createElement('div'); row2.className = 'header-row';
      row2.appendChild(headerColumns[3]);
      for (const thisColumn of headerColumns.slice(6,15)) {row2.appendChild(thisColumn);}  
      headerContainer.appendChild(row2);
    } else {
      for (const thisColumn of headerColumns) {thisRow.appendChild(thisColumn);}  
      headerContainer.appendChild(thisRow);
    }
  updateHeader(headerTarget);
  }
}

// Initial display of items, and initial sort by Dex
adjustLayout(headerColumns[0],true);

// Load more items on scroll
window.addEventListener("scroll", () => {
  if (window.scrollY + window.innerHeight >= document.body.scrollHeight * 0.8 - 1000) {
    renderMoreItems();
  }
});
// Run on page load and when resizing the window
window.addEventListener("resize", () => { 
  adjustLayout();
});
searchBox.addEventListener('input', () => { // Typing in search box ***************
  displaySuggestions();
  refreshAllItems();
});
document.addEventListener('keydown', (event) => {
  // Ignore certain keys like Tab, Shift, Control, Alt, etc.
  const ignoredKeys = ["Tab", "Shift", "PageDown", "PageUp", "Control", "Alt", "Meta", "CapsLock", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (!ignoredKeys.includes(event.key)) {
    searchBox.focus();
  }
});
document.addEventListener('keydown', (event) => { // Hit 'Enter' to lock the first filter
  if (event.key == "Enter" && suggestionPreview != null) {
    lockFilter(suggestionPreview);
  }
});
// searchBox.addEventListener('input', (event) => { // doesn't work ........
//   if (event.key == "PageDown") {
//     itemList.focus();
//   }
// });
document.addEventListener('keydown', (event) => { // Hit escape to clear the search box, or the last filter
  if (event.key == "Escape") {
    if (searchBox.value.length > 0) {
      searchBox.value = ''
      displaySuggestions();
      refreshAllItems();
    } else if (lockedFilters.length > 0) {
      const lastFilter = lockedFilters[lockedFilters.length - 1];
      const filterTags = document.querySelectorAll(".filter-tag");
      const lastFilterTag = filterTags[filterTags.length - 1];
      const lastFilterMod = lockedFilterMods[lockedFilterMods.length - 1];
      if (lastFilter && lastFilterTag) {
        removeFilter(lastFilter, lastFilterTag, lastFilterMod); // Remove the last filter
      }
    }
  }
});