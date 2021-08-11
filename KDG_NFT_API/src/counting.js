const mongoose = require('mongoose')

mongoose.connect('mongodb://KDG:Phamgiavyvn%40%40123@localhost:27017/KDG?authSource=admin', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const fs = require('fs')
const path = require('path')
const models = fs.readdirSync('./models')
models.forEach(model => require(path.join(__dirname, 'models', model)))

const { model } = mongoose
const Streams = model('streams')

async function count () {
    await Streams.updateMany({ status: 1 }, { status: 2, end_date: Date.now() })

    const streams = await Streams.find({ status: 2 })
    for (let index = 0; index < streams.length; index++) {
        const stream = streams[index]
        if (stream.end_date && stream.start_date) {
            stream.length = (new Date(stream.end_date).getTime() - new Date(stream.start_date).getTime()) / 1000
            await stream.save()
        }
        console.log(index)
    }
    // setTimeout(() => {
    //     count()
    // }, 5000);
}
count()
