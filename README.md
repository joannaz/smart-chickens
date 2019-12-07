# SmartChickens

The web visualisation aspect on automated chicken coop management.

### Credentials

#### Credentials for a standard "User"

username: `user`

password: `password`

#### Credentials for an "Admin"

username: `admin`

password: `password`

When logged into the "Admin" account, changing settings won't work as it's not hooked up to a real backend.

### Branches

* Master

This is the default branch that was submitted. It uses JWT to authenticate with an express.js backend. More info can be found [here](https://joannaz.github.io/corpus/#header-n4366).

* Staging

To get this to work with GitHub pages (without hosting a separate backend), I am re-writing all the services to return dummy data to the application. 

* gh-pages

The branch GitHub pages uses. To deploy, clone down repo, checkout staging, then run these commands:

```
ng build --prod --base-href ""  
ngh
```
