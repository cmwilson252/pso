
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}
Array.prototype.randomize = function shuffle() {
    var currentIndex = this.length, temporaryValue, randomIndex;
    
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        
        temporaryValue = this[currentIndex];
        this[currentIndex] = this[randomIndex];
        this[randomIndex] = temporaryValue;
    }
}
Array.prototype.chunk = function (len) {
    var chunks = [],
    i = 0,
    n = this.length;
    
    while (i < n) {
        chunks.push(this.slice(i, i += len));
    }
    
    return chunks;
}

function setupQuests() {
    let ul = document.getElementById('quest-list');
    questListData.forEach(function (quest) {
        let li = document.createElement('li');
        let div = document.createElement('div');
        let label = document.createElement('label');
        let input = document.createElement('input');
        
        input.type = 'checkbox';
        input.checked = quest.enabled;
        input.id = quest.name;
        input.name = quest.name;
        input.value = quest.name;
        
        div.classList.add('mui-checkbox');
        
        label.append(input);
        label.append(quest.name);
        div.append(label);
        li.append(div);
        
        ul.append(li);
    })
}

function setupNamesList() {
    // <div class="mui-textfield mui-textfield--float-label">
    //   <input type="text">
    //   <label>Input 1</label>
    // </div>
    
    let ul = document.getElementById('names-list');
    let li = document.createElement('li');
    let div = document.createElement('div');
    let input = document.createElement('input');
    let label = document.createElement('label');
    
    label.innerText = 'Player Name';
    
    input.type = 'text';
    
    div.classList.add('mui-textfield');
    div.classList.add('mui-textfield--float-label');
    
    div.append(input);
    div.append(label);
    li.append(div);
    ul.append(li);
    
    input.addEventListener('blur', handleNameChange);
    input.addEventListener('keyup', handleEnterKey);
}
function handleEnterKey(event) {
    if (event.keyCode === 13) {
        processNameChange(event.target);
    }
}
function handleNameChange(event) {
    processNameChange(event.target);
}
function processNameChange(el) {
    if (el.value === '') {
        if (el.parentNode.parentNode !== el.parentNode.parentNode.parentNode.lastChild) {
            el.parentNode.parentNode.parentNode.removeChild(el.parentNode.parentNode);
        }
    } else {
        if (el.parentNode.parentNode === el.parentNode.parentNode.parentNode.lastChild) {
            let li = document.createElement('li');
            let div = document.createElement('div');
            let input = document.createElement('input');
            let label = document.createElement('label');
            
            label.innerText = 'Player Name';
            
            input.type = 'text';
            
            div.classList.add('mui-textfield');
            div.classList.add('mui-textfield--float-label');
            
            div.append(input);
            div.append(label);
            li.append(div);
            el.parentNode.parentNode.parentNode.append(li);
            
            input.addEventListener('blur', handleNameChange);
            input.addEventListener('keyup', handleEnterKey);
            
            input.focus();
        }
    }
}

function setupGeneration() {
    let button = document.getElementById('generate-button');
    button.addEventListener('click', generate);
}

function selectRandomQuest() {
    let h2 = document.getElementById('selected-quest');
    let activeQuests = [];
    questListData.forEach(function(quest) {
        let input = document.getElementById(quest.name);
        if (input.checked) {
            activeQuests.push(input.value);
        }
    });
    
    let selectedQuest = activeQuests.random();
    h2.innerText = selectedQuest;
}
function generateParties() {
    let partyMembersSelect = document.getElementById('party-members');
    let partyMemberCount = parseInt(partyMembersSelect.options[partyMembersSelect.selectedIndex].value);
    
    let namesList = document.getElementById('names-list');
    
    let partyMembers = [];
    namesList.childNodes.forEach(function (li) {
        let input = li.firstChild.firstChild;
        if (input.value !== '') {
            partyMembers.push(input.value);
        }
    });
    partyMembers.randomize();
    
    let parties = partyMembers.chunk(partyMemberCount);
    console.log(parties);
    return parties;
}
function displayParties(parties) {
    let ul = document.getElementById('party-list');
    parties.forEach(function(party) {
        let li = document.createElement('li');
        let div = document.createElement('div');
        let h2 = document.createElement('h2');
        let innerUl = document.createElement('ul');
        
        h2.innerText = 'Party '+(ul.childNodes.length + 1);
        
        party.forEach(function (member) {
            let innerLi = document.createElement('li');
            innerLi.innerText = member;
            
            innerUl.append(innerLi);
        });
        
        div.classList.add('mui-panel');
        li.classList.add('mui-col-md-6');
        innerUl.classList.add('mui-list--unstyled');
        
        div.append(h2);
        div.append(innerUl);
        li.append(div);
        ul.append(li);
    });
}

function generate() {
    let partyList = document.getElementById('party-list');
    while (partyList.firstChild) {
        partyList.removeChild(partyList.firstChild);
    }
    
    selectRandomQuest();
    displayParties(generateParties());
}

window.addEventListener('DOMContentLoaded', function() {
    setupQuests();
    setupNamesList();
    setupGeneration();
});