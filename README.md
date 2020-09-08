# TIP WLAN Cloud Portal

## Set up environment:

Install Dependencies:
`npm install`

You will get an error installing the package [wlan-cloud-ui-library](https://github.com/Telecominfraproject/wlan-cloud-ui-library) because it is in a private npm registry.
You can either install the package with the commands below or clone the repo [wlan-cloud-ui-library](https://github.com/Telecominfraproject/wlan-cloud-ui-library) and skip to the section Set up Full Development.

Run

```
npm login --registry=https://tip.jfrog.io/artifactory/api/npm/tip-wlan-cloud-npm-repo/
```

And enter the supplied credentials. Ask @sean-macfarlane for credentials if you don't have.

Install package:

```
npm i --registry=https://tip.jfrog.io/artifactory/api/npm/tip-wlan-cloud-npm-repo/ @tip-wlan/wlan-cloud-ui-library
```

### Set up Full Development

_Skip this section if you are not using a local [wlan-cloud-ui-library](https://github.com/Telecominfraproject/wlan-cloud-ui-library)_

Clone [wlan-cloud-ui-library](https://github.com/Telecominfraproject/wlan-cloud-ui-library) in parent folder

```
cd ..
git clone https://github.com/Telecominfraproject/wlan-cloud-ui-library.git
```

Link wlan-cloud-ui-library package locally for development:

```
cd wlan-cloud-ui
npm link ../wlan-cloud-ui-library
```

If `npm link` fails due to Permissions run with `sudo`

```
sudo npm link ../wlan-cloud-ui-library
```

To run Full Development you must clone [wlan-cloud-graphql-gw](https://github.com/Telecominfraproject/wlan-cloud-graphql-gw), follow it's README, and run it. Or you use the live production build by setting the environment variable `API` to the GraphQL domain.

## Run:

### Bare Development

This is if you only want to run this repo locally, and want to use the live production builds of [wlan-cloud-ui-library](https://github.com/Telecominfraproject/wlan-cloud-ui-library) and [wlan-cloud-graphql-gw](https://github.com/Telecominfraproject/wlan-cloud-graphql-gw)

`npm run start:bare`

### Full Development

If you have cloned [wlan-cloud-ui-library](https://github.com/Telecominfraproject/wlan-cloud-ui-library) and [wlan-cloud-graphql-gw](https://github.com/Telecominfraproject/wlan-cloud-graphql-gw)

`npm start`

### Tests

`npm test`

### Production

`npm run build`
