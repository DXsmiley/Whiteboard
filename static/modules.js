modules = {
    __function__: {},
    __cache__: {},
    require: function(name) {
        if (this.__cache__[name] == 'CYCLE') console.error('Cyclic dependency!');
        if (this.__cache__[name] == undefined) {
            if (this.__function__[name] == undefined) console.error('No module called', name);
            this.__cache__[name] = 'CYCLE';
            var m = this.__function__[name]();
            this.__cache__[name] = m;
        }
        return this.__cache__[name];
    },
    create: function(name, func) {
        this.__function__[name] = func;
    },
    gather: function() {
        for (var i in arguments) {
            console.log('Gathering: ', i);
        }
    }
};
