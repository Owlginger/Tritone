// Create a class for the element
class Tritone extends HTMLDivElement {
    constructor() {
      // Always call super first in constructor
      super();
  
      // Create a shadow root
      const shadow = this.attachShadow({mode: 'open'});
  
     
    }
  }
  
  // Define the new element
  customElements.define('tritone-root', Tritone, { extends: 'div' });