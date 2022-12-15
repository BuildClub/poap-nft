# CollectPUps - Collect Godwoken Power Ups

[Godwoken Power Ups](https://collectpups.com/) (PUps) are NFTs to celebrate events, be given as prizes, and more. These are similar to [POAPs](https://www.coindesk.com/learn/poaps-what-is-a-proof-of-attendance-protocol/) from other ecosystems.

## Developing

These instructions describe how to launch and run a development environment using this code base.

If you don't need to develop and just want to use the site, please visit [CollectPUps.com](https://collectpups.com/).

### Supported Environments
- Ubuntu Linux 20.04

### Prerequisites

- [Node.js 16](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

Note: The current user must have permission to manage Docker instances. [How to manage Docker as a non-root user.](https://docs.docker.com/engine/install/linux-postinstall/)

### Quick Start

```sh
git clone git@github.com:BuildClub/poap-nft.git
cd poap-nft

# Install server dependencies.
yarn install

# Configure the server domain name if not localhost (DOMEN_NAME).
nano .env.dev

# Start backend server in development mode and rebuild.
docker-compose -f docker-compose.local.yml up --build

# Install client dependencies.
cd client
yarn install

# Copy the development .env file
cp .env.dev .env

# Configure the client domain name if not localhost (REACT_APP_BACKEND_URL).
nano .env

# Start frontend server in development mode.
cd client
yarn start
```

### Granting Admin Privileges to an Account 

There are two types of accounts: Regular accounts and admin accounts. Anyone can sign up for a regular account, but events can only be approved by admin accounts.  

To create an admin account, use the regular sign up form to create a normal account, then use the steps below to grant admin privileges to that account in the database.

```sh
# Launch MongoDB console.
docker-compose -f docker-compose.local.yml exec mongo mongosh "mongodb://memo_nft:memo_pswd@mongo:27017/poap-db?retryWrites=true&w=majority"

# View all users. (Optional step to view all accounts.)
db.users.find()

# Update the isAdmin flag on a specific account.
db.users.update({email: "<INSERT_EMAIL_ADDRESS>"}, {$set: {isAdmin: true}})
```
