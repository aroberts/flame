# Flame

![Homescreen screenshot](.github/home.png)

## Fork info [aroberts]
This fork primarily exists to support several reverse proxy features. Specifically, hiding and showing apps based on the logged in user (and their groups) according to a reverse proxy (e.g. [Authelia](https://github.com/authelia/authelia)). I tried to make the overall system more static as well, and configure via deployment rather than in the application, but much of the in-app modification code is still in place to facilitate merges.

I also included commits from some other forks:
 - (glitchcrab/fix/non-root) remove chown from CMD to allow image to run as an unprivileged user
 - (pmjklemm/fix_sameTab) fix sameTab for prefix==l
 - (fdarveau) categories for apps

### Fork configuration

New environment variables:
 - `FLAME_RP_USER_HEADER`: Header containing the logged in user's id [`Remote-User`]
 - `FLAME_RP_GROUPS_HEADER`: Header containing the logged in user's groups [`Remote-Groups`]
 - `FLAME_RP_GROUPS_SEPARATOR`: Separator string for the user's groups [`,`]
 - `FLAME_DEFAULT_CATEGORY_LABEL`: use the contents of this label as the default docker category when none is provided. If the provided label is unset on the image, or no label is provided, Flame will fall back to a default `Docker` category.

New labels:
  - `flame.users.allow`
  - `flame.users.deny`
  - `flame.groups.allow`
  - `flame.groups.deny`

Each of these are comma-delimited lists of users or groups to be allowed or denied when deciding whether or not to show a particular app. If multiple apps are declared for the same deployed image, use a semicolon to delimit the lists for each app. The ACL rules follow this algorithm:
- if `allow` is not specified, all users/groups are allowed
- if `deny` is not specified, no users/groups are denied
- when both are specified, `allow` overrides `deny`
- when both are specified, `user` overrides `group`

This logic was only added to the docker provider.

### Other changes

 - Most settings are now unchangeable from the app; Settings are loaded from the `initialConfig.json` file on every boot instead.
 - Apps and categories are *wiped on boot*. 
 - Categories can be assigned an order via the `flame.category.order` docker label. Order is numeric and results are sorted ascending.

## Important update 2021-12-10 [fdarveau]
Due to prolonged inactivity on my end and multiple conflicting changes with the original repository, I applied app categories from scratch using the original repository's code. **This means there are some breaking changes, the biggest one being the database**. The database schemas of the old version and the new one are incompatible. You will need to delete/rename the previous database file so Flame can re-create it. You can then add your apps/bookmarks manually.

If you encounter any problem, you can open an Issue in this fork so I can look into it.

## Description

Flame is self-hosted startpage for your server. Its design is inspired (heavily) by [SUI](https://github.com/jeroenpardon/sui). Flame is very easy to setup and use. With built-in editors, it allows you to setup your very own application hub in no time - no file editing necessary.

## Functionality
- 📝 Create, update, delete your applications and bookmarks directly from the app using built-in GUI editors
- 📌 Pin your favourite items to the homescreen for quick and easy access
- 🔍 Integrated search bar with local filtering, 11 web search providers and ability to add your own
- 🔑 Authentication system to protect your settings, apps and bookmarks
- 🔨 Dozens of options to customize Flame interface to your needs, including support for custom CSS, 15 built-in color themes and custom theme builder
- ☀️ Weather widget with current temperature, cloud coverage and animated weather status
- 🐳 Docker integration to automatically pick and add apps based on their labels

## Installation

### With Docker (recommended)

```sh
docker pull ghcr.io/aroberts/flame:latest

# for ARM architecture (e.g. RaspberryPi)
docker pull ghcr.io/aroberts/flame:latest:multiarch

# installing specific version
docker pull ghcr.io/aroberts/flame:2021-12-12
```

#### Deployment

```sh
# run container
docker run -p 5005:5005 -v /path/to/data:/app/data -e PASSWORD=flame_password ghcr.io/aroberts/flame:latest
```

#### Building images

```sh
# build image for amd64 only
docker build -t flame -f .docker/Dockerfile .

# build multiarch image for amd64, armv7 and arm64
# building failed multiple times with 2GB memory usage limit so you might want to increase it
docker buildx build \
  --platform linux/arm/v7,linux/arm64,linux/amd64 \
  -f .docker/Dockerfile.multiarch \
  -t flame:multiarch .
```

#### Docker-Compose

```yaml
version: '3.6'

services:
  flame:
    image: ghcr.io/aroberts/flame:latest
    container_name: flame
    volumes:
      - /path/to/host/data:/app/data
      - /var/run/docker.sock:/var/run/docker.sock # optional but required for Docker integration
    ports:
      - 5005:5005
    secrets:
      - password # optional but required for (1)
    environment:
      - PASSWORD=flame_password
      - PASSWORD_FILE=/run/secrets/password # optional but required for (1)
    restart: unless-stopped

# optional but required for Docker secrets (1)
secrets:
  password:
    file: /path/to/secrets/password
```

##### Docker Secrets

All environment variables can be overwritten by appending `_FILE` to the variable value. For example, you can use `PASSWORD_FILE` to pass through a docker secret instead of `PASSWORD`. If both `PASSWORD` and `PASSWORD_FILE` are set, the docker secret will take precedent.

```bash
# ./secrets/flame_password
my_custom_secret_password_123

# ./docker-compose.yml
secrets:
  password:
    file: ./secrets/flame_password
```

#### Skaffold

```sh
# use skaffold
skaffold dev
```

### Without Docker

Follow instructions from wiki: [Installation without Docker](https://github.com/pawelmalak/flame/wiki/Installation-without-docker)

## Development

### Technology

- Backend
  - Node.js + Express
  - Sequelize ORM + SQLite
- Frontend
  - React
  - Redux
  - TypeScript
- Deployment
  - Docker
  - Kubernetes

### Creating dev environment

```sh
# clone repository
git clone https://github.com/pawelmalak/flame
cd flame

# run only once
npm run dev-init

# start backend and frontend development servers
npm run dev
```

## Screenshots

![Apps screenshot](.github/apps.png)

![Bookmarks screenshot](.github/bookmarks.png)

![Settings screenshot](.github/settings.png)

![Themes screenshot](.github/themes.png)

## Usage

### Authentication

Visit [project wiki](https://github.com/pawelmalak/flame/wiki/Authentication) to read more about authentication

### Search bar

#### Searching

The default search setting is to search through all your apps and bookmarks. If you want to search using specific search engine, you need to type your search query with selected prefix. For example, to search for "what is docker" using google search you would type: `/g what is docker`.

For list of supported search engines, shortcuts and more about searching functionality visit [project wiki](https://github.com/pawelmalak/flame/wiki/Search-bar).

### Setting up weather module

1. Obtain API Key from [Weather API](https://www.weatherapi.com/pricing.aspx).
   > Free plan allows for 1M calls per month. Flame is making less then 3K API calls per month.
2. Get lat/long for your location. You can get them from [latlong.net](https://www.latlong.net/convert-address-to-lat-long.html).
3. Enter and save data. Weather widget will now update and should be visible on Home page.

### Docker integration

In order to use the Docker integration, each container must have the following labels:

```yml
labels:
  - flame.type=application # "app" works too
  - flame.name=My container
  - flame.url=https://example.com
  - flame.category=My category # Optional, default is "Docker"
  - flame.icon=icon-name # Optional, default is "docker"
  - flame.order=1 # Optional, default is 500; lower number is first in the list
```

> "Use Docker API" option must be enabled for this to work. You can find it in Settings > Docker

You can also set up different apps in the same label adding `;` between each one.

```yml
labels:
  - flame.type=application
  - flame.name=First App;Second App
  - flame.url=https://example1.com;https://example2.com
  - flame.icon=icon-name1;icon-name2
```

If you want to use a remote docker host follow this instructions in the host:

- Open the file `/lib/systemd/system/docker.service`, search for `ExecStart` and edit the value

```text
ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:${PORT} -H unix:///var/run/docker.sock
```

>The above command will bind the docker engine server to the Unix socket as well as TCP port of your choice. “0.0.0.0” means docker-engine accepts connections from all IP addresses.

- Restart the daemon and Docker service

```shell
sudo systemctl daemon-reload
sudo service docker restart
```

- Test if it is working

```shell
curl http://${IP}:${PORT}/version
```

### Kubernetes integration

In order to use the Kubernetes integration, each ingress must have the following annotations:

```yml
metadata:
  annotations:
  - flame.pawelmalak/type=application # "app" works too
  - flame.pawelmalak/name=My container
  - flame.pawelmalak/url=https://example.com
  - flame.pawelmalak/category=My category # Optional, default is "Kubernetes"
  - flame.pawelmalak/icon=icon-name # Optional, default is "kubernetes"
  - flame.pawelmalak/order=1 # Optional, default is 500; lower number is first in the list
```

> "Use Kubernetes Ingress API" option must be enabled for this to work. You can find it in Settings > Docker

### Import HTML Bookmarks (Experimental)

- Requirements
  - python3
  - pip packages: Pillow, beautifulsoup4
- Backup your `db.sqlite` before running script!
- Known Issues:
  - generated icons are sometimes incorrect

```bash
pip3 install Pillow, beautifulsoup4

cd flame/.dev
python3 bookmarks_importer.py --bookmarks <path to bookmarks.html> --data <path to flame data folder>
```

### Custom CSS and themes

> This is an experimental feature. Its behaviour might change in the future.
>
> Follow instructions from wiki: [Custom CSS](https://github.com/pawelmalak/flame/wiki/Custom-CSS)
