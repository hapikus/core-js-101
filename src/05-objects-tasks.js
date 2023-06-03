/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return ({
    width,
    height,
    getArea: () => width * height,
  });
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = {};
  Object.setPrototypeOf(obj, proto);
  Object.assign(obj, JSON.parse(json));
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class CssSelectorClass {
  constructor(selectorName, value, selector1, combinator, selector2) {
    this.main = {};
    this.main[selectorName] = [value];
    this.selector1 = selector1;
    this.combinator = combinator;
    this.selector2 = selector2;
    this.errorMsgUnique = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.errorMsgOrder = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
  }

  element(value) {
    this.main.element = this.main.element
      ? [...this.main.element, value]
      : [value];
    if (this.main.element.length >= 2) {
      throw new Error(this.errorMsgUnique);
    }
    if (
      this.main.id
      || this.main.className
      || this.main.attr
      || this.main.pseudoClass
      || this.main.pseudoElement
    ) {
      throw new Error(this.errorMsgOrder);
    }
    return this;
  }

  id(value) {
    this.main.id = this.main.id ? [...this.main.id, value] : [value];
    if (this.main.id.length >= 2) {
      throw new Error(this.errorMsgUnique);
    }
    if (
      this.main.className
      || this.main.attr
      || this.main.pseudoClass
      || this.main.pseudoElement
    ) {
      throw new Error(this.errorMsgOrder);
    }
    return this;
  }

  class(value) {
    this.main.className = this.main.className
      ? [...this.main.className, value]
      : [value];
    if (
      this.main.attr
      || this.main.pseudoClass
      || this.main.pseudoElement
    ) {
      throw new Error(this.errorMsgOrder);
    }
    return this;
  }

  attr(value) {
    this.main.attr = this.main.attr ? [...this.main.attr, value] : [value];
    if (
      this.main.pseudoClass
      || this.main.pseudoElement
    ) {
      throw new Error(this.errorMsgOrder);
    }
    return this;
  }

  pseudoClass(value) {
    this.main.pseudoClass = this.main.pseudoClass
      ? [...this.main.pseudoClass, value]
      : [value];
    if (
      this.main.pseudoElement
    ) {
      throw new Error(this.errorMsgOrder);
    }
    return this;
  }

  pseudoElement(value) {
    this.main.pseudoElement = this.main.pseudoElement
      ? [...this.main.pseudoElement, value]
      : [value];
    if (this.main.pseudoElement.length >= 2) {
      throw new Error(this.errorMsgUnique);
    }
    return this;
  }

  stringify() {
    let cssSelector = '';
    if (this.combinator) {
      cssSelector = `${this.selector1} ${this.combinator} ${this.selector2}`;
      this.main = {};
      return cssSelector;
    }
    if (this.main.element) {
      cssSelector += `${this.main.element.join('')}`;
    }
    if (this.main.id) {
      cssSelector += `#${this.main.id.join('')}`;
    }
    if (this.main.className) {
      cssSelector += `.${this.main.className.join('.')}`;
    }
    if (this.main.attr) {
      cssSelector += `[${this.main.attr.join('')}]`;
    }
    if (this.main.pseudoClass) {
      cssSelector += `:${this.main.pseudoClass.join(':')}`;
    }
    if (this.main.pseudoElement) {
      cssSelector += `::${this.main.pseudoElement.join('')}`;
    }
    this.main = {};
    return cssSelector;
  }
}


const cssSelectorBuilder = {
  element(value) {
    return new CssSelectorClass('element', value);
  },

  id(value) {
    return new CssSelectorClass('id', value);
  },

  class(value) {
    return new CssSelectorClass('className', value);
  },

  attr(value) {
    return new CssSelectorClass('attr', value);
  },

  pseudoClass(value) {
    return new CssSelectorClass('pseudoClass', value);
  },

  pseudoElement(value) {
    return new CssSelectorClass('pseudoElement', value);
  },

  combine(selector1, combinator, selector2) {
    const cssSelector1 = typeof selector1 === 'object' ? selector1.stringify() : selector1;
    const cssSelector2 = typeof selector2 === 'object' ? selector2.stringify() : selector2;
    return new CssSelectorClass('_', '_', cssSelector1, combinator, cssSelector2);
  },

  stringify(value) {
    return value;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
