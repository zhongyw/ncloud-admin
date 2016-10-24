
test('adds 1 + 2 to equal 3', () => {
  require('./setup');
  const exam = require('../src/exam/ReactPureExam');
  expect(exam).toBe(3);
});
