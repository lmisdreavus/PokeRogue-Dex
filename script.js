// script.js
// Imports: items, fidThreshold, fidToName, typeColors

const itemList = document.getElementById('itemList');
const searchBox = document.getElementById('searchBox');
const pageTitle = document.getElementById('page-title');
const titleimg = document.getElementById('mag-img');
const headerContainer = document.getElementById("header-container");
const filterContainer = document.getElementById("filter-container");
const suggestions = document.getElementById("suggestions");
const splashScreen = document.getElementById("splashScreen");
const splashContent = document.getElementById("splashContent");
const openMenuButton = document.getElementById("menu-img");
const possibleFID = [...Array(fidThreshold[6]).keys()];
const increment = 50; // Number of items to load at a time
let renderLimit = 0; // Start with no items
let showMoveLearn = []; // Filtered moves to show the sources of
let filterToEnter = null;
let tabSelect = 0;
let lockedFilters = []; // List of all locked filters
let lockedFilterMods = []; // List of filter mods objects
let lockedFilterGroups = [[]]; // Grouped together for OR
let lockedOR = []; // 0 for AND, 1 for OR
let isMobile = false;
let filteredItems = null;
let shinyState = 0;   // Global state of shiny   (0,1,2,3)
let abilityState = 0; // Global state of ability (0,1,2,3)

