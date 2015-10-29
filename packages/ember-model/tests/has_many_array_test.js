module("Ember.HasManyArray");

var Carrot =  Ember.Model.extend({
  size: Ember.attr(String),
  brands: Ember.attr()
});

var Bunny =  Ember.Model.extend({
  carrots:Ember.hasMany(Carrot, {embedded: true})
});

test("it exists", function() {
  ok(Ember.HasManyArray);
});

test("trimEmptyRecords removes empty objects from itself", function() {
  var bunny = Bunny.create();
  bunny.get('carrots').pushObject(Carrot.create({size:"baby", brands:[]}));
  bunny.get('carrots').pushObject(Carrot.create({size:"", brands:['farms']}));
  bunny.get('carrots').pushObject(Carrot.create({size:"", brands:[]}));
  var bunnyJson = bunny.toJSON();
  equal(bunnyJson.carrots.length, 2);
});

