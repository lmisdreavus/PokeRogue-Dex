// script.js
// Imported items, possibleFilters, typeColors
// const possibleFilters = [ // Imported from file, this is for reference
//   {categ:'Type', value:'Bug'},
//   {categ:'Ability', value:'Chlorophyll'},
//   {categ:'Move', value:moveIDnum},
// ];

const itemList = document.getElementById('itemList');
const searchBox = document.getElementById('searchBox');
searchBox.focus();
const headerRow = document.querySelector('.header-row');
const filterContainer = document.getElementById("filter-container");
const suggestions = document.getElementById("suggestions");
let suggestionPreview = null;
let lockedFilters = [];

// Track the current sort state
let sortState = { column: 'dexno', ascending: true };
// Track current sorted column
let currentTarget = document.querySelector('.header-row span');

let dictOfSets = { // TEST FOR PREFILTERING
  groupA: new Set([1, 2, 3]),
  groupB: new Set([4, 5, 6]),
  groupC: new Set([7, 8, 9]),
};

// Display items based on query and locked filters
function displayItems() {
  const query = searchBox.value.toLowerCase();
  itemList.innerHTML = ""; // Clear existing items
  let filteredItems = items
  // if (suggestionPreview != null) {
  //   filteredItems = items.filter(item =>
  //     // item.spec.toLowerCase().includes(suggestionPreview.value.toLowerCase())
  //     suggestionPreview.value.trim().toLowerCase().replace(/\s+/g, '') in item 
  // );}
  if (query.length > 0) {
    filteredItems = items.filter(item =>
      item.spec.toLowerCase().includes(query) ||
      item.ab1.toLowerCase().includes(query) ||
      item.ab2.toLowerCase().includes(query) ||
      item.hab.toLowerCase().includes(query) ||
      item.pas.toLowerCase().includes(query) ||
      item.type1.toLowerCase().includes(query) ||
      item.type2.toLowerCase().includes(query)
      || suggestionPreview?.value.trim().toLowerCase().replace(/\s+/g, '') in item 
  );}
  // if (query.length === 1) { // Prefilter
  //     let uu = 'groupA';
  //     filteredItems = items.filter((_, index) => dictOfSets[uu].has(index))
  //     console.log(query.length)
  // }
  if (lockedFilters.length > 0) {
    lockedFilters.forEach(thisLockedFilter => { // Apply the locked filters
      if (thisLockedFilter.categ == "Type") { // Search for types in either slot
        filteredItems = filteredItems.filter(item => item.type1.includes(thisLockedFilter.value) || item.type2.includes(thisLockedFilter.value))
      }
      if (thisLockedFilter.categ == "Ability") { // Search for abilities in all four slots
        filteredItems = filteredItems.filter(item => item.ab1.includes(thisLockedFilter.value) || item.ab2.includes(thisLockedFilter.value)
        || item.hab.includes(thisLockedFilter.value) || item.pas.includes(thisLockedFilter.value))
      }
      if (thisLockedFilter.categ == "Move") { // Search for moves with their designated dict key
        filteredItems = filteredItems.filter(item => 
          thisLockedFilter.value.trim().toLowerCase().replace(/\s+/g, '') in item )
      }
    })
  }
  // Sort items if a column is specified
  if (sortState.column) {
    filteredItems.sort((a, b) => {
      if (a[sortState.column] < b[sortState.column]) return sortState.ascending ? -1 : 1;
      if (a[sortState.column] > b[sortState.column]) return sortState.ascending ? 1 : -1;
      return 0;
    });
  }

  filteredItems.forEach(item => { // Generate each list item dynamically
    const li = document.createElement('li'); // Entry of one Pokemon
    
    // Create each column and set its text
    const dexColumn = document.createElement('div');
    dexColumn.className = 'item-column';
    dexColumn.innerHTML = '<b>' + item.dexno + '</b>';
    
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.dexno;
    img.className = 'item-image';
    dexColumn.appendChild(img);

    const specColumn = document.createElement('div');
    specColumn.className = 'item-column';
    specColumn.innerHTML = '<b>' + item.spec + '</b>';

    const typeColumn = document.createElement('div');
    typeColumn.className = 'item-column';
    const typeColor1 = "#0000FF";
    typeColumn.innerHTML = '<p style="color:' + typeColors[item.type1] + '; margin: 0;"><b>' + item.type1 + '</p>' 
                         + '<p style="color:' + typeColors[item.type2] + '; margin: 0;">'    + item.type2 + '</b></p>';

    const abilityColumn = document.createElement('div');
    abilityColumn.className = 'item-column';
    abilityColumn.innerHTML = '<b>' +
    '<p style="margin: 0;">' + item.ab1 + '</p>' +
    '<p style="margin: 0;">' + item.ab2 + '</p>' +
    '<p style="color:rgb(240, 230, 140); margin: 0;">' + item.hab + '</p>' +
    '<p style="color:rgb(140, 130, 240); margin: 0;">' + item.pas + '</p></b>';

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

    // Append columns to the Pokemon entry
    li.appendChild(dexColumn);      li.appendChild(img);             li.appendChild(specColumn);
    li.appendChild(typeColumn);     li.appendChild(abilityColumn);   li.appendChild(bstColumn);
    li.appendChild(hpColumn);       li.appendChild(atkColumn);       li.appendChild(defColumn);
    li.appendChild(spaColumn);      li.appendChild(spdColumn);       li.appendChild(speColumn);

    // Append the item to the list of Pokemon
    itemList.appendChild(li);
  });
}

