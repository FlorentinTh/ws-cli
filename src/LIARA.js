class Liara {
  static #servers = [
    {
      host: '172.24.24.2',
      port: '6093'
    },
    {
      host: '172.24.24.3',
      port: '6091'
    },
    {
      host: '172.24.24.2',
      port: '6095'
    }
  ];

  static checkServer(url) {
    return this.#servers.some(server => `${server.host}:${server.port}` === url);
  }
}

export default Liara;
