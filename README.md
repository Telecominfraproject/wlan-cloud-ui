# TIP WLAN Cloud Portal

## Set up environment:

Delete from package.json (undo this delete after all steps)
`"@tip-wlan/wlan-cloud-ui-library": X.X.X,`

Install Dependencies
`npm install`

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
