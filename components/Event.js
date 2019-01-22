const { h, Component, Color } = require("ink");

class Event extends Component {
  render() {
    const {
      event: { title, status },
      lastFetchedAt,
    } = this.props;
    const released = status !== "PRE_RELEASE";
    return h(Color, { white: true }, [
      h(Color, { blue: true }, title),
      "\n",
      "Status: ",
      h(Color, { red: !released, green: released, bold: released }, status),
      "\n",
      "Last checked at: ",
      h(Color, { blue: true }, lastFetchedAt.toLocaleString("en-GB")),
    ]);
  }
}

module.exports = Event;
