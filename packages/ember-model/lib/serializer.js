function mustImplement(message) {
  var fn = function() {
    var className = this.constructor.toString();

    throw new Error(message.replace('{{className}}', className));
  };
  fn.isUnimplemented = true;
  return fn;
}

Ember.Serializer = Ember.Object.extend({
  serialize: mustImplement('{{className}} must implement find')
});
