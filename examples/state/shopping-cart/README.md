# Shopping Cart Example

## Comments on this example and 'reality'
The react example is an extremely unrealistic situation. The inventory is not going to be maintained in the website: it is
maintained by a backend. It has to be, because multiple people are editing it, and the inventory will be constantly
changing. 

The details of how the inventory is impacted by a user putting items into a shopping cart varies by domain and by website.
For example when selecting a hotel room it is not uncommon to be able to reserve the room as an explicit user action.
Normally the 'new inventory' will be provided by the back end in the form of the items that are available.

## Complexities we need to think about
* When we add the first item to the shopping cart, it is not present, so we create a new one.
* When we add the same item a second time we want to update the quantity
Removing has the same kind of complexity
  
Lens out of the box point to a single thing. That thing can be 'the list of products', and 'the list of inventory'. 

We can take the lens from the component (to the inventory item, or the product item), combine it to a second lens (to the 'other' list
and point to 
 { listWeAreManipulating: P,  (P is a generic that is either an inventory item or a cart item... only difference is the name of the 'quantity' field)
 { item: P}

reduceCountByOne:
   decrement count in the item  (this is the )
   Find item in list. If exists, increment count, if not add a new item

deleteLogic
   increment 


The deleteLogic that remove the item from the list.
   



### Domain methods to the rescue



## How we update the Cart from the inventory display, and the inventory from the cart display
Lens compose. 

In the domain we have a lens that goes from the 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

