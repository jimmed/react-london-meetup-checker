const { h, Component, Color } = require("ink");
const notifier = require("node-notifier");
const open = require("open");
const fetchEvent = require("./fetch");
const { Fetching, Event } = require("./components");

class App extends Component {
  constructor() {
    super();
    this.state = {
      lastFetchedAt: null,
      isFetching: false,
      event: null,
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.fetch.bind(this), 30000);
    this.fetch();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async fetch() {
    if (
      this.state.isFetching ||
      (this.state.event && this.state.event.status === "TICKETS_LIVE")
    )
      return;
    this.setState({ isFetching: true });
    let retries = 0;
    let done = false;
    while (!done) {
      try {
        const event = await fetchEvent();
        this.setState({
          isFetching: false,
          retries: 0,
          lastFetchedAt: new Date(),
          event,
        });
        if (event && event.status !== "PRE_RELEASE") {
          this.componentWillUnmount();
          notifier.notify({
            title: event.title,
            message: "Tickets are now on sale!",
            wait: true,
          });
          notifier.on("click", () => open(event.ticketLink));
        }
      } catch (error) {
        this.setState({ retries: ++retries });
      }
    }
  }

  render() {
    const { lastFetchedAt, retries, isFetching, event } = this.state;
    return h(
      Color,
      { white: true },
      isFetching
        ? h(Fetching, { retries })
        : lastFetchedAt
        ? h(Event, { lastFetchedAt, event })
        : "..."
    );
  }
}

module.exports = App;
