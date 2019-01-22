const fetch = require("node-fetch");
const { parse } = require("fast-html-parser");

const PAGE_URL = "https://meetup.react.london";

const fetchEvent = async () => {
  const res = await fetch(PAGE_URL);
  const html = await res.text();
  const dom = parse(html, { script: true });
  const scriptTags = dom.querySelectorAll("script");
  const initialStateScript = scriptTags.find(node =>
    node.text.trim().startsWith("window.__INITIAL_STATE__")
  );
  if (!initialStateScript) {
    throw new Error("Initial state script could not be found in page");
  }
  const initialStateJson = initialStateScript.text
    .replace(/^window\.__INITIAL_STATE__\s*=\s*\{/, "{")
    .replace(/\}([^\}]*)$/, "}");
  if (!initialStateJson) {
    throw new Error("Could not get initial state JSON");
  }
  const initialState = JSON.parse(initialStateJson);
  const { featuredEvents } = initialState;

  const [primaryEvent] = featuredEvents;

  return primaryEvent;
};

module.exports = fetchEvent;
