# SmartChickens

The web visualisation aspect on automated chicken coop management.


#### Branches

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
