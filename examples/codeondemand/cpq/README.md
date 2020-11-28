# CPQ

This is an example of how we can create an editor.

## C - Configuration
This is the heart of the gui. We configure the thing we want to buy. 
* If we are doing a coffee shop this could be 
   * Coffee with soy milk, in a large cup, eat in with an extra shot and some caramel essence and chocolate on the top
* If we are hiring a car it could be
   * An Audi with 5 doors, petrol,  black paint, fluffy die on the mirror and a tow bar
   
## P - Pricing
In this example the pricing is done by the backend. The pricing model is complicated and requires 
integration with ERP systems and other sophisticated options

## Q - Quotiation (or order?)
Here we 'checkout' the product and purchase it. Not shown in the demo other than 'an alert box'

# What is happening?
We get json from the backend. This json
* Data about the whole configuration (for example the price)
* A list of filters which can be used to display and select the options

These filters use `codeondemand` to control what is display. So for example 
a coffeeshop milkfilter might have images, while other filters might show a range or a textual drop down







   