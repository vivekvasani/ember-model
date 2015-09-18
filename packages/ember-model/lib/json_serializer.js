require('ember-model/serializer');

Ember.JSONSerializer = Ember.Serializer.extend({

  normalize: function(typeClass, hash) {
    return hash;
  },

  serialize: function(record, options) {
    return record.toJSON();
  }
});
