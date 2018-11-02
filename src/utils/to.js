export default (promise) =>
  promise.then(r => [null, r]).catch(e => [e])
