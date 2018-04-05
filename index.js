const path = require("path");
const fs = require("fs");

/**
 * Read and write configuration settins in config file
 * 
 * @param string name Namespace name of this configuration.  You may have one
 *  namespace per CliConfigurator object, but you may have many CliConfigurators
 * @param string env (Optional) Environment the configurator will operate in.
 *  Default is "default".  This is typically set to process.env.NODE_ENV || 'default'
 * @param string folder (Optional) Name of the config folder to use.  Default is
 *  "config"
 */
module.exports = function(name, env = "default", folder = "config") {

    this.filename = path.normalize(folder + '/' + env + ".json");
    this.filepath = path.dirname(this.filename);

    /**
     * Pretty-stringify version of JSON.stringify
     * 
     * @param Object payload Payload to stringify
     * @return string Returns the stringified string
     */
    this.stringify = (payload) => {
        return JSON.stringify(payload, null, '\t');
    };

    /**
     * Write a new config file
     * 
     * @param object payload Configuration payload to write to the file
     * @return boolean Returns true or throws an exception on error.
     */
    this.write = (payload) => {
        
        // Namespace the payload
        let newPayload = new Object();
        newPayload[name] = payload;
        payload = newPayload;

        // Check if directory exists
        if (!fs.existsSync(folder)) {
            try {
                fs.mkdirSync(this.filepath);
            }
            catch (ex) {
                throw "Could not create configuration directory.";
            }
        }
        
        // Check if file exists
        if (!fs.existsSync(this.filename)) {

            // Create file
            try {
                fs.writeFileSync(this.filename, this.stringify(payload));
            }
            catch (ex) {
                throw "Could not create config file.";
            }

        }
        else {

            // Append to file
            let existing = JSON.parse(fs.readFileSync(this.filename));
            if (existing) {
                payload = Object.assign(existing, payload);

                fs.writeFileSync(this.filename, this.stringify(payload));
            }
            else {
                throw "Could not load existing configuration file.";
            }

        }

        return true;

    };

    /**
     * Read from the config
     * 
     * @return Object Returns the JSON data of the config namespace
     */
    this.read = function() {

        let payload = false;

        // Check if the config exists
        if (fs.existsSync(this.filename)) {

            // Try to load the file
            try {
                payload = JSON.parse(fs.readFileSync(this.filename));
            }
            catch (ex) {
                throw "Could not read configuration file.";
            }

            // Grab the namespace out of the config
            try {
                payload = payload[name];
            }
            catch (ex) {
                throw "Configuration file loaded but could not load '" + name +
                    "' configuration.";
            }

        }
        else {

            payload = false;

        }

        return payload;
    };

};
