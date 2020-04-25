require('dotenv').config()
const Discord = require('discord.js');

const env = process.env;
const TOKEN = env.TEST_BOT_TOKEN;
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const emojiRoleMap = {
    '🇦': 'AWS_RSS',
    '🇧': 'UR',
    '🇨': 'SR',
    '🇩': 'R',
    '🇫': 'UC',
    '🇬': 'C'
}

const rolesmanagement_text = () => {
    const strText = '\n対応した役職を付与します\n';
    const tmp = Object.entries(emojiRoleMap)
    for (const [ key, value ] of tmp) {
        //strText += `${key} : ${value}\n`
    }
    return strText
}

// リアクション起動コード
client.on('messageReactionRemove', async(reaction, user) => {
    const messageAuthorChannelId = reaction.message.channel.id
    // リアクションしたuserがBOTなら処理を終える
    if (user.bot) return
    // 対応する役職がリアクションしたメンバーに付与されていなければ処理を終える
    // {未実装}
    if (reaction.emoji.name in emojiRoleMap) {
        const role = reaction.message.guild.roles.cache.find(role => role.name === emojiRoleMap[reaction.emoji.name]);
        member.roles.remove(role)
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    const messageAuthorChannelId = reaction.message.channel.id
    if (user.bot) return console.log('bot だよ')
    console.log(`${reaction.message.guild} で ${user.tag} が ${reaction.emoji.name} をリアクションしました`)

    const channel = await user.client.channels.fetch(messageAuthorChannelId);
    if (!channel) return console.log('channel が取得できません！')
    const member = await channel.guild.members.fetch(user);
    if (!member) return console.log('member が取得できません！')

    // ボットのメッセージに絵文字リアクションしたかどうか判定
    // ->  してない場合 -> 処理を終える
    // ->  した場合は -> 本文に「対応した役職を付与します」があれば -> 役職を付与する処理を行う
    // const bot = await channel.guild.members.fetch(reacton.message.author.id);
    // if (!bot) return 'bot の絵文字にリアクションしていません！'
    if (reaction.emoji.name in emojiRoleMap) {
        const role = reaction.message.guild.roles.cache.find(role => role.name === emojiRoleMap[reaction.emoji.name]);
        member.roles.add(role)
    }
})

client.on('message', message => {
    // ボットの場合は処理をしない
    console.log('---start---');
    if(message.author.bot) {
        console.log('---bot---');
        //message.react('0️⃣');
        let tmp = Object.entries(emojiRoleMap)
        for (let [ key, value ] of tmp) {
            message.react(key);
        }
        return;
    }
    message.react('💩');

    // 人のメッセージの中に特定の文字列(今回なら!rolesmanagement)なら処理をする
    if(message.content === '!rolesmanagement') {
        console.log('---command---');
        let channel = message.channel;
        let author = message.author.username;
        let reply_text = rolesmanagement_text();
        // メッセージへリアクション
        message.reply(reply_text)
            .then(message => console.log(`Sent message: ${reply_text}`))
            .catch(console.error);
        return;
    }
});

client.login(TOKEN);
