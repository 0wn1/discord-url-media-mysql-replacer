const { Client, GatewayIntentBits } = require('discord.js');
const mysql = require('mysql2');

const Config = {
	token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Discord App Token: https://discord.com/developers/applications
	channelId: 'xxxxxxxxxxxx', // Text Channel AppId
	DeleteMessages: true // Auto deletes sent messages after replacing media URLs
};

Config.Database = {
	host: 'localhost', // Database host adress
	user: 'root', // Database username
	password: '', // Database password
	database: 'creative' // Database name
};

Config.Tables = [
	{
		name: 'smartphone_gallery', // Database table name
		column: 'url' // Database column name
	},
	/* {
		name: 'tablename2',
		column: 'columname'
	} */
];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const db = mysql.createConnection(Config.Database);

async function FetchAndUpdateImages() {
	for (const table of Config.Tables) {
		let count = 1;
		const query = `SELECT ${table.column} FROM ${table.name}`;

		await new Promise((resolve, reject) => {
			db.query(query, async (QueryError, results) => {
				if (QueryError) return reject(QueryError);

				for (const row of results) {
					const OldURL = row[table.column];
					try {
						const ValidURL = await GetProxyURL(OldURL);
						const Update = `UPDATE ${table.name} SET ${table.column} = ? WHERE ${table.column} = ?`;

						db.query(Update, [ValidURL, OldURL], (UpdateError) => {
							if (UpdateError) throw UpdateError;
							count++;
						});
					} catch (err) {
						console.error(err.message);
					}
				}
				console.log(`${count} URLs replaced from ${table.name}`);
				resolve();
			});
		});
	}
}

async function GetProxyURL(url) {

	const channel = client.channels.cache.get(Config.channelId);
	const Message = await channel.send(url);

	const ValidURL = Message.embeds[0]?.data?.thumbnail?.proxy_url

	if (Config.DeleteMessages) {
		await Message.delete();
	}

	if (ValidURL) {
		return ValidURL;
	} else {
		throw new Error('URL not found ');
	}
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
	FetchAndUpdateImages();
});

client.login(Config.token);
