//---------- Preparing for ECMAScript.next

if (!Object.getOwnPropertyDescriptors) {
    /**
     */
    Object.getOwnPropertyDescriptors = function (obj) {
        return Object.getOwnPropertyNames(obj).map(function(propName) {
            return Object.getOwnPropertyDescriptor(source, propName);
        });
    };
}

var Class = {

    //---------- Inheritance API

    /**
     */
    extend: function (properties) {
        var superProto = this.prototype || Class;
        var proto = Object.create(superProto);
        // This method will be attached to many constructor functions
        // => must refer to "Class" via its global name (and not via "this")
        Class.copyOwnTo(properties, proto);
        
        var constr = proto.constructor;
        if (!(constr instanceof Function)) {
            throw new Error("You must define a method 'constructor'");
        }
        // Set up the constructor
        constr.prototype = proto;
        constr.super = superProto;
        constr.extend = this.extend; // inherit class method
        return constr;
    },

    /**
     */
    copyOwnTo: function(source, target) {
        Object.getOwnPropertyNames(source).forEach(function(propName) {
            Object.defineProperty(target, propName,
                Object.getOwnPropertyDescriptor(source, propName));
        });
        return target;
    },

    //---------- Various tool methods

    /**
     Find which object in the prototype chain starting at "obj"
     is the first to have a property whose name is "propName"

     @url https://mail.mozilla.org/pipermail/es-discuss/2011-April/013643.html
     @return defining object or null
    */
    getDefiningObject: function(obj, propName) {
        // TODO: exception if null
        obj = Object(obj); // make sure it’s an object
        while (obj && !obj.hasOwnProperty(propName)) {
            obj = Object.getPrototypeOf(obj);
            // obj is null if we have reached the end
        }
        return obj;
    },
};
