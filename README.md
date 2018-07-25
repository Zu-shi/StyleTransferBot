# StyleTransferBot
Discord Bot to Perform Style Transfer on Custom Images

*Last updated July 25, 2018*

## How to Run (Server)
To start this bot on a local server, do the following:
1. Make sure you have Node.js installed
2. Make sure you have installed Discord.js through `npm install discord.js`
3. Run `npm install request` to be able to download images
4. Git clone this [art style transfer repository](https://github.com/anishathalye/neural-style)
5. Change the paths in run_user.bash
6. Create your config.json file
7. Make sure your bot is in the server (and invite if they aren't in already)
8. Open a terminal and run `node index.js`
9. Now you should be able to use the bot in your server. Enjoy!

*Note*: We will make these instructions nicer and more clear later...

## How to Use (in Discord)
`@styletransferbot help` lists the commands for the bot.

To use the bot, first mention the bot however it is called in your server (default @styletransfer) and then type a sentence describing what you would like. Please order your sentence such that the object/subject of interest comes first, and the style comes later. **Both the subject and style should be in quotes (either single or double)**.

Examples:
- `@styletransferbot please paint me some "maple leaves" in the style of "starry night"`
- `@styletransferbot "cat" "gustav klimt"`
- `@styletransferbot I would like "toast and eggs" to look like "yoshitaka amano"`

## Terms of Use
The result images of this bot should **not** be used for any commercial purposes. We have created this bot just for fun, not for profit or for other's profit.
