This is the fusion blockchain node watching tool.

### Config setting
- .env
	change the necessary config file. 
	For exmaple...
		script filename and path,
		node id or name
		...
- restart.sh
	change the script action with your node restaring logic.

### Compile
	1. Please install the nodejs and npm on your machine.
	2. In the project folder enter the following command.
		npm install
	3. Compile the typescript source file
		npm test
		(after watching log enter the ^C on the console)

### Install
	1. Please install the pm2 package.
		npm install -g pm2
	2. Please start the script by pm2 tool.
		pm2 start index.js
	3. Please save the script running to restart automatically after machine restart 
		pm2 save
	4. You can see the log of script running by this command.
		pm2 log index

	