// Set up the header columns
let headerColumns = [];
const headerNames = ['Dex', 'Shiny', 'Species', 'Types', 'Abilities', 'Egg Moves', 'Cost', 'BST', 'HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
const sortAttributes = ['rowno', 'shiny', 'spec', 'type1', 'ab', 'moves', 'cost', 'bst', 'hp', 'atk', 'def', 'spa', 'spd', 'spe'];
headerNames.forEach((thisHeaderName, index) => {
  const newColumn = document.createElement('div');
  newColumn.innerHTML = thisHeaderName;
  newColumn.sortattr = sortAttributes[index];
  newColumn.textDef = thisHeaderName;
  newColumn.className = 'header-column';
  newColumn.addEventListener('click', () => {updateHeader(newColumn)} );
  headerColumns.push(newColumn); // Push the column element into the array
});
openMenuButton.addEventListener('mouseover', () => {openMenuButton.src = `ui/menu${(isMobile?18:30)}h.png`;});
openMenuButton.addEventListener('mouseout',  () => {openMenuButton.src = `ui/menu${(isMobile?18:30)}.png`;});       
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
  if (abilityState == 2) {
    filteredItems = filteredItems.filter(item => item.hab != '')
  }
  if (lockedFilters.length > 0) {
    filteredItems = filteredItems.filter(item => // Search for filters with their fid as key
      lockedFilterGroups.every(thisGroup =>      // All groups, but some from each group
        thisGroup.some(thisLockedFID => {
          if (fidToCategory(thisLockedFID) == 'Ability' && abilityState != 0) {
            if (abilityState == 1) {
              return item?.[thisLockedFID] == 309 || item?.[thisLockedFID] == 310
            } else if (abilityState == 2) {
              return item?.[thisLockedFID] == 311
            } else if (abilityState == 3) {
              return item?.[thisLockedFID] == 312
            }
          } else if (fidThreshold[2] <= thisLockedFID && thisLockedFID < fidThreshold[3]) { // Gen filters
            return (item.gen == thisLockedFID-fidThreshold[2]+1)
          } else if (fidThreshold[3] <= thisLockedFID && thisLockedFID < fidThreshold[4]) { // Cost filters
            return (item.cost == thisLockedFID-fidThreshold[3]+1)
          } else if (thisLockedFID == fidThreshold[4]) { // Gender filter
            return (item.fem == 1)
          } else if (thisLockedFID == fidThreshold[5]) { // Flipped stat filter
            return true
          }
          return thisLockedFID in item
    }))) 
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
      let effectiveSort = sortState.column;
      if (lockedFilters.some((f) => f == fidThreshold[5])) { // If flipped mode
        if (sortState.column == 'hp')  {effectiveSort = 'spe';}
        if (sortState.column == 'atk') {effectiveSort = 'spd';}
        if (sortState.column == 'def') {effectiveSort = 'spa';}
        if (sortState.column == 'spa') {effectiveSort = 'def';}
        if (sortState.column == 'spd') {effectiveSort = 'atk';}
        if (sortState.column == 'spe') {effectiveSort = 'hp' ;}
      }
      filteredItems.sort((a, b) => { // Sort by other attribute
        if (a[effectiveSort] < b[effectiveSort]) return sortState.ascending ? -1 : 1;
        if (a[effectiveSort] > b[effectiveSort]) return sortState.ascending ? 1 : -1;
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
    const pokeImg = document.createElement('img');  // Show image of the pokemon
    pokeImg.className = 'item-image';    pokeImg.stars = [];
    pokeImg.shinyOverride = shinyState;  pokeImg.femOverride = lockedFilters.some((f) => f == fidThreshold[4]);
    pokeImg.src = `images/${item.img}_${pokeImg.shinyOverride}${(pokeImg.femOverride ? 'f' : '')}.png`; 
    
    // Create the dex column, with stars and pin only on desktop
    const dexColumn = document.createElement('div');  dexColumn.className = 'item-column';
    const starColumn = document.createElement('div'); starColumn.className = 'item-column';
    const pinColumn = document.createElement('div');  pinColumn.className = 'item-column';
    const pinImg = document.createElement('img');     pinImg.className = 'pin-img';   pinImg.src = 'ui/pin.png';
    const femImg = document.createElement('img');     femImg.className = 'pin-img';   femImg.src = `ui/fem${(pokeImg.femOverride ? 'on' : 'off')}.png`;
    if (item.fem == 1) {
      femImg.addEventListener('click', () => { // Add click event to the fem button
        pokeImg.femOverride = 1-pokeImg.femOverride; // Flip the fem state
        pokeImg.src = `images/${item.img}_${pokeImg.shinyOverride}${(pokeImg.femOverride ? 'f' : '')}.png`; 
        femImg.src = `ui/fem${(pokeImg.femOverride ? 'on' : 'off')}.png`;
      });
      femImg.addEventListener('mouseover', () => {femImg.src = `ui/femon.png`;});
      femImg.addEventListener('mouseout',  () => {femImg.src = `ui/fem${(pokeImg.femOverride ? 'on' : 'off')}.png`;});
    }
    for (let i = 1; i < 4; i++) {
      if (item.shvar >= i) {
        const starImg = document.createElement('img'); starImg.className = 'star-img';
        starImg.src = `ui/shiny${i}${(shinyState==i ? '' : 'g')}.png`;
        starImg.addEventListener('click', () => { // Add click events to all the stars, changing the poke image
          pokeImg.stars.forEach((thisStar) => thisStar.src = 'ui/shiny1g.png');
          pokeImg.shinyOverride = (pokeImg.shinyOverride==i ? 0 : i);
          pokeImg.src = `images/${item.img}_${pokeImg.shinyOverride}${(pokeImg.femOverride ? 'f' : '')}.png`;  
          starImg.src = `ui/shiny${i}${(pokeImg.shinyOverride==i ? '' : 'g')}.png`;
        });
        starImg.addEventListener('mouseover', () => {starImg.src = `ui/shiny${i}.png`;});
        starImg.addEventListener('mouseout',  () => {starImg.src = `ui/shiny${i}${(pokeImg.shinyOverride==i ? '' : 'g')}.png`;});
        pokeImg.stars.push(starImg);
      }
    }
    if (isMobile) { // Append to three different columns on mobile
      pinColumn.appendChild(pinImg);
      dexColumn.innerHTML = '<b><a href="https://wiki.pokerogue.net/pokedex:' + item.dexno + '" target="_blank">#' + item.dexno + '</a></b><br>';
      pokeImg.stars.forEach((thisStar) => starColumn.appendChild(thisStar));
      if (item.fem == 1) {
        femImg.className = 'star-img';
        starColumn.appendChild(femImg);
      }
    } else { // Append all to the dex column on desktop
      dexColumn.appendChild(item.fem == 1 ? femImg : pinImg);
      const dexText = document.createElement('div');
      dexText.innerHTML = '<b><a href="https://wiki.pokerogue.net/pokedex:' + item.dexno + '" target="_blank">#' + item.dexno + '</a></b><br>';
      dexColumn.appendChild(dexText);
      pokeImg.stars.forEach((thisStar) => dexColumn.appendChild(thisStar));
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
    '<p style="color:rgb(' + (abilityState==0||abilityState==1 ? '255, 255, 255' : '145,145,145') + '); margin: 0;">' + item.ab1 + '</p>' +
    '<p style="color:rgb(' + (abilityState==0||abilityState==1 ? '255, 255, 255' : '145,145,145') + '); margin: 0;">' + item.ab2 + '</p>' +
    '<p style="color:rgb(' + (abilityState==0||abilityState==2 ? '240, 230, 140' : '120,120,120') + '); margin: 0;">' + item.hab + '</p>' +
    '<p style="color:rgb(' + (abilityState==0||abilityState==3 ? '140, 130, 240' : '145,145,145') + '); margin: 0;">' + item.pas + '</p></b>';

    // Show the column of egg moves, or filtered moves and their sources
    const moveColumn = document.createElement('div');  moveColumn.className = 'item-column';  moveColumn.innerHTML = '';
    let numMovesShown = 0;
    showMoveLearn.forEach((thisMove) => {
      if (thisMove in item && numMovesShown < 2) { 
        numMovesShown += 1;
        let source = item[thisMove];
        let sourceText = 'fail';
        if (source == -1) {sourceText = '<span style="color:rgb(240, 173, 131);">Memory';}
        else if (source == 0) {sourceText = '<span style="color:rgb(131, 182, 239);">Evolution';}
        else if (source == 201) {sourceText = '<span style="color:rgb(255, 255, 255);">Egg Move';}
        else if (source == 202) {sourceText = '<span style="color:rgb(240, 230, 140);">Rare Egg Move';}
        else if (source == 203) {sourceText = '<span style="color:rgb(255, 255, 255);">Common TM';}
        else if (source == 204) {sourceText = '<span style="color:rgb(131, 182, 239);">Great TM';}
        else if (source == 205) {sourceText = '<span style="color:rgb(240, 230, 140);">Ultra TM';}
        else {sourceText = '<span style="color:rgb(255, 255, 255);">Lv ' + item[thisMove];}
        moveColumn.innerHTML = moveColumn.innerHTML + '<b><p style="color:rgb(140, 130, 240); margin: 0;">' 
                             + fidToName[thisMove] + ':<br>' + sourceText + '</span></p></b>';
      }
    });
    if (showMoveLearn.length == 0) {
      moveColumn.innerHTML = '<b>' + item.egg1 + '<br>' + item.egg2 + '<br>' + item.egg3 + '<br>' +
                             '<span style="color:rgb(240, 230, 140);">' + item.egg4 + '</span></b>';
    }

    const costColumn = document.createElement('div'); // Show the cost, colored by the egg tier
          costColumn.className = 'item-column'; costColor = 'rgb(255, 255, 255)';
          if      (item.eggtier == 1) {costColor = 'rgb(131, 182, 239)';}
          else if (item.eggtier == 2) {costColor = 'rgb(240, 230, 140)';}
          else if (item.eggtier == 3) {costColor = 'rgb(216, 143, 205)';}
          else if (item.eggtier == 4) {costColor = 'rgb(239, 131, 131)';}
          costColumn.innerHTML = `<b>Cost<br><span style="color:${costColor};">${item.cost}</span></b>`;  
    let flipped = lockedFilters.some((f) => f == fidThreshold[5]);                
    const bstColumn = document.createElement('div');  bstColumn.className = 'item-column'; // Create the stats columns
           bstColumn.innerHTML = '<b>BST<br>' + item.bst +'</b>';
    const hpColumn = document.createElement('div');   hpColumn.className = 'item-column';  
          hpColumn.innerHTML = '<b>HP<br>' + (flipped ? item.spe : item.hp) +'</b>';
    const atkColumn = document.createElement('div');  atkColumn.className = 'item-column'; 
          atkColumn.innerHTML = '<b>Atk<br>' + (flipped ? item.spd : item.atk) +'</b>';    
    const defColumn = document.createElement('div');  defColumn.className = 'item-column'; 
          defColumn.innerHTML = '<b>Def<br>' + (flipped ? item.spa : item.def) +'</b>';    
    const spaColumn = document.createElement('div');  spaColumn.className = 'item-column'; 
          spaColumn.innerHTML = '<b>SpA<br>' + (flipped ? item.def : item.spa) +'</b>';    
    const spdColumn = document.createElement('div');  spdColumn.className = 'item-column'; 
          spdColumn.innerHTML = '<b>SpD<br>' + (flipped ? item.atk : item.spd) +'</b>';    
    const speColumn = document.createElement('div');  speColumn.className = 'item-column'; 
          speColumn.innerHTML = '<b>Spe<br>' + (flipped ? item.hp : item.spe) +'</b>';

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
  if (fid < fidThreshold[0]) { return 'Type'; }
  else if (fid < fidThreshold[1]) { return 'Ability'; }
  else if (fid < fidThreshold[2]) { return 'Move'; }
  else if (fid < fidThreshold[3]) { return 'Gen'; }
  else if (fid < fidThreshold[4]) { return 'Cost'; }
  else if (fid < fidThreshold[5]) { return 'Gender'; }
  else { return 'Mode'; }
}
function fidToColor(fid) {
  if (fid < fidThreshold[0]) { return ['rgb(255, 255, 255)', typeColors[fidToName[fid]]]; }
  else if (fid < fidThreshold[1]) { return ['rgb(140, 130, 240)', 'rgb(255, 255, 255)']; }
  else if (fid < fidThreshold[2]) { return ['rgb(145, 145, 145)', 'rgb(255, 255, 255)']; }
  else if (fid < fidThreshold[3]) { return ['rgb(131, 182, 239)', 'rgb(255, 255, 255)']; }
  else if (fid < fidThreshold[4]) { return ['rgb(240, 230, 140)', 'rgb(255, 255, 255)']; }
  else if (fid < fidThreshold[5]) { return ['rgb(216, 143, 205)', 'rgb(255, 255, 255)']; }
  else { return ['rgb(255, 255, 255)', 'rgb(239, 131, 131)']; }
}

// Display the filter suggestions *************************
function displaySuggestions() { // Get search query and clear the list
  const query = searchBox.value.toLowerCase().replace(/\s+/g, '');
  let matchingFID = [];   filterToEnter = null;   suggestions.innerHTML = '';
  // Filter suggestions based on query and exclude already locked filters
  matchingFID = possibleFID.filter((fid) => {
      let searchableName = fidToName[fid];
      if (fid >= fidThreshold[2]) { searchableName = `${fidToCategory(fid)}${fidToName[fid]}`; }
      // Contains the search query and is not already locked
      return searchableName.toLowerCase().replace(/\s+/g, '').includes(query) 
          && !lockedFilters.some((f) => f == fid);
  });
  // Erase the list of suggestions if it is too large 
  if (matchingFID.length > 20) { matchingFID = []; } 
  
  // If there is at least one locked filter, remove suggestions that have no matches
  if (lockedFilters.length > 0) {
  // Sort the list of suggestions based on hits in the item list (but still by type/ability/move)
  // (If there are no locked filters, the list is already presorted)
  // Not implemented yet...
  }

  // Highlight a suggestion if tab is hit
  if (matchingFID.length > 0) {
    if (tabSelect > matchingFID.length-1) {tabSelect -= matchingFID.length;}
    filterToEnter = matchingFID[(tabSelect == -1 ? 0 : tabSelect)];
  } 
  matchingFID.forEach((fid) => { // Create the suggestion tag elements
    let newSugg = document.createElement('div');  newSugg.className = 'suggestion';
    newSugg.innerHTML = `<span style="color:${fidToColor(fid)[0]};">${fidToCategory(fid)}: 
                         <span style="color:${fidToColor(fid)[1]};">${fidToName[fid]}</span></span>`;  
    newSugg.addEventListener("click", () => lockFilter(fid))
    if (filterToEnter == fid && tabSelect != -1) {newSugg.style.borderColor = 'rgb(140, 130, 240)';}
    suggestions.appendChild(newSugg);
  });
}

// Lock a filter *************************
function lockFilter(newLockFID) {
  if (!lockedFilters.some( (f) => f == newLockFID)) {
    lockedFilters.push(newLockFID); // Add the filter to the locked filters container
    // console.log(newLockFID); console.log(fidToName[newLockFID]);
    let filterMod = null;
    if (lockedFilters.length > 1) {
      filterMod = document.createElement("span"); filterMod.innerHTML = '&';
      filterMod.className = "filter-mod";         filterMod.toggleOR = 0;
      filterMod.addEventListener("click", () => toggleOR(filterMod));
      lockedFilterMods.push(filterMod); filterContainer.appendChild(filterMod);
    }
    const filterTag = document.createElement("span"); filterTag.className = "filter-tag";
    const img = document.createElement('img');        img.src = 'ui/lock.png';    filterTag.appendChild(img);
    filterTag.innerHTML = filterTag.innerHTML + `${fidToCategory(newLockFID)}: ${fidToName[newLockFID]}`;
    filterTag.addEventListener("click", () => removeFilter(newLockFID, filterTag, filterMod));
    filterContainer.appendChild(filterTag);
    // Refresh suggestions and items
    searchBox.value = ""; // Clear the search bar after locking
    updateFilterGroups();   displaySuggestions();   refreshAllItems();
    if (fidToCategory(newLockFID) === 'Move' && sortState.column === 'rowno') {
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
    filterModToRemove = lockedFilterMods[0]; // If removing first filter, also remove mod attached to second filter
  }
  // Remove the filter from the filter list, and remove the actual filter tag
  lockedFilters = lockedFilters.filter( (f) => f != fidToRemove );  filterTag.remove();
  lockedFilterMods = lockedFilterMods.filter( (f) => f != filterModToRemove ); // Remove from the mod list
  if (filterModToRemove) {filterModToRemove.remove();} // Remove the actual mod element
  // Refresh suggestions and items
  updateFilterGroups();   displaySuggestions();   refreshAllItems();
  // Reset the sorting if there aren't any more locked moves
  if (sortState.column === 'moves' && !lockedFilters.some((f) => fidToCategory(f) == 'Move')) { 
    updateHeader(headerColumns[0]); 
  } else { 
    updateHeader(null, true); 
  }
  if (lockedFilters.length == 0) { // Reset the animation of the page title
    pageTitle.classList.remove('colorful-text');  void pageTitle.offsetWidth;
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
  // console.log(clickTarget?.sortattr)
  if (clickTarget == null) {clickTarget = currentTarget; ignoreFlip = true;}
  // Find the new sorting attribute, and update the headers
  const sortAttribute = clickTarget?.sortattr;
  // Set the text of the move column, depending on if a move is filtered
  if (showMoveLearn[0] != null) {
    headerColumns[5].textDef = '<span style="color:rgb(140, 130, 240);">' 
                             + (isMobile ? 'Moves' : 'Filtered Moves') + '</span>';
  } else {
    headerColumns[5].textDef = (isMobile ? 'Egg Moves' : 'Egg Moves');
  }
  if (sortAttribute == 'shiny') { // Toggle the global shiny state
    shinyState = (shinyState == 0 ? 3 : shinyState-1);
    if (shinyState) {
      headerColumns[1].innerHTML = '<span style="color:rgb(140, 130, 240);">Shiny</span>';
      const starImg = document.createElement('img');
      starImg.className = 'star-header';
      starImg.src = `ui/shiny${shinyState}.png`;
      headerColumns[1].appendChild(starImg);
    } else {
      headerColumns[1].innerHTML = 'Shiny';
    }
  } else if (sortAttribute == 'ab') { // Toggle the global ability state
    abilityState = (abilityState == 3 ? 0 : abilityState+1);
    if (abilityState) {
      headerColumns[4].innerHTML = `<span style="color:rgb(140, 130, 240);">Abilities</span>`;
      if (abilityState == 1) {headerColumns[4].innerHTML += `<span style="color:rgb(255, 255, 255); font-size:12px;">(Main Only)</span>`;}
      else if (abilityState == 2) {headerColumns[4].innerHTML += `<span style="color:rgb(240, 230, 140); font-size:12px;">(Hidden Only)</span>`;}
      else if (abilityState == 3) {headerColumns[4].innerHTML += `<span style="color:rgb(140, 130, 240); font-size:12px;">(Passive Only)</span>`;}
    } else {
      headerColumns[4].innerHTML = 'Abilities';
    }
  } else {
    headerColumns[5].innerHTML = headerColumns[5].textDef;
    if (sortAttribute) { // Clicked on a header that can actually be sorted
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
      clickTarget.innerHTML = clickTarget.textDef + '<br><span style="color:rgb(140, 130, 240); font-family: serif;">' + (sortState.ascending ? "&#9650;" : "&#9660;") + '</span>';
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
    openMenuButton.src = (isMobile ? 'ui/menu18.png' : 'ui/menu30.png' );
    // Redraw all the header columns into the header container
    headerContainer.innerHTML = '';
    const thisRow = document.createElement('div'); thisRow.className = 'header-row';
    if (isMobile) {
      thisRow.appendChild(headerColumns[0]);  thisRow.appendChild(headerColumns[1]);
      thisRow.appendChild(headerColumns[4]);  thisRow.appendChild(headerColumns[2]);
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
searchBox.focus();

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
searchBox.addEventListener('input', (event) => { // Typing in search box ***************
  tabSelect = -1;
  displaySuggestions();
  refreshAllItems();
});
document.addEventListener('keydown', (event) => { 
  const ignoredKeys = ["Escape", "Tab", "Shift", "PageDown", "PageUp", "Control", "Alt", "Meta", "CapsLock", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (!ignoredKeys.includes(event.key)) { // Ignore certain keys like Tab, Shift, Control, Alt, etc.
    searchBox.focus(); // Focus the search box on any key press
  }
  if (event.key == "Enter" && filterToEnter != null) {
    lockFilter(filterToEnter); // Hit 'Enter' to lock the first filter
  }
  if (event.key == "PageDown" || event.key == "PageUp") {
    searchBox.blur(); // Allow PageUp and PageDown even when in search box
  }
  if (event.key == "Escape") { // Hit escape to clear the search box, or the last filter
    if (splashScreen.classList.contains("show")) { // If a splash screen is up
      splashScreen.classList.remove("show");
    } else if (searchBox.value.length > 0) { // If there is text in the search box
      searchBox.value = ''
      displaySuggestions();
      refreshAllItems();
    } else if (lockedFilters.length > 0) { // If there is a locked filter
      const lastFilter = lockedFilters[lockedFilters.length - 1];
      const filterTags = document.querySelectorAll(".filter-tag");
      const lastFilterTag = filterTags[filterTags.length - 1];
      const lastFilterMod = lockedFilterMods[lockedFilterMods.length - 1];
      if (lastFilter && lastFilterTag) {
        removeFilter(lastFilter, lastFilterTag, lastFilterMod); // Remove the last filter
      }
    } else if (shinyState || abilityState) { // Clear all header restrictions
      shinyState = 0;
      headerColumns[1].innerHTML = 'Shiny';
      abilityState = 0;
      headerColumns[4].innerHTML = 'Abilities';
      updateHeader();
    }
  }
  if (event.key == "Tab" && document.activeElement == searchBox) {
    if (tabSelect == -1) {tabSelect = 0;}
    tabSelect += 1;
    displaySuggestions();
    event.preventDefault();
  }
});
  // Close splash screen when clicking outside the content box
splashScreen.addEventListener("click", (event) => {
  if (event.target === splashScreen) {
    splashScreen.classList.remove("show");
  }
});
// Show the splash screen14O1480
openMenuButton.addEventListener("click", () => {
  splashContent.innerHTML = `
  <b>This is a <span style="color:rgb(140, 130, 240);">fast and powerful search</span> for Pokerogue.</b><br><br>
  <span style="color:rgb(255, 255, 255);"> Using the search bar and headers, you can search for abilities, see when moves are learned, sort by highest stats, see which Pokemon have shiny variants, and much more. </span><br><br>
  <b>Dex</b> column links to the <a href="https://wiki.pokerogue.net/start" target="_blank">Official Wiki</a>.<br><br>
  <b>Shiny</b> column can be clicked on to only show Pokemon with shiny variants.<br><br>
  <span style="color:rgb(255, 255, 255);"><b>Ability</b> column shows <b>Main Abilities</b>, 
  <span style="color:rgb(240, 230, 140);"><b>Hidden Ability</b></span>, and 
  <span style="color:rgb(140, 130, 240);"><b>Passive</b></span>. 
  <span style="color:rgb(145, 145, 145);">Click the header to restrict to one of those categories.</span><br><br>
  <b>Egg Move</b> column shows <b>Normal</b> and <span style="color:rgb(240, 230, 140);"><b>Rare</b></span> egg moves. 
  <span style="color:rgb(145, 145, 145);">After searching for a move, the header will update to show who learns the move first.</span><br><br>
  <b>Cost</b> column is colored by <b>Egg Tier</b>:<br> 
  <b>Common</b>, <span style="color:rgb(131, 182, 239);"><b>Rare</b></span>, <span style="color:rgb(240, 230, 140);"><b>Epic</b></span>, <span style="color:rgb(239, 131, 131);"><b>Manaphy</b></span>, <span style="color:rgb(216, 143, 205);"><b>Legendary</b></span><br>
  <span style="color:rgb(145, 145, 145);">Chance of rare egg move is <span style="color:rgb(255, 255, 255);"><b>1</b></span> in <span style="color:rgb(255, 255, 255);"><b>48</b></span>/<span style="color:rgb(131, 182, 239);"><b>24</b></span>/<span style="color:rgb(240, 230, 140);"><b>12</b></span>/<span style="color:rgb(239, 131, 131);"><b>12</b></span>/<span style="color:rgb(216, 143, 205);"><b>6</b></span>.<br>Chance is doubled for candy eggs and move gacha.</span><br><br>
  <span style="color:rgb(145, 145, 145); font-size:11px">This site was created by Sandstorm, through a lot of hard work. I do not store any cookies or collect any personal data. Images and game data are from the Pokerogue Github. All asset rights are retained by their original creators.</span>`;
  // Show Patch Notes &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Change Language
  // ${patchNotes}
  splashScreen.classList.add("show"); // Make it visible
});