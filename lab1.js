"use strict";
const { v4: uuidv4 } = require("uuid");
/**
 * Reflection question 1
 * your answer goes here
 */

const imported = require("./inventory.js");

console.log("inventory: " + imported.inventory["Sallad"]);

console.log("Object.keys():");
let names = Object.keys(imported.inventory);

names
  .sort((a, b) => a.localeCompare(b, "sv", { sensitivity: "case" }))
  .forEach((name) => console.log(name));

console.log("\n\nfor ... in:");
for (const name in imported.inventory) {
  console.log(name);
}
/**
 * Reflection question 2
 */

/**
 * Answer Question 2:
 * The for loop will print in the order the array is indexed (0,1,2,3 etc).
 * The names.forEach will do the same if not sorted. Not done with answer
 */

console.log("\n--- Assignment 1 ---------------------------------------");
function makeOptions(inv, prop) {
  let out = ``;

  Object.entries(inv)
    .filter((option) => Object.keys(option[1]).includes(prop))
    .forEach((option) => {
      out += `<option value="${option[0]}"> ${option[0]}, ${option[1].price} kr"</option>`;
    });

  return out;
}

console.log(makeOptions(imported.inventory, "foundation"));

console.log("\n--- Assignment 2 ---------------------------------------");
class Salad {
  static instanceCounter = 0;
  id;
  uuid;
  ingredients = {};

  constructor(arg) {
    if (typeof arg === "object") {
      console.log(arg.ingredients);
      this.ingredients = Object.assign({}, arg.ingredients);
    }

    if (typeof arg === "string") {
      console.log("string: " + arg);
      this.ingredients = Object.assign({}, JSON.parse(arg));
      /*
      Object.assign(target, src) copies an object
      */
    }
    this.uuid = uuidv4();
    this.id = "salad_" + Salad.instanceCounter++;
    return this;
  }
  add(name, properties) {
    //adding "ingredient"
    this.ingredients[name] = properties;
    return this;
  }
  remove(name) {
    //delete this.name;
    delete this.ingredients[name];
    return this;
  }
}

let myCaesarSalad = new Salad()
  .add("Sallad", imported.inventory["Sallad"])
  .add("Kycklingfilé", imported.inventory["Kycklingfilé"])
  .add("Bacon", imported.inventory["Bacon"])
  .add("Krutonger", imported.inventory["Krutonger"])
  .add("Parmesan", imported.inventory["Parmesan"])
  .add("Ceasardressing", imported.inventory["Ceasardressing"])
  .add("Gurka", imported.inventory["Gurka"]);
console.log(JSON.stringify(myCaesarSalad) + "\n");
myCaesarSalad.remove("Gurka");
console.log(JSON.stringify(myCaesarSalad) + "\n");

console.log("\n--- Assignment 3 ---------------------------------------");

//adding getPrice() to sallad class

Salad.prototype.getPrice = function () {
  const ingre = Object.entries(this.ingredients);

  const price = ingre.reduce((acc, curr) => {
    return acc + curr[1].price;
  }, 0);
  return price;
};

console.log("En ceasarsallad kostar " + myCaesarSalad.getPrice() + " kr");
// En ceasarsallad kostar 45kr

Salad.prototype.count = function (prop) {
  return Object.entries(this.ingredients).filter((entry) =>
    entry[1].hasOwnProperty(prop)
  ).length;
};

console.log(
  "En ceasarsallad har " +
    myCaesarSalad.count("lactose") +
    " ingredienser med laktos"
);

// En ceasarsallad har 2 ingredienser med laktos

console.log(
  "En ceasarsallad har " + myCaesarSalad.count("extra") + " tillbehör"
);
// En ceasarsallad har 3 tillbehör

console.log(
  "\n--- reflection question 3 ---------------------------------------"
);
console.log("typeof Salad: " + typeof Salad);
console.log("typeof Salad.prototype: " + typeof Salad.prototype);
console.log(
  "typeof Salad.prototype.prototype: " + typeof Salad.prototype.prototype
);
console.log("typeof myCaesarSalad: " + typeof myCaesarSalad);
console.log(
  "typeof myCaesarSalad.prototype: " + typeof myCaesarSalad.prototype
);
console.log(
  "check 1: " + (Salad.prototype === Object.getPrototypeOf(myCaesarSalad))
);
console.log(
  "check 2: " + (Object.prototype === Object.getPrototypeOf(Salad.prototype))
);

console.log("\n--- Assignment 4 ---------------------------------------");

const objectCopy = new Salad(myCaesarSalad);
const json = JSON.stringify(myCaesarSalad);
const jsonCopy = new Salad(json);
console.log("myCesarSalad\n" + JSON.stringify(myCaesarSalad));
console.log("copy from object\n" + JSON.stringify(objectCopy));
console.log("copy from json\n" + JSON.stringify(jsonCopy));

objectCopy.add("Gurka", imported.inventory["Gurka"]); //gurka is added both to original and copy

console.log("originalet kostar kostar " + myCaesarSalad.getPrice() + " kr");
console.log("med gurka kostar den " + objectCopy.getPrice() + " kr");

console.log("\n--- Assignment 5 ---------------------------------------");

class GourmetSalad extends Salad {
  constructor(arg) {
    super(arg);
  }
  add(name, properties, size) {
    if (typeof size === "undefined") {
      //checks if "size is defined"
      this.ingredients[name] = properties; //does the same as the original function. Seems weird?
    } else {
      const props = Object.assign({}, properties); //copies the object
      props.price *= size; //changes the size
      this.ingredients[name] = props; //adds the properties
    }

    return this;
  }
}

let myGourmetSalad = new GourmetSalad()
  .add("Sallad", imported.inventory["Sallad"], 0.5)
  .add("Kycklingfilé", imported.inventory["Kycklingfilé"], 2)
  .add("Bacon", imported.inventory["Bacon"], 0.5)
  .add("Krutonger", imported.inventory["Krutonger"])
  .add("Parmesan", imported.inventory["Parmesan"], 2)
  .add("Ceasardressing", imported.inventory["Ceasardressing"]);
console.log(
  "Min gourmetsallad med lite bacon kostar " + myGourmetSalad.getPrice() + " kr"
);
myGourmetSalad.add("Bacon", imported.inventory["Bacon"], 1);
console.log("Med extra bacon kostar den " + myGourmetSalad.getPrice() + " kr");

console.log("\n--- Assignment 6 ---------------------------------------");

console.log("Min gourmetsallad har id: " + myGourmetSalad.id);
console.log("Min gourmetsallad har uuid: " + myGourmetSalad.uuid);
//The UUID works as the copies have different Uids

/**
 * Reflection question 4
 */
/**
 * Reflection question 5
 */
/**
 * Reflection question 6
 */

/***
 * Extra assignments
 */
console.log("-------- Extra assignment ---------");
class Order {
  basket; //the basket is an array of Salads
  uuid;
  constructor() {
    this.uuid = uuidv4();
    this.basket = [];
    return this;
  }
  //adds the specified number of Salad objects to the basket
  add(salad, num) {
    while (num > 0) {
      this.basket.push(salad);
      num--;
    }

    return this;
  }
  //removes the salad from the basket
  remove(salad) {
    if (this.basket.length <= 0) {
      console.log("Basket empty");
      return this;
    }
    this.basket.pop(salad);
    return this;
  }
  //calculates the total price of the order
  getPrice() {
    return this.basket.reduce((acc, curr) => {
      return acc + curr.getPrice();
    }, 0);
  }
}

const order = new Order();
order.add(myCaesarSalad, 2);
order.add(objectCopy, 1);

console.log(order.getPrice());
