export default class Container {
  private services: any = {};

  public add(name: string, cb: any) {
    if (!name) {
      throw Error('Service name must be supplied');
    }

    if (!cb || typeof cb !== 'function') {
      throw Error('A callback containing a service must be supplied');
    }

    this.services[name] = cb(this);
    return this;
  }

  public get(name: string) {
    if (!this.services.hasOwnProperty(name)) {
      throw Error('Service name has not been registered');
    }
    return this.services[name];
  }

}