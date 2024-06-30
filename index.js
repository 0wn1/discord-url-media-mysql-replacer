const { Client, GatewayIntentBits } = require('discord.js');
const mysql = require('mysql2');

const Config = {
    Token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Discord Bot Token: https://discord.com/developers/applications
	ChannelId: 'xxxxxxxxxxxx', // Text Channel Id
    DeleteMessages: true, // Auto deletes sent messages after replacing media URLs
    MaxAttempts: 5, // Maximum attempts to retry requesting valid URL
    Database: {
        host: 'localhost', // Database host address
        user: 'root', // Database username
        password: '', // Database password
        database: 'database' // Database name
    },
    Tables: [
	{
            name: 'smartphone_instagram_posts', // Database table name
            column: 'image', // Database column name
            startFrom: 1 // Start from this ID
        },
        {
            name: 'smartphone_gallery',
            column: 'url',
            startFrom: 1
        },
        {
            name: 'smartphone_instagram',
            column: 'avatarURL',
            startFrom: 1
        },
        {
            name: 'smartphone_whatsapp',
            column: 'avatarURL',
            startFrom: 1
        },
        {
            name: 'smartphone_twitter_tweets',
            column: 'image',
            startFrom: 1
        },
        {
            name: 'smartphone_weazel',
            column: 'imageURL',
            startFrom: 1
        },
        {
            name: 'smartphone_whatsapp_groups',
            column: 'imageURL',
            startFrom: 1
        },
        {
            name: 'smartphone_twitter_profiles',
            column: 'avatarURL',
            startFrom: 1
        },
        {
            name: 'smartphone_tinder',
            column: 'image',
            startFrom: 1
        },
        {
            name: 'smartphone_whatsapp_messages',
            column: 'content',
            startFrom: 1
        }
    ]
};

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const db = mysql.createConnection(Config.Database);

async function FetchAndUpdateImages() {
    for (const table of Config.Tables) {
        let count = 0;
        const query = `SELECT ${table.column} FROM ${table.name} WHERE id >= ${table.startFrom}`;

        await new Promise((resolve, reject) => {
            db.query(query, async (QueryError, results) => {
                if (QueryError) return reject(QueryError);

                for (const row of results) {
                    const OldURL = row[table.column];
                    if (OldURL && typeof OldURL === 'string' && OldURL.includes('http')) {
                        try {
                            const ValidURL = await GetProxyURL(OldURL);
                            const Update = `UPDATE ${table.name} SET ${table.column} = ? WHERE ${table.column} = ?`;

                            await new Promise((updateResolve, updateReject) => {
                                db.query(Update, [ValidURL, OldURL], (UpdateError) => {
                                    if (UpdateError) return updateReject(UpdateError);
                                    count++;
                                    updateResolve();
                                });
                            });
                        } catch (err) {
                            console.error(`Error processing URL ${OldURL}: ${err.message}`);
                        }
                    } else {
                        console.error(`Invalid or null URL found: ${OldURL}`);
                    }
                }
                console.log(`${count} URLs replaced from ${table.name}`);
                resolve();
            });
        }).catch((err) => {
            console.error(`Query failed: ${err.message}`);
        });
    }
    console.log("All table updates completed. Exiting script.");
    process.exit(0);
}

async function GetProxyURL(url) {
    const channel = client.channels.cache.get(Config.ChannelId);
    let lastMessage = null;
    let attempts = 0;

    while (attempts < Config.MaxAttempts) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 100));
        if (lastMessage) {
            await lastMessage.delete();
        }

        let Message = await channel.send(url);

        let ValidURL = Message.embeds[0]?.data?.thumbnail?.proxy_url;
        if (ValidURL) {
            if (Config.DeleteMessages) {
                await Message.delete();
            }
            console.log('OK');
            return ValidURL;
        } else {
            lastMessage = Message;
        }
    }
    
    return url;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    FetchAndUpdateImages();
});

client.login(Config.Token);
