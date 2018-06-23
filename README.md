# sso

Javascript library for interacting with Abacus SSO.

## Installing

```
yarn add @abacusprotocol/sso
```

## Usage

First, init Abacus SSO:

```
import Abacus from '@abacusprotocol/sso';

const abacus = new Abacus({
    appId: 'your-application-id'
})
```

### Authorization 

To open a modal, use the following code:

```
<button onClick={() => abacus.authorizeWithModal()}>
    Authenticate with Abacus
</button>
```

`abacus.authorizeWithModal` takes in one parameter, `options`, which is described as follows:

```
    abacus.authorizeWithModal({
        onError: ({message, description}) => null,
        onOpen: () => null,
        onClose: (authToken) => null
    })
``` 

- `onError` has a message which can be one of: `connection_failure` `open_failure` `completion_failure`
- `onOpen` what to do once the modal successfully opens
- `onClose` passes a JWT auth token. We provide a helper method `readJWTToken` to parse contents from this token

### Verification Status

To fetch verification status, use the following code:

```
abacus.fetchVerificationStatus('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B');
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
