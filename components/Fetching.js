const { h, Component, Color } = require("ink");

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

module.exports = Fetching;
