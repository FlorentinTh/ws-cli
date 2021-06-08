class PostProcessing {
  constructor(serverName) {
    this.serverName = serverName.toLowerCase().split(' ').join('_');
  }
}

export default PostProcessing;
