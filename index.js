#!/usr/bin/env node
const { h, render, Component, Color } = require("ink");
const { inspect } = require("util");
const fetchEvent = require("./fetch");
const notifier = require("node-notifier");
const open = require("open");

class Fetching extends Component {
  render() {
    const { retries } = this.props;
    return [
      h(Color, { blue: true }, "Checking the page..."),
      retries > 0 &&
        h(
          color,
          { red: true },
          ` (retrying after ${retries} failure${retries > 1 ? "s" : ""})`
        ),
    ];
  }
}

class Event extends Component {
  render() {
    const { title, status } = this.props.event;
    const released = status !== "PRE_RELEASE";
    return h(Color, { white: true }, [
      h(Color, { blue: true }, title),
      "\n",
      "Status: ",
      h(Color, { red: !released, green: released, bold: released }, status),
    ]);
  }
}

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
    if (this.state.isFetching) return;
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

render(h(App));
