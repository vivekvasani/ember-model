function NIL() {}

Ember.Model.Store = Ember.Object.extend({
  container: null,

  modelFor: function(type) {
    return this.container.lookupFactory('model:'+type);
  },

  adapterFor: function(type) {
    var adapter = this.modelFor(type).adapter,
        container = this.container;
    var serializer = this.serializerFor(type);
    if (adapter && adapter.constructor !== Ember.Adapter) {
      adapter.set('serializer', serializer);
      return adapter;
    } else {
      adapter = container.lookupFactory('adapter:'+ type) ||
        container.lookupFactory('adapter:application') ||
        Ember.RESTAdapter;

      return adapter ? adapter.create({serializer:serializer}) : adapter;
    }
  },

  serializerFor: function(type) {
    var container = this.container;
    var serializer = container.lookupFactory('serializer:'+ type) ||
      container.lookupFactory('serializer:application') ||
      Ember.JSONSerializer;

    return serializer ? serializer.create() : serializer;
  },

  createRecord: function(type, props) {
    var klass = this.modelFor(type);
    klass.reopenClass({adapter: this.adapterFor(type)});
    return klass.create(Ember.merge({container: this.container}, props));
  },

  find: function(type, id) {
    if (arguments.length === 1) { id = NIL; }
    return this._find(type, id, true);
  },

  _find: function(type, id, async) {
    var klass = this.modelFor(type);

    // if (!klass.adapter) {
      klass.reopenClass({adapter: this.adapterFor(type)});
    // }

    if (id === NIL) {
      return klass._findFetchAll(async, this.container);
    } else if (Ember.isArray(id)) {
      return klass._findFetchMany(id, async, this.container);
    } else if (typeof id === 'object') {
      return klass._findFetchQuery(id, async, this.container);
    } else {
      return klass._findFetchById(id, async, this.container);
    }
  },

  _findSync: function(type, id) {
    return this._find(type, id, false);
  }
});

Ember.onLoad('Ember.Application', function(Application) {

  Application.initializer({
    name: "store",

    initialize: function(_, application) {
      var store = application.Store || Ember.Model.Store;
      application.register('store:application', store);
      application.register('store:main', store);

      application.inject('route', 'store', 'store:main');
      application.inject('controller', 'store', 'store:main');
    }
  });

});
