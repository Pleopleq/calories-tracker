// storage controller
const StorageCtrl = (function (){
    //Public methods
    return {
        storeItem: function (item){
            let items;
            //check if any items in ls
            if (localStorage.getItem('items') === null){
                items = [];
                //push the new item
                items.push(item);
                // set lS
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //get what is already in lS 
                items = JSON.parse(localStorage.getItem('items'));
                //push new item
                items.push(item);
                //re set LS
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function (){
            localStorage.removeItem('items');
        }
    }
})();

//ITEM CONTROLLER
const ItemCtrl = (function (){
    //Item constructo
    const Item = function (id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    //Data Structue / state
    const data = {
        // items: [
        //     // {id: 0, name: 'steak', calories: 1200},
        //     // {id: 1, name: 'cookie', calories: 1200},
        //     // {id: 2, name: 'eggs', calories: 1200}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

//PUBLIC METHODS
    return {
        getItems:function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            //create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1]. id + 1;
            } else {
                ID = 0;
            }
            //CALORIES TO NUMBER
            calories = parseInt(calories);
            //create a new item
            newItem = new Item(ID, name, calories);
            //add to item array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id){
            let found = null;
            //loop through items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updatedItem: function(name, calories){
            //calories to number
            calories = parseInt(calories);
            let found = null;

            data.items.forEach(function(item){
                if (item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found;
        },
        deleteItem: function(id){
            //Get ids
            const ids = data.items.map(function(item){
                return item.id;
            });

            //get index
            const index = ids.indexOf(id);

            //remove item from arr
            data.items.splice(index,1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem:function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;
            //loop through items and add cals
            data.items.forEach( function(item){
                total += item.calories;
            });

            //set total cal in data struture
            data.totalCalories = total;

            //return total cals
            return data.totalCalories;
        },
        logData: function (){
            return data;
        }
    }
})();



//UI CONTROLLER
const UICtrl = (function (){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCalInput: '#item-calories',
        totalCalories: '.total-calories' 
    }
    

    //PUBLIC METHODS
    return {
        populateItemList: function(items){
            let html = '';

            items.forEach(function (item){
                html +=`<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}</strong> <em>${item.calories} calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil-alt"></i>
                </a>
            </li>`;
            });
            //insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCalInput).value
            }
        },
        addListItem: function(item){
            //show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li element
           const li = document.createElement('li');
           //add class to li
           li.className = 'collection-item';
           //add ID
           li.id = `item-${item.id}`;
           //add HTML
           li.innerHTML = `
           <strong>${item.name}</strong> <em>${item.calories} calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil-alt"></i>
                </a>
           `;
           //insert item
           document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}</strong> <em>${item.calories} calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil-alt"></i>
                    </a>
                    `;
                }
            })
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInputs: function(){
            document.querySelector(UISelectors.itemNameInput).value ='';
            document.querySelector(UISelectors.itemCalInput).value ='';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalInput).value =ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //turn node list into array
            listItems = Array.from(listItems);
            
            listItems.forEach(function(item){
                item.remove();
            })
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(e){
            UICtrl.clearInputs();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

//APP CONTROLLER
const App = (function (ItemCtrl, StorageCtrl, UICtrl){
    //load event listeners
    const loadEventListeners = function(){
        //GET UI SELECTORS
        const UISelectors = UICtrl.getSelectors(); 

        //ADD ITEM EVENTS
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //DISABLE SUBMIT ON ENTER
        document.addEventListener('keypress', function (e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })

        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Delete button event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);


        //back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //clear all button event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);


    }
        //Add item submit
        const itemAddSubmit = function(e){
        //get form input from UI controller
        const input = UICtrl.getItemInput();

        //check for name and calories input
        if(input.name !== '' && input.calories !== ''){
            //add item 
        const newItem = ItemCtrl.addItem(input.name, input.calories);
        //add item to UI list
        UICtrl.addListItem(newItem);
        //get the total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //STORE in localStorage
        StorageCtrl.storeItem(newItem);
        //clear inputs
        UICtrl.clearInputs();


        }

        e.preventDefault();
    }

    //CLICK EDIT ITEM
    const itemEditClick = function (e){
        if(e.target.classList.contains('edit-item')){
        //get list item ID (item-0, item-1)
            const listID = e.target.parentNode.parentNode.id;

            //break into an array
            const listIdArr = listID.split('-');

            //get the actual id
            const id = parseInt(listIdArr[1]);

            //get the entire item
            const itemToEdit = ItemCtrl.getItemById(id);

            //SET current item 
            ItemCtrl.setCurrentItem(itemToEdit);

            //add item to form
            UICtrl.addItemToForm();
        }


        e.preventDefault();
    }

    //UPDATE ITEM SUBMIT
    const itemUpdateSubmit = function(e){
        //get item input
        const input = UICtrl.getItemInput();

        //update item
        updatedItem = ItemCtrl.updatedItem(input.name, input.calories);

        //Update UI
        UICtrl.updateListItem(updatedItem);

        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();


        e.preventDefault();
    }

//clear items event
const clearAllItemsClick = function (){
    //Delete all items from data structure
    ItemCtrl.clearAllItems();

    const totalCalories = ItemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    //remove from UI
    UICtrl.removeItems();

    //remove from local storage
    StorageCtrl.clearItemsFromStorage();

    //hide Ui
    UICtrl.hideList();

}

//Delete button event
const itemDeleteSubmit = function(e){
    //get current item
    const currentItem = ItemCtrl.getCurrentItem();

    //delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    //delete from UI
    UICtrl.deleteListItem(currentItem.id);

    const totalCalories = ItemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);

    //delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);


    UICtrl.clearEditState();


    e.preventDefault();
}
    
//PUBLIC MEHTODS
    return{
        init: function(){
            //clear edit state/ set initial state
            UICtrl.clearEditState();
            //fetch items from data structure
            const items = ItemCtrl.getItems();

            //Check if any items 
            if(items.length === 0){
                UICtrl.hideList();
            } else {
                //Populate list with items
                UICtrl.populateItemList(items);
            }
            //get the total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            //load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);


App.init();