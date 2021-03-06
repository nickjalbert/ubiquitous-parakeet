# ubiquitous-parakeet

JS Cartpole Implementation

## Setup

Requires [Node and npm](https://nodejs.org/en/). Built with Node v13.1.0 and npm v6.12.1.

* `git clone git@github.com:nickjalbert/ubiquitous-parakeet.git`
* `cd ubiquitous-parakeet`
* `npm install`
* `npm run build-dev`
* open dist/index.html in your browser

To lint source code, use `npm run lint`.

To run a dev server, use `npm run serve` and then visit [localhost:8080](http://localhost:8080).

To build for production (separates out CSS and JS), use `npm run build-prod`.

To clean the build, use `npm run clean`.

To deploy to [www.convexopt.com/cartpole](https://www.convexopt.com/cartpole),
run `./scripts/release`.

## Notes

* Initial setup based on [Webpack quickstart](https://webpack.js.org/guides/getting-started/)

* [OpenAI Gym Implementation](https://github.com/openai/gym/blob/master/gym/envs/classic_control/cartpole.py)

* [React setup](https://www.valentinog.com/blog/babel/)
