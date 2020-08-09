class Mesh2Graph {
  constructor (p2pwire, p2pgraph) {
    this.myAddress = myAddress
    this.p2pgraph = p2pgraph
    this.p2pwire = p2pwire
    this.mapLinks = []

    p2pwire.on('linksUpdate', this.onLinksUpdate.bind(this))
    p2pwire.on('receiveMessage', this.onReceiveMessage.bind(this))
  }

  onLinksUpdate ({ addedNodes, removedNodes, addedLinks, removedLinks }) {
    let graph = this.p2pgraph
    const myAddress = this.p2pwire.nodeAddress

    removedLinks.map(it => {
      if (graph.areConnected(it[0], it[1])) {
        graph.disconnect(it[0], it[1])
      }
    })

    removedNodes.map(it => graph.remove(it))

    // add new links and peers
    addedNodes.map(it => {
      if (!graph.hasPeer(it)) {
        graph.add({
          id: it,
          me: it === myAddress,
          name: it
        })
      }
    })

    addedLinks.map(it => {
      if (!graph.areConnected(it[0], it[1])) {
        graph.connect(it[0], it[1])
      }
    })
  }

  onReceiveMessage (remoteNodeAddress, message) {
    if (this.p2pgraph.hasPeer(remoteNodeAddress)) {
      this.p2pgraph.seed(remoteNodeAddress, true)
      setTimeout(() => {
        graph.seed(remoteNodeAddress, false)
      }, 3000)
    }
  }
}
