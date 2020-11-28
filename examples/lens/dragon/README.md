#  General nature of problem
 * A complex data structure with repeating structure, needing updating as an immutable thing

## Files
* dragon.ts The datastructure about Dragons
* dragonMethodsWithlens.ts What the code looks like using lens
* dragonMethodsWithoutLens.ts What the code looks like without lens

## Problem
We are writing a game about dragons. The dragons has different body parts and some have 'hit points'.

There are multiple body parts that we can damage: the wings, the chest or the head.

We need to write the following methods:
* Damage(dragon: Dragon, location: ?, amount: Hitpoints): Dragaon
    * The location is some means of references 'wing, chest or head. The amount is a number of hitpoints that are going to be subtracted from that locations hps
    * The hitpoints cannot go below zero
* Heal(dragon: Dragon, location: ?,maxHitpoints: Hitpoints, amount: Hitpoints, )
    * The inverse of damage. Hitpoints can't go above the maxHitpoints
* Eat(dragon: Dragon, thing: any): Dragon
    * the thing is added to the stomach

# Handling change

Let us now assume that there are two stories on the backlog
* Rename all the fields called 'hitpoint' to 'hp'
* Move the wings data structure so that they are not under 'body' but directly under dragon
* We are going to add People to project
** People have locations (head, chest). We are going to write heal, damage and eat methods for them 
# Solutions

## Dragon without lens
* Observe the size of code difference between dragon with lens and without.
* Observe the size of test difference between dragon with lens and without.
* Observe how every single business method is tightly coupled to the data structure
* Look at how much test data the tests need, and how basically unreadable the tests are:
** I made many typo errors when making the tests, and it took a lot of effort to actually beleive it was 
* When the tests go wrong it is hard to work out what is happening as the code is comparing two large data structures with each other
* Read the backlog and weep

## Dragon with lens
* Look at the size difference in the code
* Look at the tests: observe that we can test the methods heal and damage in isolation from the actual structure,
** This is actually easier to create and thing about (IMO)
** And isolates the tests of those business methods from the dragon data structure
* When the tests go wrong it is hard to work out what is happening as the code is comparing two large data structures with each other
** This is a clear sign we should improve the code and the tests!


## Impact of change on code with lens

* Move the wings data structure so that they are not under 'body' but directly under dragon
    * We change the two variables dragonLeftWingHpL and dragonRightWingHpL
    * No business logic method was impacted
    * The tests were impacted: please see how they have been structured to allow this kind of change to be easy
* Rename all the fields called 'hitpoint' to 'hp'
    * We change the data structure and three varaibles dragonLeftWingHpL, dragonRightWingHpL and dragonHeadHpL
* We are going to add People to project
     * We generized the eat/damage/heal methods
     * We added people and two lens
          * total code changes 5 lines
     * We would need to change the tests to be generic .. which will actually remove the complexity of understanding what has gone wrong when the tests fail

## Impact of change on code without lens
* Move the wings data structure so that they are not under 'body' but directly under dragon
    * ouch
    * Just about every  business logic method was impacted
    * The tests were impacted but because we couldn't use Lens in the tests, the impact was very high on the tests
* Rename all the fields called 'hitpoint' to 'hp'
    * A lot of boilerplate edits, but actually not too painful if you are using the typescript compiler to help
* We are going to add People to project
    * It's a whole new ball game... people aren't dragons
    * Hardly any of our code is reusable