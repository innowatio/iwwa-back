# iwwa-back

This is the repository of of the iwwa project backend. The source code for the
the frontend can be found at
[innowatio/iwwa-front](https://github.com/innowatio/iwwa-front).


## Development environment setup

If you don't have `meteor` installed, you can install it following instructions
at [meteor.com/install](https://www.meteor.com/install).

```sh
git clone https://github.com/innowatio/iwwa-back.git
cd iwwa-back
meteor npm install
meteor
```

## Production environment setup

You should set the follow environment variables:

```sh
ENVIRONMENT="production"
MONGO_URL
ROOT_URL
```
## Innowatio SSO integration flow

Some explanation about the integration with Innowatio SSO system considering both server and client side.

##### <a name="token"></a>Login with Innowatio token
1. Client-side, when the user is logged out from meteor, a request is made to the SSO system in order to get the user's Innowatio token:
- If it doesn't return any token, user is not authenticated in the SSO system, therefore a login form is showed and user can proceed with [credentials authentication](#credentials).
- If a token is returned, meteor login can be called as:
```javascript
Asteroid.login({
    sso: {
        tokenId: returnedTokenId
    }
});
```
2. In the second case, server-side token is validated and user's information are persisted to the app users collection.
3. Once everything is done successfully, meteor authentication is provided.

##### Meteor authentication resume (and single sign out)
1. Server-side, with the resume of meteor authentication for a user, his Innowatio token is validated:
- If the token is still valid, user's information are updated and meteor authentication is resumed.
- If the token is not valid, user is logged out from meteor, implementing single sign out (in fact SSO system invalidate token on user logout).
2. In the second case, application flow will [check again for a new Innowatio token](#token)

##### <a name="credentials"></a>Login with credentials
1. When a user is logged out from meteor and Innowatio SSO system, one can login with Innowatio credentials. Meteor login can be called as:
```javascript
Asteroid.login({
    sso: {
        username: value,
        password: value
    }
});
```
2. Server-side, authenticate call is made to the SSO sytem which provide a token in case of success. User's Innowatio token is persisted together with user's information.
3. Meteor authentication is also established.

##### Other client-side facts
- Whenever a user is authenticated with meteor, user's Innowatio token is set also in the SSO system (a specific domain).
- Whenever a user manually logout from application, besides meteor logout, user's Innowatio token is also removed from SSO system.
- In development environment set `SKIP_SSO` env var to skip the single sign-on login.
