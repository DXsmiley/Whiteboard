modules = {
    this.__cache__: {},
    require: function(name) {
        return this.__cache__[name];
    },
    establish: function(name, function) {
        this.__cache__[name] = mod;
    },
    gather: function() {
        for (var i in arguments) {
            console.log('Gathering: ', i)
        }
    }
}
