# HomeSync

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.3.

## Development server

Thermostat API calls use the relative path `/api/thermostat` so the device IP is not exposed in the browser. The dev server proxies that path to your thermostat host.

1. Copy the example proxy config and set your device address:

   ```bash
   cp proxy.conf.example.json proxy.conf.json
   ```

   Edit `proxy.conf.json` and replace `http://YOUR_THERMOSTAT_HOST` with your thermostat base URL (e.g. `http://10.0.0.210`).

2. Run `ng serve` and open `http://localhost:4200/`. The app will reload when you change source files.

`proxy.conf.json` is gitignored; only `proxy.conf.example.json` is committed.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

For production, configure your web server to proxy `/api/thermostat/` to the thermostat device. Example (nginx):

```nginx
location /api/thermostat/ {
  proxy_pass http://10.0.0.210/;
}
```

Replace the upstream host with your device address. The built app still calls `/api/thermostat/...` only; the IP stays on the server.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
