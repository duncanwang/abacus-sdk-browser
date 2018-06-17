# sso

Javascript library for interacting with Abacus SSO.

## Installing

```
yarn add @abacusprotocol/sso
```

## Usage

First, init Abacus SSO:

```
const sso = require('@abacusprotocol/sso')
sso.init({
    application: 'your-application-id'
})
```

### Modal

To open a modal, use the following code:

```
<button onClick={() => sso.openModal(options)}>Authenticate with Abacus</button>
```

This takes in one parameter, `options`, which can take in the following properties:

- `onClose()` -- function to call when the modal is closed

### Verification Status

To fetch verification status, use the following code:

```
sso.fetchVerificationStatus('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B');
```

This will return a `Promise` of a JSON object with the following shape:

```
{
    // whether the basic information of the user was validated
    "isBasicValid": true,
    // whether the uploaded documents of the user were validated
    "isDocumentsValid": true
}
```

Note that these both can be called from your application's frontend.
