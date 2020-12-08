import Container from "../../../src/Services/Container";

test('container can add functional service', () => {
  const container = new Container();
  container.add('testService', (container:Container) => () => { return 'does soemthing'});
  expect(container.get('testService')()).toMatch('does soemthing');
});

test('container can add class service', () => {
  const container = new Container();

  class Test {}
  container.add('testService', (container:Container) => new Test);
  expect(container.get('testService')).toMatchObject(new Test);
});

test('container throws an error when service has not been registered', () => {
  const container = new Container();
  expect(() => {container.get('testService')}).toThrow(Error('Service name has not been registered'));

});

test('container throws an error when service name is empty', () => {
  const container = new Container();
  expect(() => {
    container.add('', (container:Container) => () => { return 'does soemthing'})
  }).toThrow(Error('Service name must be supplied'));
});

test('container throws an error when service name is empty', () => {
  const container = new Container();
  expect(() => {
    container.add('soemthing', '')
  }).toThrow(Error('A callback containing a service must be supplied'));
});
