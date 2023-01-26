"use strict";
const { v4: uuidv4 } = require("uuid");
/**
 * Reflection question 1
 * In JavaScript, properties of an object that are not explicitly set are undefined, not false.
 * Therefore, if a property is not present in an object, it is assumed to be undefined rather than false.
 * This means that it is not necessary to explicitly store properties with the value false in JavaScript objects,
 * as they can simply be omitted.
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
 * The two examples will give different outputs if the imported object has any non-enumerable properties.
 * Object.keys() only returns an array of the object's own enumerable properties, while a for...in loop
 * iterates over the object's own and inherited enumerable properties.In javascript, the properties that
 * are defined on the object directly are called own properties and the properties that are inherited from
 * the prototype chain are called inherited properties. The inherited functions like sort() are not enumerable
 * by default which means it will not be included in the output of Object.keys() or for...in loop.
 * If the imported object has any non-enumerable properties on its prototype chain, it will be included in the
 * output of for...in loop but not in the output of Object.keys().
 */

console.log("\n--- Assignment 1 ---------------------------------------");
function makeOptions(inv, prop) {
  //let out = ``;

  // Object.entries(inv)
  //   .filter((option) => Object.keys(option[1]).includes(prop))
  //   .forEach((option) => {
  //     out += `<option value="${option[0]}"> ${option[0]}, ${option[1].price} kr"</option>`;
  //   });

  // return out;
  let filtered = Object.keys(inv).filter((name) => inv[name][prop]);

  let options = filtered.map(
    (name) =>
      `<option value="${name}"> ${name}, ${inv[name]["price"]}kr</option>`
  );

  return options.reduce((acc, curr) => acc + "\n" + curr, "");
}

console.log(makeOptions(imported.inventory, "foundation"));

console.log("\n--- Assignment 2 ---------------------------------------");
class Salad {
  static instanceCounter = 0;
  id;
  uuid; //ska man ha "const uuid = ...", eller som attribut som vi har?
  ingredients = {};

  constructor(arg) {
    if (typeof arg === "object") {
      //console.log(arg.ingredients);
      this.ingredients = Object.assign({}, arg.ingredients); //how to use ... operator??
    }

    if (typeof arg === "string") {
      //console.log("string: " + arg);
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

/**
 * Answer:
 * the Salad class has a prototype property.
 * The myCesarSalad does not
 */

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
    //console.log(properties, size);
    if (typeof size === "undefined") {
      //checks if "size is defined"
      super.add(name, properties);
      //this.ingredients[name] = properties; //does the same as the original function. Seems weird?
    } else {
      const props = Object.assign({}, properties); //copies the object
      props.price *= size; //changes the size
      super.add(name, props);
      //this.ingredients[name] = props; //adds the properties
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
 * In salad object
 */
/**
 * Reflection question 5
 * Yes, you can make the id property read-only in JavaScript using the setAttribute() method[1]
. This method adds the read-only attribute to the form input field[1]
. You can also use Object.defineProperty() or Object.freeze() to create read-only properties[2]
. To remove a read-only attribute, you can use the removeAttribute() method[3]
*[1]https://www.geeksforgeeks.org/how-to-add-readonly-attribute-to-an-input-tag-in-javascript/
*[2] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Read-only
*[3]https://linuxhint.com/add-remove-readonly-attribute-javascript/
*Yes, the id property can be made read-only in JavaScript. To do this, you can use the 
*Object.defineProperty() method, which allows you to define a specific property on an 
*object and specify its attributes, one of which is whether it is writable or not. 
 */
/**
 * Reflection question 6
 * Private properties in JavaScript can be created by using a hash # prefix
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
console.log(order.getPrice());
order.add(objectCopy, 1);
console.log(order.getPrice());

order.remove(objectCopy);
console.log(order.getPrice());

order.remove(myCaesarSalad);
console.log(order.getPrice());
