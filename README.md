# react-london-meetup-checker

Fancy-ish CLI for keeping an eye on ticket release for React London's Meetup.

## Usage

`npx jimmed/react-london-meetup-checker`

## Overview

This tool is built using:

- [ink](https://npm.im/ink) - a command-line UI library based on React
- [node-fetch](https://npm.im/node-fetch) - for fetching data from the page
- [fast-html-parser](https://npm.im/fast-html-parser) - for parsing the page's HTML

In essence, once started, this tool will hit https://meetup.react.london every 30 seconds.

It extracts the ticket release status for the most recent event, and displays this along with the event title.

If the status changes to anything other than 'PRE_RELEASE', then a system notification is generated to notify the user. This notification can be clicked to take the user to the ticket.
