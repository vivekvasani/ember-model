require('ember-model/computed');
var get = Ember.get;

function getType(record) {
  var type = this.type;

  if (typeof this.type === "string" && this.type) {
    this.type = get(Ember.lookup, this.type);

    if (!this.type) {
      var owner = Ember.getOwner(record);
      var store = owner.lookup('service:store');
      this.type = store.modelFor(type);
      this.type.reopenClass({ adapter: store.adapterFor(type) });
    }
  }

  return this.type;
}

Ember.hasMany = function(type, options) {
  options = options || {};

  var meta = { type: type, isRelationship: true, options: options, kind: 'hasMany', getType: getType};

  return Ember.Model.computed({
    get: function(propertyKey) {
      type = meta.getType(this);
      Ember.assert("Type cannot be empty", !Ember.isEmpty(type));

      var key = options.key || propertyKey;
      var owner = Ember.getOwner(this);
      return this.getHasMany(key, type, meta, owner);
    },
    set: function(propertyKey, newContentArray, existingArray) {
      return existingArray.setObjects(newContentArray);
    }
  }).meta(meta);
};

Ember.Model.reopen({
  getHasMany: function(key, type, meta, owner) {
    var embedded = meta.options.embedded;
    var polymorphic = meta.options.polymorphic;
    var collectionClass = embedded ? Ember.EmbeddedHasManyArray : Ember.HasManyArray;

    var collection = collectionClass.create({
      parent: this,
      modelClass: type,
      content: this._getHasManyContent(key, type, embedded),
      embedded: embedded,
      polymorphic: polymorphic,
      key: key,
      relationshipKey: meta.relationshipKey
    });

    Ember.setOwner(collection, owner);

    this._registerHasManyArray(collection);

    return collection;
  }
});