function getBackgroundClass(categ) {
  // Return different classes based on the category
  if (categ === 'Ability')    { return 'suggestion-ability'; }
  else if (categ === 'Move')  { return 'suggestion-move';    }
  else                        { return 'suggestion-default'; }
}

// Display the filter suggestions *************************
function displaySuggestions() {
  const query = searchBox.value.toLowerCase();
  // Filter suggestions based on query and exclude already locked filters
  let matchingSuggestions = [];
    matchingSuggestions = possibleFilters.filter(
      (attr) => attr.value.toLowerCase().includes(query) // Contains the search query and is not already locked
        && !lockedFilters.some((f) => f.categ.includes(attr.categ) && f.value.includes(attr.value)));

        // Erase the list of suggestions if it is too large 
        if (matchingSuggestions.length > 20) {
          matchingSuggestions = [];
          suggestionPreview = null; } 
        
        // If there is at least one locked filter, remove suggestions that have no matches
        
        // Sort the list of suggestions based on hits in the item list (but still by type/ability/move)
        // (If there are no locked filters, the list is already presorted)
        
        
        // Apply the first suggestion to the preview filter
        if (matchingSuggestions.length > 0) {suggestionPreview = matchingSuggestions[0]} 


        suggestions.innerHTML = matchingSuggestions.map( (attr, index) => {
            let suggColor = 'rgb(255, 255, 255)' // Default color for type
            if (attr.categ == 'Ability') { suggColor = 'rgb(140, 130, 240)'; }
            if (attr.categ == 'Move')    { suggColor = 'rgb(145, 145, 145)'; }
            return `<span class="suggestion ${getBackgroundClass(attr.categ)}" 
                              data-categ="${attr.categ}" data-value="${attr.value}" 
                              style="${(attr.categ == 'Type' ? 'color:'+typeColors[attr.value]+'; ':'')} margin: 0;">
                              <span class="suggestion-category" style="color:${suggColor};">
                              ${attr.categ}: </span>${attr.value}</span>`  
          }).join("");
          // Add click event to suggestions
          document.querySelectorAll(".suggestion").forEach((el) => el.addEventListener("click", () =>
              lockFilter({categ:el.getAttribute("data-categ"),value:el.getAttribute("data-value")})
        )
      );
}

