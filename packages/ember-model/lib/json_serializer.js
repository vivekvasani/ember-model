require('ember-model/serializer');

Ember.JSONSerializer = Ember.Serializer.extend({
  serialize: function(record, options) {
    return record.toJSON();
  }
});
