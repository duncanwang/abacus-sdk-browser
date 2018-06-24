# Abacus Client SDK 

Javascript library for interacting with Abacus Client SDK.

## Installing

```
yarn add @abacusprotocol/client-sdk
```

## Usage

First, init Abacus Client SDK:

```
import Abacus from '@abacusprotocol/client-sdk';

const abacus = new Abacus({
    appId: 'your-application-id'
})
```

## Authorization 
### Authenticate a user

This will open a modal to authenticate a user:

```
<button onClick={() => abacus.authorizeWithModal({ ...options })}>
    Authenticate with Abacus
</button>
```

`abacus.authorizeWithModal` takes in `options`, which is described as follows:

```
    abacus.authorizeWithModal({
        ethAddress: "0xDFfbe..." //optional
        onOpen: () => null,
        onClose: () => null
    })
``` 

- `ethAddress` optionally supply us the eth address to link to. If not supplied we will read the default address from metamask
- `onOpen` what to do once the modal successfully opens
- `onClose` at this point a user should be authenticated, we provide a helper method `readAuthToken` to read his/her credentials.

in the case of an error, `authorizeWithModal` will throw an error with the names: `AddressAuthenticationError`, `ModalError`, `ConnectionError`

- `AddressAuthenticationError` no eth address found 
- `ModalError` there was an issue using or opening the modal
- `ConnectionError` cannot connect to abacus 

### Read login token

to read from the user token:

```
abacus.readAuthToken();
```

which will return an object as such:

```
    {
        expires: 1529783081229, // an integer representing the time in UTC
        eth_address: "0xDFfbe..." // the eth address linked.
    }
```

### Log out an authenticated user

to log out a user:

```
abacus.deauthorize();
```

### Verification Status

To fetch the KYC verification status of the authenticated user, use the following code:

```
async () => {
    let res;
    try {
        res = await abacus.fetchVerificationStatus();
    } catch ({name, message}) {
        // ...
    }
}
```

This will return a `Promise` of a JSON object with the following shape:

```
{
    // whether or the documents are pending verification
    "isPending": false,
    // whether the basic information of the user was validated
    "isBasicValid": true,
    // whether the uploaded documents of the user were validated
    "isDocumentsValid": true
}
```

## User Actions

### Get

To fetch fields from a user: 

```
async () => {
    const fields = ['name','email'];
    let res;
    try {
        res = await abacus.fetchUserFields([...fields]);
    } catch ({name, message}) {
        // ...
    }
}
```

This will return a `Promise` of a JSON object mapping field keys to values:

```
{
    "email": "joe@shmo.com",
    "name": "Joe Shmoe"
}
```

if an error occurs it will be of the shape:  `FetchError`, `AuthenticationError`, `ConnectionError`

- `FetchError` there is a error with the query
- `AuthenticationError` the user is not authenticated
- `ConnectionError` cannot connect to abacus 

### Set

To set fields for a user: 

```
async () => {
    const onChainFields = {
        is_cool: true
    };
    const offChainFields = {
        name: 'Joe Shmoe'
    };
    let res;
    try {
        res = await abacus.setUserFields({ onChainFields, offChainFields });
    } catch ({name, message}) {
        // ...
    }
}
```

This will return a `Promise` of a JSON object mapping field keys to values signaling a successful transaction:

```
{
    "isCool": true,
    "name": "Joe Shmoe"
}
```

if an error occurs it will be of the shape:  `SetError`, `AuthenticationError`, `ConnectionError`

- `SetError` there is a error with the query
- `AuthenticationError` the user is not authenticated
- `ConnectionError` cannot connect to abacus 