// Lock a filter *************************
function lockFilter(newLockFilter) {
  if (!lockedFilters.some( (f) => newLockFilter.categ.includes(f.categ) && newLockFilter.value.includes(f.value) )) {
    lockedFilters.push(newLockFilter);
    // Add the filter to the locked filters container
    const filterTag = document.createElement("span");
    filterTag.className = "filter-tag";
    filterTag.innerHTML = `&#x1F50E;&#xFE0E; ${newLockFilter.categ}: ${newLockFilter.value}`;
    filterTag.addEventListener("click", () => removeFilter(newLockFilter, filterTag));
    filterContainer.appendChild(filterTag);
    // Refresh suggestions and items
    searchBox.value = ""; // Clear the search bar after locking
    displaySuggestions();
    displayItems();
    searchBox.focus();
    // console.log("Filter added successfully:", newLockFilter);
  } else {
    // console.log("Duplicate filter ignored:", newLockFilter);
  }
  // console.log("Locked filters after adding:", lockedFilters);
}

// Remove a filter **************************
function removeFilter(filterToRemove, filterTag) {
  const key = `${filterToRemove.categ}:${filterToRemove.value}`;
  lockedFilters = lockedFilters.filter(
    (f) => !filterToRemove.categ.includes(f.categ) || !filterToRemove.value.includes(f.value)
  );
  // Remove the filter tag
  filterTag.remove();
  // Refresh suggestions and items
  displaySuggestions();
  displayItems();
  searchBox.focus();
}

// Event listener for the header row - Clicking on the header row to sort ***************
headerRow.addEventListener('click', event => {
  const target = event.target.closest("span");
  const sortAttribute = target?.getAttribute('data-sort');
  if (sortAttribute) {
    // Toggle sort direction if sorting by the same column
    if (sortState.column === sortAttribute) {
      sortState.ascending = !sortState.ascending;
    } else {
      sortState.column = sortAttribute;
        sortState.ascending = (sortState.column == "dexno")||(sortState.column == "spec")
                            ||(sortState.column == "type1")||(sortState.column == "ab1");
    }
    if (currentTarget?.getAttribute('text-def')) { // Clear arrow from previous target
      currentTarget.innerHTML = currentTarget?.getAttribute('text-def');
    }
    currentTarget = target; // Draw arrow on new target
    target.innerHTML = target?.getAttribute('text-def') + '<br><p style="color:rgb(140, 130, 240); margin: 0;">' + (sortState.ascending ? "▲" : "▼") + '</p>';
  }
  // Update the display
  displaySuggestions();
  displayItems();
});

// Initial display
displaySuggestions();
displayItems();

searchBox.addEventListener('input', () => { // Typing in search box ***************
  // if (searchBox.value.length > 1) {
    displaySuggestions();
    displayItems();
  // }
});

document.addEventListener('keydown', (event) => {
  // Ignore certain keys like Tab, Shift, Control, Alt, etc.
  const ignoredKeys = ["Tab", "Shift", "Control", "Alt", "Meta", "CapsLock", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (!ignoredKeys.includes(event.key)) {
    searchBox.focus();
  }
});
document.addEventListener('keydown', (event) => { // Hit 'Enter' to lock the first filter
  if (event.key == "Enter" && suggestionPreview != null) {
    lockFilter(suggestionPreview);
  }
});
document.addEventListener('keydown', (event) => { // Hit escape to clear the search box, or the last filter
  if (event.key == "Escape") {
    if (searchBox.value.length > 0) {
      searchBox.value = ''
      displaySuggestions();
      displayItems();
    } else if (lockedFilters.length > 0) {
      const lastFilter = lockedFilters[lockedFilters.length - 1];
      const filterTags = document.querySelectorAll(".filter-tag");
      const lastFilterTag = filterTags[filterTags.length - 1];
      if (lastFilter && lastFilterTag) {
        removeFilter(lastFilter, lastFilterTag); // Remove the last filter
      }
    }
  }
});