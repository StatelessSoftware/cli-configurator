# cli-configurator
Create config files and parse

## Installation

```
npm i StatelessSoftware/cli-configurator
```

## Usage

``` javascript

// Import library
const CliConfigurator = require("cli-configurator");

// Create a new configurator
let config = new CliConfigurator("my-app");

// Write a configuration
config.write({
    "word": "Hello"
});

// Read a configuration
console.log(config.read());
// Logs:
// { word: "Hello" }

```
