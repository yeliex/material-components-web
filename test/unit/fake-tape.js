import chai from 'chai';
const {assert} = chai;
export default function test(desc, testFn) {
  it(desc, () => {
    const t = {
      plan: () => {},
      end: () => {},
      fail: (msg) => assert.assert(false, msg),
      pass: (msg) => assert.assert(true, msg),
      timeoutAfter: () => {},
      skip: () => {},
      ok: (...args) => assert.isOk(...args),
      notOk: (...args) => assert.isNotOk(...args),
      error: (...args) => assert.ifError(...args),
      equal: (...args) => assert.equal(...args),
      notEqual: (...args) => assert.notEqual(...args),
      deepEqual: (...args) => assert.deepEqual(...args),
      notDeepEqual: (...args) => assert.notDeepEqual(...args),
      throws: (...args) => assert.throws(...args),
      doesNotThrow: (...args) => assert.doesNotThrow(...args),
    };
    t.true = t.ok;
    t.false = t.notOk;
    t.equals = t.equal;
    testFn(t);
  });
}
