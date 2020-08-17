# TIP WLAN Cloud Portal

## Set up environment:

Install Dependencies:
`npm install`

You will get an error installing the package [wlan-cloud-ui-library](https://github.com/Telecominfraproject/wlan-cloud-ui-library) because it is in a private npm registry. Run
```
npm login --registry=https://tip.jfrog.io/artifactory/api/npm/tip-wlan-cloud-npm-repo/
```
And enter the supplied credentials. Ask @sean-macfarlane for credentials if you don't have. 

Install package:
```
npm i --registry=https://tip.jfrog.io/artifactory/api/npm/tip-wlan-cloud-npm-repo/ @tip-wlan/wlan-cloud-ui-library
```


### Set up with local wlan-cloud-ui-library
*Skip this section if you are not using a local [wlan-cloud-ui-library](https://github.com/Telecominfraproject/wlan-cloud-ui-library)*

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

## Run:

### Development

`npm start`

### Tests

`npm run test`

### Production

`npm run build`
